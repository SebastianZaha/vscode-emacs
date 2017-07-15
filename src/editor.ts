import * as vscode from 'vscode';
import { RegisterContent, RectangleContent, RegisterKind } from './registers';

enum KeybindProgressMode {
    None,   // No current keybind is currently in progress
    RMode,  // Rectangle and/or Register keybinding  [started by 'C-x+r'] is currently in progress
    RModeS, // 'Save Region in register' keybinding [started by 'C-x+r+s'] is currently in progress
    RModeI, // 'Insert Register content into buffer' keybinding [started by 'C-x+r+i'] is currently in progress
    AMode,  // (FUTURE, TBD) Abbrev keybinding  [started by 'C-x+a'] is currently in progress
    MacroRecordingMode  // (FUTURE, TBD) Emacs macro recording [started by 'Ctrl-x+('] is currently in progress
};

export class Editor {
    private keybindProgressMode: KeybindProgressMode;
    private registersStorage: { [key: string]: RegisterContent; };
    private lastKill: vscode.Position // if kill position stays the same, append to clipboard
    private justDidKill: boolean
    private static inMarkMode: boolean = false
    private static markHasMoved: boolean = false
    private positions: Array<vscode.Position> = new Array();

    static getInMarkMode(): boolean {
        return Editor.inMarkMode;
    }

    static setInMarkMode(val: boolean): void {
        Editor.inMarkMode = val;
    }

    static getMarkHasMoved(): boolean {
        return Editor.markHasMoved;
    }

    static setMarkHasMoved(val: boolean): void {
        Editor.markHasMoved = val;
    }

    constructor() {
        this.keybindProgressMode = KeybindProgressMode.None
        this.registersStorage = {}
        this.justDidKill = false
        this.lastKill = null

        vscode.window.onDidChangeActiveTextEditor(event => {
            this.lastKill = null
        })
        vscode.workspace.onDidChangeTextDocument(event => {
            if (!this.justDidKill) {
                this.lastKill = null
            }
            this.justDidKill = false
        })
    }

    static isOnLastLine(): boolean {
        return vscode.window.activeTextEditor.selection.active.line == vscode.window.activeTextEditor.document.lineCount - 1
    }

    goBack(select: boolean): void {
        if (this.positions.length > 0) {
            var jumpPosition = this.positions.pop()
            var currentPosition = vscode.window.activeTextEditor.selection.active;

            if (jumpPosition.line - currentPosition.line != 0) {
                vscode.commands.executeCommand("cursorMove", {
                    to: "down",
                    value: jumpPosition.line - currentPosition.line,
                    select: select
                })
            }

            vscode.commands.executeCommand("cursorMove", {
                to: "wrappedLineStart",
                select: select
            })

            vscode.commands.executeCommand("cursorMove", {
                to: "right",
                value: jumpPosition.character,
                select: select
            })
        }
    }

    setStatusBarMessage(text: string): vscode.Disposable {
        return vscode.window.setStatusBarMessage(text, 1000);
    }

    setStatusBarPermanentMessage(text: string): vscode.Disposable {
        return vscode.window.setStatusBarMessage(text);
    }

    getSelectionRange(): vscode.Range {
        let selection = vscode.window.activeTextEditor.selection,
            start = selection.start,
            end = selection.end;

        return (start.character !== end.character || start.line !== end.line) ? new vscode.Range(start, end) : null;
    }

    getSelection(): vscode.Selection {
        return vscode.window.activeTextEditor.selection;
    }

    getSelectionText(): string {
        let r = this.getSelectionRange()
        return r ? vscode.window.activeTextEditor.document.getText(r) : ''
    }

    setSelection(start: vscode.Position, end: vscode.Position): void {
        let editor = vscode.window.activeTextEditor;
        editor.selection = new vscode.Selection(start, end);
    }

    getCurrentPos(): vscode.Position {
        return vscode.window.activeTextEditor.selection.active
    }

