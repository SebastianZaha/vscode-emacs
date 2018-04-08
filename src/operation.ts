import {Editor} from './editor';
import {Workspace} from './workspace';

export class Operation {
    private editor: Editor;
    private workspace: Workspace;
    private commandList: { [key: string]: (...args: any[]) => any, thisArgs?: any } = {};

    constructor() {
        this.editor = new Editor();
        this.workspace = new Workspace();

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
                this.editor.breakLine();
            },
            'C-g': () => {
                this.editor.setStatusBarMessage("Quit");
            },
            "C-S_bs": () => {
                this.editor.deleteLine();
            },
            'C-l': () => {
                this.editor.scrollLineToCenterTopBottom()
            },
            'deleteLeft': () => {this.editor.deleteLeft()},
            'deleteRight': () => {this.editor.deleteRight()},

            'shellCommand': () => {this.workspace.toggleTerminal()}
        };
    }

    getCommand(commandName: string): (...args: any[]) => any {
        return this.commandList[commandName];
    }
}
