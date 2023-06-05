import { Content, Editor, Extension, InputRule, mergeAttributes, Node, PasteRule } from "@tiptap/core";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { EditorState, Plugin, PluginKey } from "prosemirror-state";
export const WikiLinkNodePluginKey = new PluginKey("wikiLink-command");

export type RenderSuggestionFunction = (
  element: HTMLElement,
  text: string,
  editor: Editor,
  range: { from: number; to: number }
) => any;

export const matchRegex = /\[\[[^\s]?[^\]]*\]*/;

export const WikiLinkSuggestion = Extension.create<{ renderSuggestionFunction: RenderSuggestionFunction }>({
  name: "wikilink-suggestion",

  addOptions() {
    return {
      renderSuggestionFunction: undefined,
    };
  },

  addProseMirrorPlugins() {
    const element = document.createElement("div");
    element.style.display = "none";
    if (!this.options.renderSuggestionFunction) {
      throw new Error("renderSuggestionFunction is not defined");
    }
    document.body.appendChild(element);
    return [
      new Plugin({
        key: WikiLinkNodePluginKey,
        view: () => ({
          update: (view, prevState) => {
            const prevWikiState = WikiLinkNodePluginKey.getState(prevState);
            const nextWikiState = WikiLinkNodePluginKey.getState(view.state);
            if (nextWikiState.active) {
              const node = view.domAtPos(prevWikiState.range.from);
              const suggestionNode = (node.node as HTMLElement).querySelector(".editor-suggestion");
              const boundingRect = suggestionNode.getBoundingClientRect();
              element.style.position = "fixed";
              element.style.left = boundingRect.left + "px";
              let topPos = boundingRect.top + boundingRect.height;
              if (topPos >= window.innerHeight - 400) {
                topPos = boundingRect.top - 175 - 2 * boundingRect.height;
              }
              element.style.top = topPos + "px";
              element.style.zIndex = "9999";
              element.style.display = "block";
              this.options.renderSuggestionFunction(element, nextWikiState.text, this.editor, nextWikiState.range);
            } else {
              element.style.display = "none";
            }
          },
          destroy: () => {
            document.body.removeChild(element);
          },
        }),
        state: {
          init: () => ({ active: false, range: {}, text: null }),
          apply: (tr, prevVal, oldState, newState) => {
            const selection = tr.selection;
            const nextVal = { ...prevVal };
            if (selection.from === selection.to) {
              const pos = selection.$from;
              const text = pos.doc.textBetween(pos.before(), pos.end());
              const match = matchRegex.exec(text);
              if(text.startsWith("[[ ") || text.endsWith(" ") || (match && match[0].split(" ").length > 2)){
                nextVal.active = false;
                nextVal.range = {};
                nextVal.text = null;
                return nextVal;
              }
              if (match) {
                nextVal.active = true;
                const from = pos.start() + match.index;
                nextVal.range = { from: from, to: from + match[0].length + 1 };
                nextVal.text = match[0];
              } else {
                nextVal.active = false;
                nextVal.range = {};
                nextVal.text = null;
              }
            } else {
              nextVal.active = false;
              nextVal.range = {};
              nextVal.text = null;
            }

            return nextVal;
          },
        },
        props: {
          handleKeyDown: (view, event) => {
            const wikiLinkState = WikiLinkNodePluginKey.getState(view.state);
            const { active }: { active: boolean; range: { from: number; to: number } } = wikiLinkState;

            if (!active) {
              return false;
            }
            if (event.key === "ArrowUp" || event.key === "ArrowDown" || (event.key === "Enter" && !event.shiftKey)) {
              const activeOption = element.querySelector(".active-option");
              if (activeOption !== null) {
                const ev = new KeyboardEvent("keydown", { key: event.key });
                activeOption.dispatchEvent(ev);
                return true;
              }
            }else if(event.key == "Escape"){
              console.log("Escape");
              wikiLinkState.active = false;
              element.style.display = "none"
              return false;
            }else if(event.key === "Enter" && event.shiftKey){
              wikiLinkState.active = false;
              element.style.display = "none"
              return false;
            }
            return false;
          },
          decorations: (state) => {
            const wikiLinkState = WikiLinkNodePluginKey.getState(state);
            const { active, range }: { active: boolean; range: { from: number; to: number } } = wikiLinkState;
            if (!active) {
              return null;
            }
            return DecorationSet.create(state.doc, [
              Decoration.inline(range.from, range.to, { nodeName: "span", class: "editor-suggestion" }),
            ]);
          },
        },
      }),
    ];
  },
});
