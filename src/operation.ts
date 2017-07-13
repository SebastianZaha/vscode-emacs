import * as vscode from 'vscode';
import {Editor} from './editor';

export class Operation {
    private editor: Editor;
    private commandList: { [key: string]: (...args: any[]) => any, thisArgs?: any } = {};

    constructor() {
        this.editor = new Editor();
        this.commandList = {
            'C-k': () => {
                this.editor.kill();
            },
            'C-w': () => {
                this.editor.cut()
            },
            'M-w': () => {
                this.editor.copy()
            },
            'C-y': () => {
                this.editor.yank()
            },
            "C-x_C-o": () => {
                this.editor.deleteBlankLines();
            },
            "C-x_u": () => {
                this.editor.undo();
                this.editor.setStatusBarMessage("Undo!");
            },
            "C-/": () => {
                this.editor.undo();
                this.editor.setStatusBarMessage("Undo!");
            },
            'C-j': () => {
                vscode.commands.executeCommand("lineBreakInsert");
                vscode.commands.executeCommand("emacs.cursorHome");
                vscode.commands.executeCommand("emacs.cursorDown");
            },
            'C-g': () => {
                this.editor.setStatusBarMessage("Quit");
            },
            "C-S_bs": () => {
                this.editor.deleteLine();
            },
            "C-x_r": () => {
                this.editor.setRMode();
            },
            'C-l': () => {
                this.editor.scrollLineToCenter()
            }
        };
    }

    getCommand(commandName: string): (...args: any[]) => any {
        return this.commandList[commandName];
    }

    onType(text: string): void {
        this.editor.onType(text);
    }
}
