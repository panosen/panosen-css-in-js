/*

thanks authors of following files.

Based off https://github.com/threepointone/glamor/blob/master/src/sheet.js

Based off https://github.com/emotion-js/emotion/blob/main/packages/sheet/src/index.js


high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.clean()
- empties the stylesheet of all its contents

*/

export interface CssSheetOptions {
    key: string;
    container: Node;
    speedy?: boolean;
    nonce?: string;
}

export class CssSheet {

    isSpeedy: boolean

    count: number

    rules: string[];
    tags: HTMLStyleElement[]

    // Using Node instead of HTMLElement since container may be a ShadowRoot
    container: Node

    key: string

    nonce: string | void

    constructor(options: CssSheetOptions) {
        this.isSpeedy = options.speedy === undefined ? process.env.NODE_ENV === 'production' : options.speedy
        this.rules = []
        this.tags = []
        this.count = 0
        this.nonce = options.nonce
        // key is the value of the data-emotion attribute, it's used to identify different sheets
        this.key = options.key
        this.container = options.container
    }

    insert(rule: string) {
        if (this.rules.indexOf(rule) >= 0) {
            return;
        }
        // the max length is how many rules we have per style tag
        // it's 65000 in speedy mode
        // it's 1 in dev because we insert source maps that map a single rule to a location and you can only have one source map per style tag
        if (this.count % (this.isSpeedy ? 65000 : 1) === 0) {
            let tag: HTMLStyleElement = this.createStyleElement(this.key, this.nonce)
            this.container.appendChild(tag)
            this.tags.push(tag)
        }
        const tag = this.tags[this.tags.length - 1]

        if (this.isSpeedy) {
            const sheet = this.findSheetOfTag(tag);
            if (sheet) {
                try {
                    // this is the ultrafast version, works across browsers
                    // the big drawback is that the css won't be editable in devtools
                    sheet.insertRule(rule, sheet.cssRules.length)
                } catch (e) {
                    console.error(`There was a problem inserting the following rule: "${rule}"`, e)
                }
                console.log(sheet)
            } else {
                console.error('sheet is null or undefined.');
            }
        } else {
            tag.appendChild(document.createTextNode(rule))
        }
        this.rules.push(rule);
        this.count++
    }

    clean() {
        this.tags.forEach(tag => {
            if (tag.parentNode) {
                tag.parentNode.removeChild(tag)
            }
        })
        this.tags = []
        this.count = 0;
    }

    private findSheetOfTag(tag: HTMLStyleElement): CSSStyleSheet | undefined {
        if (tag.sheet) {
            return tag.sheet
        }

        // this weirdness brought to you by firefox
        for (let i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].ownerNode === tag) {
                return document.styleSheets[i]
            }
        }

        return undefined;
    }

    private createStyleElement(key: string, nonce: string | void): HTMLStyleElement {

        let tag = document.createElement('style')
        tag.setAttribute('data-panosen', key)
        if (nonce !== undefined) {
            tag.setAttribute('nonce', nonce)
        }
        tag.appendChild(document.createTextNode(''))
        tag.setAttribute('data-s', '')
        return tag
    }
}