    // Kill to end of line
    killForward(): void {
        // Ignore whatever we have selected before
        vscode.commands.executeCommand("emacs.exitMarkMode")
        // move cursor to the end of the line and select the text
        vscode.commands.executeCommand("cursorMove", {
            to: "wrappedLineEnd",
            select: true
        })
        // editor.action.clipboardCutAction is too slow!
        vscode.commands.executeCommand("editor.action.clipboardCopyAction");
        vscode.commands.executeCommand("deleteAllRight");
    }

    // Kill to beginning of line
    killBackward(): void {
        // Ignore whatever we have selected before
        vscode.commands.executeCommand("emacs.exitMarkMode")
        // move cursor to the beginning of the line and select the text
        vscode.commands.executeCommand("cursorMove", {
            to: "wrappedLineStart",
            select: true
        })
        // editor.action.clipboardCutAction is too slow!
        vscode.commands.executeCommand("editor.action.clipboardCopyAction");
        vscode.commands.executeCommand("deleteAllLeft");
    }

    copy(): void {
        vscode.commands.executeCommand("editor.action.clipboardCopyAction")
        vscode.commands.executeCommand("emacs.exitMarkMode")
    }

    cut(): void {
        vscode.commands.executeCommand("editor.action.clipboardCutAction")
        Editor.inMarkMode = false
    }

    yank(): Thenable<{}> {
        this.justDidKill = false
        return Promise.all([
            vscode.commands.executeCommand("editor.action.clipboardPasteAction"),
            vscode.commands.executeCommand("emacs.exitMarkMode")])
    }

    undo(): void {
        vscode.commands.executeCommand("undo");
    }

    private getFirstBlankLine(range: vscode.Range): vscode.Range {
        let doc = vscode.window.activeTextEditor.document;

        if (range.start.line === 0) {
            return range;
        }
        range = doc.lineAt(range.start.line - 1).range;
        while (range.start.line > 0 && range.isEmpty) {
            range = doc.lineAt(range.start.line - 1).range;
        }
        if (range.isEmpty) {
            return range;
        } else {
            return doc.lineAt(range.start.line + 1).range;
        }
    }

    async deleteBlankLines() {
        let selection = this.getSelection(),
            anchor = selection.anchor,
            doc = vscode.window.activeTextEditor.document,
            range = doc.lineAt(selection.start.line).range,
            nextLine: vscode.Position;

        if (range.isEmpty) {
            range = this.getFirstBlankLine(range);
            anchor = range.start;
            nextLine = range.start;
        } else {
            nextLine = range.start.translate(1, 0);
        }
        selection = new vscode.Selection(nextLine, nextLine);
        vscode.window.activeTextEditor.selection = selection;

        for (let line = selection.start.line;
            line < doc.lineCount - 1 && doc.lineAt(line).range.isEmpty;
            ++line) {

            await vscode.commands.executeCommand("deleteRight")
        }
        vscode.window.activeTextEditor.selection = new vscode.Selection(anchor, anchor)
    }

    static delete(range: vscode.Range = null): Thenable<boolean> {
        if (range) {
            return vscode.window.activeTextEditor.edit(editBuilder => {
                editBuilder.delete(range);
            });
        }
    }

    setRMode(): void {
        this.setStatusBarPermanentMessage("C-x r");
        this.keybindProgressMode = KeybindProgressMode.RMode;
        return;
    }

