import {Editor} from './editor';

export class Operation {
    private editor: Editor;
    private commandList: { [key: string]: (...args: any[]) => any, thisArgs?: any } = {};

    constructor() {
        this.editor = new Editor();
        this.commandList = {
            "enterMarkMode": () => {
                this.editor.enterMarkMode()
            },
            "exitMarkMode": () => {
                this.editor.exitMarkMode()
            },
            'C-k': () => {
                this.editor.killForward();
            },
            'M-0_C-k': () => {
                this.editor.killBackward();
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
                this.editor.breakLine();
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
            },
            'C-u_C-spc': () => {
                this.editor.goBack(false)
            },
            'C-x_C-x': () => {
                this.editor.goBack(true)
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
