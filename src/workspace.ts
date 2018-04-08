import * as vscode from "vscode";


export class Workspace {
    private static terminal: Terminal;

    constructor() {
        if (!Workspace.terminal) {
            Workspace.terminal = new Terminal();
        }
    }

    showTerminal() {
        Workspace.terminal.show();
    }
    hideTerminal() {
        Workspace.terminal.hide();
    }
    toggleTerminal() {
        Workspace.terminal.toggle();
    }
}


class Terminal {
  private _terminal: vscode.Terminal;
  private _visible: boolean;

  constructor() {
    this._terminal = vscode.window.createTerminal('minibuffer');
    // when the workspace opens, we don't show the terminal
    this._visible = false;
  }

  show() {
    this._terminal.show();
    this._visible = true;
  }

  hide() {
    this._terminal.hide();
    this._visible = false;
  }
  toggle() {
    if (this._visible)
      this.hide();
    else {
      this.show();
    }
  }
}