    onType(text: string): void {
        let fHandled = false;
        switch (this.keybindProgressMode) {
            case KeybindProgressMode.RMode:
                switch (text) {
                    // Rectangles
                    case 'r':
                        this.setStatusBarMessage("'C-x r r' (Copy rectangle to register) is not supported.");
                        this.keybindProgressMode = KeybindProgressMode.None;
                        fHandled = true;
                        break;

                    case 'k':
                        this.setStatusBarMessage("'C-x r k' (Kill rectangle) is not supported.");
                        this.keybindProgressMode = KeybindProgressMode.None;
                        fHandled = true;
                        break;

                    case 'y':
                        this.setStatusBarMessage("'C-x r y' (Yank rectangle) is not supported.");
                        this.keybindProgressMode = KeybindProgressMode.None;
                        fHandled = true;
                        break;

                    case 'o':
                        this.setStatusBarMessage("'C-x r o' (Open rectangle) is not supported.");
                        this.keybindProgressMode = KeybindProgressMode.None;
                        fHandled = true;
                        break;

                    case 'c':
                        this.setStatusBarMessage("'C-x r c' (Blank out rectangle) is not supported.");
                        this.keybindProgressMode = KeybindProgressMode.None;
                        fHandled = true;
                        break;

                    case 't':
                        this.setStatusBarMessage("'C-x r t' (prefix each line with a string) is not supported.");
                        this.keybindProgressMode = KeybindProgressMode.None;
                        fHandled = true;
                        break;

                    // Registers
                    case 's':
                        this.setStatusBarPermanentMessage("Copy to register:");
                        this.keybindProgressMode = KeybindProgressMode.RModeS;
                        fHandled = true;
                        break;

                    case 'i':
                        this.setStatusBarPermanentMessage("Insert register:");
                        this.keybindProgressMode = KeybindProgressMode.RModeI;
                        fHandled = true;
                        break;

                    default:
                        break;
                }
                break;

            case KeybindProgressMode.RModeS:
                this.setStatusBarPermanentMessage("");
                this.saveTextToRegister(text);
                this.keybindProgressMode = KeybindProgressMode.None;
                fHandled = true;
                break;

            case KeybindProgressMode.RModeI:
                this.setStatusBarPermanentMessage("");
                this.restoreTextFromRegister(text);
                this.keybindProgressMode = KeybindProgressMode.None;
                fHandled = true;
                break;

            case KeybindProgressMode.AMode: // not supported [yet]
            case KeybindProgressMode.MacroRecordingMode: // not supported [yet]
            case KeybindProgressMode.None:
            default:
                this.keybindProgressMode = KeybindProgressMode.None;
                this.setStatusBarPermanentMessage("");
                break;
        }

        if (!fHandled) {
            // default input handling: pass control to VSCode
            vscode.commands.executeCommand('default:type', {
                text: text
            });
        }
        return;
    }

    saveTextToRegister(registerName: string): void {
        if (null === registerName) {
            return;
        }
        let range: vscode.Range = this.getSelectionRange();
        if (range !== null) {
            let selectedText = vscode.window.activeTextEditor.document.getText(range);
            if (null !== selectedText) {
                this.registersStorage[registerName] = RegisterContent.fromRegion(selectedText);
            }
        }
        return;
    }

    restoreTextFromRegister(registerName: string): void {
        vscode.commands.executeCommand("emacs.exitMarkMode"); // emulate Emacs
        let obj: RegisterContent = this.registersStorage[registerName];
        if (null === obj) {
            this.setStatusBarMessage("Register does not contain text.");
            return;
        }
        if (RegisterKind.KText === obj.getRegisterKind()) {
            const content: string | vscode.Position | RectangleContent = obj.getRegisterContent();
            if (typeof content === 'string') {
                vscode.window.activeTextEditor.edit(editBuilder => {
                    editBuilder.insert(this.getSelection().active, content);
                });
            }
        }
        return;
    }

    deleteLine(): void {
        vscode.commands.executeCommand("emacs.exitMarkMode"); // emulate Emacs
        vscode.commands.executeCommand("editor.action.deleteLines");
    }

    scrollLineToCenter() {
        const editor = vscode.window.activeTextEditor
        const selection = editor.selection
        const range = new vscode.Range(selection.start, selection.end)
        editor.revealRange(range, vscode.TextEditorRevealType.InCenter)
    }

    breakLine() {
        vscode.commands.executeCommand("lineBreakInsert");
        vscode.commands.executeCommand("emacs.cursorHome");
        vscode.commands.executeCommand("emacs.cursorDown");
    }

    enterMarkMode(): void {
        if (Editor.inMarkMode && !Editor.markHasMoved) {
            this.exitMarkMode();
        } else {
            this.positions.push(vscode.window.activeTextEditor.selection.active)
            this.exitMarkMode();
            Editor.inMarkMode = true;
            Editor.markHasMoved = false;
        }
    }

    exitMarkMode(): void {
        vscode.commands.executeCommand("cancelSelection");
        Editor.inMarkMode = false;
    }
}
