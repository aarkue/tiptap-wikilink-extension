import { useEditor, EditorContent, Content } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { WikiLinkExtension } from "../../packages/tiptap-wikilink-extension/src/index";
import { Root, createRoot } from "react-dom/client";
import { useEffect, useRef } from "react";
import Selector from "./selector";
import "../../packages/tiptap-wikilink-extension/src/WikiLink.css"
const Tiptap = () => {
  const elRoot = useRef<Root>();
  useEffect(() => {
    elRoot.current = undefined;
  }, []);
  const editor = useEditor({
    extensions: [
      StarterKit,
  
      WikiLinkExtension.configure({
        renderSuggestionFunction: (element, text, editor, range) => {
          if (!elRoot.current) {
            elRoot.current = createRoot(element);
          }
          elRoot.current.render(
            <>
              <Selector
                text={text}
                onSelection={({ id, text }: { id: string; text: string }) => {
                  let content: Content = [
                    {
                      type: "wikiLink",
                      attrs: { name: text, id: id },
                    },
                  ];
                  console.log({ editor });
                  return editor.chain().focus().insertContentAt(range, content).insertContent(" ").run();
                }}
              />
            </>
          );
        },
        onWikiLinkClick: (id, name, event) => {
          console.log({ id, name, event });
        },
      }),
    ],
    content: "<p>Hello World!</p>",
  });

  return <EditorContent editor={editor} className="tiptap-editor" />;
};

export default Tiptap;
