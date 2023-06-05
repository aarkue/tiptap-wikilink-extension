import { Extension } from "@tiptap/core";

import { WikiLinkSuggestion } from "./wikilink-suggestion";

import { OnWikiLinkClick, WikiLinkNode } from "./wikilink-node";
import { RenderSuggestionFunction } from "./wikilink-suggestion";

export interface WikiLinkExtensionOptions {
  onWikiLinkClick?: OnWikiLinkClick;
  renderSuggestionFunction: RenderSuggestionFunction
}

export const WikiLinkExtension = Extension.create<WikiLinkExtensionOptions>({
  name: "wikiLink",
  
  addExtensions() {
    const extensions = [];
    extensions.push(WikiLinkSuggestion.configure({renderSuggestionFunction: this.options.renderSuggestionFunction}))
    extensions.push(WikiLinkNode.configure({onWikiLinkClick: this.options.onWikiLinkClick}))
    
    return extensions;
  },
});

export {WikiLinkSuggestion, WikiLinkNode}

