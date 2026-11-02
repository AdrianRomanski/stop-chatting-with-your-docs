import { defineShikiSetup } from '@slidev/types'

/*
 * Syntax colors of the design guide's code snippet generator
 * (https://design-guide.push-based.io/resources/code-snippet-generator, read 2026-10-05):
 *   dark  — keyword secondary-400, string primary-300, tag/type primary-400, attribute secondary-300,
 *           punctuation neutral-300, text neutral-25
 *   light — keyword secondary-700, string secondary-800, tag/type primary-900, attribute primary-600,
 *           punctuation neutral-700, text neutral-900
 * Comments, numbers and functions are not shown by the generator; they are derived from the palette.
 */
const pushbasedDark = {
  name: 'pushbased-dark',
  type: 'dark',
  colors: { 'editor.background': '#0D121C', 'editor.foreground': '#FCFCFD' },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#9AA4B2', fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.operator.new', 'keyword.control'], settings: { foreground: '#FF577F' } },
    { scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string'], settings: { foreground: '#C3B5FD' } },
    { scope: ['constant.numeric', 'constant.language', 'constant.other'], settings: { foreground: '#FBBF24' } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call entity.name.function'], settings: { foreground: '#FF94AD' } },
    { scope: ['entity.name.type', 'entity.name.class', 'support.class', 'support.type', 'entity.name.tag', 'meta.type.parameters'], settings: { foreground: '#A48AFB' } },
    { scope: ['entity.other.attribute-name', 'variable.parameter', 'meta.object-literal.key'], settings: { foreground: '#FF94AD' } },
    { scope: ['punctuation', 'meta.brace', 'punctuation.definition.tag'], settings: { foreground: '#CDD5DF' } },
    { scope: ['markup.deleted'], settings: { foreground: '#FF577F' } },
    { scope: ['markup.inserted'], settings: { foreground: '#4ADE80' } },
  ],
}

const pushbasedLight = {
  name: 'pushbased-light',
  type: 'light',
  colors: { 'editor.background': '#FCFCFD', 'editor.foreground': '#121926' },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#697586', fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.operator.new', 'keyword.control'], settings: { foreground: '#D70033' } },
    { scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string'], settings: { foreground: '#B1032C' } },
    { scope: ['constant.numeric', 'constant.language', 'constant.other'], settings: { foreground: '#B45309' } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call entity.name.function'], settings: { foreground: '#6927DA' } },
    { scope: ['entity.name.type', 'entity.name.class', 'support.class', 'support.type', 'entity.name.tag', 'meta.type.parameters'], settings: { foreground: '#491C96' } },
    { scope: ['entity.other.attribute-name', 'variable.parameter', 'meta.object-literal.key'], settings: { foreground: '#7839EE' } },
    { scope: ['punctuation', 'meta.brace', 'punctuation.definition.tag'], settings: { foreground: '#364152' } },
    { scope: ['markup.deleted'], settings: { foreground: '#D70033' } },
    { scope: ['markup.inserted'], settings: { foreground: '#15803D' } },
  ],
}

// Word highlight: a first line `// @hl word other` marks those words in the block and is removed.
// Blocks are highlighted one at a time, so the words of the current block live here.
let hlWords: string[] = []
const wordHighlight = {
  name: 'kt-word-highlight',
  preprocess(code: string) {
    const m = code.match(/^\s*(?:\/\/|#) @hl (.+)\r?\n/)
    hlWords = m ? m[1].trim().split(/\s+/) : []
    return m ? code.slice(m[0].length) : code
  },
  span(node: any) {
    if (!hlWords.length) return
    const raw: string | undefined = node.children?.[0]?.value
    const m = raw?.match(/^(\s*)(\S+)(\s*)$/)
    if (!m || !hlWords.includes(m[2])) return
    // mark only the word, not the whitespace the token carries
    node.children = [
      { type: 'text', value: m[1] },
      { type: 'element', tagName: 'span', properties: { class: 'kt-hl' }, children: [{ type: 'text', value: m[2] }] },
      { type: 'text', value: m[3] },
    ]
  },
}

export default defineShikiSetup(() => ({
  themes: { dark: pushbasedDark, light: pushbasedLight },
  transformers: [wordHighlight],
}))
