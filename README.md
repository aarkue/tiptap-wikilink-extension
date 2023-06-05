# WikiLink Extension for the TipTap Editor

Adds WikiLinks (e.g.,`[[Related Document]]`).


## Usage
See the demo at `/example` for a quick introduction on how to use this package.
There is currently no `npmjs.org` package published, but meanwhile, this extension can also be quickly installed from GitHub directly using `npm`. 


### Options
- `onWikiLinkClick`: Is executed when a WikLink is clicked on. Type: `(id: string, name: string, event: MouseEvent) => any`
- `renderSuggestionFunction`: Should render the suggestions based on the input `text` inside the element `element`. This can be done with vanilla javascript or, e.g., `react-dom`. Type: ` (element: HTMLElement, text: string, editor: Editor, range: { from: number; to: number }) => any`



## Screenshots + Demo
Try out the demo directly online at [https://aarkue.github.io/tiptap-wikilink-extension/](https://aarkue.github.io/tiptap-wikilink-extension/)!
