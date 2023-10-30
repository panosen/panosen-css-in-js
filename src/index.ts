

import { CssRule } from './css-trule'
import { CssSheet } from './css-sheet'

let sheet: CssSheet = new CssSheet({
    speedy: false,
    key: 'pano',
    container: document.head
});

export function createRule(): CssRule {
    var sheetRule = new CssRule(sheet);
    return sheetRule;
}