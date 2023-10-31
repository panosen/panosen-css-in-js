import { murmurhash3_32_gc } from "@panosen/murmur-hash";

import { CssSheet } from './css-sheet';

function buildContent(rules: Map<string, string>): string {
    let items: string[] = [];
    rules.forEach((v, k) => {
        items.push(k + ':' + v);
    })
    return '{' + items.join(';') + '}';
}

export class CssRule {

    private readonly sheet: CssSheet;

    private rules: Map<string, string> = new Map<string, string>();

    private _hover?: CssRule;

    constructor(sheet: CssSheet) {
        this.sheet = sheet;
    }

    public addStyle(key: string, value: string): CssRule {
        this.rules.set(key, value);
        return this;
    }

    public hover(): CssRule {
        this._hover = new CssRule(this.sheet);
        return this._hover;
    }

    public build(): string {

        let content = buildContent(this.rules);
        let name = 'pano-' + murmurhash3_32_gc(content).toString(36);
        this.sheet.insert('.' + name + content);

        if (this._hover) {
            let hoverName = '.' + name + ':hover';
            let hoverContent = buildContent(this._hover.rules);
            this.sheet.insert(hoverName + hoverContent);
        }

        return name;
    }

    // #region style extension

    public margin(margin: string): CssRule {
        return this.addStyle('margin', margin);
    }

    public display(display: string): CssRule {
        return this.addStyle('display', display);
    }

    public padding(padding: string): CssRule {
        return this.addStyle('padding', padding);
    }

    public color(color: string): CssRule {
        return this.addStyle('color', color);
    }

    public backgroundColor(backgroundColor: string): CssRule {
        return this.addStyle('background-color', backgroundColor);
    }

    public border(border: string): CssRule {
        return this.addStyle('border', border);
    }

    public background(background: string): CssRule {
        return this.addStyle('background', background);
    }

    public cursor(cursor: string): CssRule {
        return this.addStyle('cursor', cursor);
    }

    public borderStyle(borderStyle: string): CssRule {
        return this.addStyle('border-style', borderStyle);
    }

    public borderColor(borderColor: string): CssRule {
        return this.addStyle('border-color', borderColor);
    }

    public borderWidth(borderWidth: string): CssRule {
        return this.addStyle('border-width', borderWidth);
    }

    // #endregion
}