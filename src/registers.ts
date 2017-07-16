import * as vscode from 'vscode';

export enum RegisterKind {
    KText = 1,
    KPoint = 2,
    KRectangle = 3
};

export class RectangleContent { // TODO: move it to rectangle.ts eventually.
    // TBD
};

export class RegisterContent {
    private kind: RegisterKind;
    private content: string              // stores region/text
                     | vscode.Position   // stores position
                     | RectangleContent; // stores rectangle

    constructor(registerKind: RegisterKind, registerContent: string | vscode.Position | RectangleContent) {
        this.kind = registerKind;
        this.content = registerContent;
    }

    static fromRegion(registerContent: string) {
        return new this(RegisterKind.KText, registerContent);
    }

    static fromPoint(registerContent: vscode.Position) {
        return new this(RegisterKind.KPoint, registerContent);
    }

    static fromRectangle(registerContent: RectangleContent) {
        return new this(RegisterKind.KRectangle, registerContent);
    }

    getRegisterKind(): RegisterKind {
        return this.kind;
    }

    getRegisterContent(): string | vscode.Position | RectangleContent {
        return this.content;
    }
};
