import * as vscode from 'vscode';
import { Operation } from './operation';
import { Editor } from "./editor";

export function activate(context: vscode.ExtensionContext): void {
    let op = new Operation(),
        commandList: string[] = [
            "C-g", "enterMarkMode", "exitMarkMode",

            // Edit
            "C-k", "M-0_C-k", "C-w", "M-w", "C-y",
            "C-x_C-o", "C-x_u", "C-/", "C-j", "C-S_bs",

            // Navigation
            "C-l", "C-u_C-spc", "C-x_C-x",

            // R-Mode
            "C-x_r"
        ],
        cursorMoves: string[] = [
            "cursorUp", "cursorDown", "cursorLeft", "cursorRight",
            "cursorHome", "cursorEnd",
            "cursorWordLeft", "cursorWordRight",
            "cursorPageDown", "cursorPageUp",
            "cursorTop", "cursorBottom"
        ];

    commandList.forEach(commandName => {
        context.subscriptions.push(registerCommand(commandName, op));
    });

    cursorMoves.forEach(element => {
        context.subscriptions.push(vscode.commands.registerCommand(
            "emacs." + element, () => {
                Editor.setMarkHasMoved(true);
                vscode.commands.executeCommand(
                    Editor.getInMarkMode() ?
                        element + "Select" :
                        element
                );
            })
        )
    });

    // 'type' is not an "emacs." command and should be registered separately
    context.subscriptions.push(vscode.commands.registerCommand("type", function (args) {
        if (!vscode.window.activeTextEditor) {
            return;
        }
        op.onType(args.text);
    }));
}

export function deactivate(): void {
}

function registerCommand(commandName: string, op: Operation): vscode.Disposable {
    return vscode.commands.registerCommand("emacs." + commandName, op.getCommand(commandName));
}
