import { mergeAttributes, Node } from "@tiptap/core";
// import "./WikiLink.css";

export type OnWikiLinkClick = (id: string, name: string, event: MouseEvent) => any;
export interface WikiLinkNodeOptions {
  onWikiLinkClick: OnWikiLinkClick;
}

export const WikiLinkNode = Node.create<WikiLinkNodeOptions>({
  name: "wikiLink",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      id: {
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => {
          return {
            "data-id": attributes.id,
          };
        },
      },
      name: {
        default: "-",
        parseHTML: (element) => element.getAttribute("data-name"),
        renderHTML: (attributes) => {
          return {
            "data-name": attributes.name,
          };
        },
      },
    };
  },
  addOptions(): WikiLinkNodeOptions {
    return {
      onWikiLinkClick: undefined,
    };
  },

  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    let name = "-";
    if (node.attrs.name && typeof node.attrs.name == "string") {
      name = node.attrs.name;
    }
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-type": this.name,
      }),
      "[[" + name + "]]",
    ];
  },
  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          const { selection } = state;
          const { empty, anchor } = selection;
          if (!empty) {
            return false;
          }
          const node = state.doc.nodeAt(anchor - 1);
          let preventDefault = false;
          if (node.type.name === this.name) {
            preventDefault = true;

            state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
              if (node.type.name === this.name) {
                tr.insertText("[[" + (node.attrs.name || "") + "]", pos, anchor);
              }
            });
          }
          return preventDefault;
        }),
    };
  },

  addNodeView() {
    return ({ node }) => {
      const outerEl = document.createElement("button");
      const eventListener = (ev: MouseEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        if (this.options.onWikiLinkClick) {
          this.options.onWikiLinkClick(node.attrs.id, node.attrs.name, ev);
        }
      };
      outerEl.onmousedown = (ev) => {
        ev.stopPropagation();
      };
      outerEl.addEventListener("click", eventListener);
      outerEl.classList.add("wikilink");
      outerEl.innerText = `${node.attrs.name}`;
      return {
        dom: outerEl,
        destroy: () => {
          outerEl.removeEventListener("click", eventListener);
        },
      };
    };
  },
});
