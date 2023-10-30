import { murmurhash3_32_gc } from "@panosen/murmur-hash";

import { CssSheet } from './css-sheet';

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

        let items: string[] = [];
        this.rules.forEach((v, k) => {
            items.push(k + ':' + v);
        })

        let content = '{' + items.join(';') + '}';
        let name = 'pano-' + murmurhash3_32_gc(content).toString(36);
        this.sheet.insert('.' + name + content);

        return name;
    }
}