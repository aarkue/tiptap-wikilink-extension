import { useEffect, useState } from "react";
const ALL_OPTIONS = [
  { id: "a", text: "Hello World, this is the first option" },
  { id: "b", text: "Second option, lol" },
  { id: "c", text: "This is the third option" },
  { id: "d", text: "The last and fourth option" },
];

export default function Selector({
  text,
  onSelection,
}: {
  text: string;
  onSelection: ({ id, text }: { id: string; text: string }) => any;
}) {
  const t = text.substring(2).toLowerCase().replace(/\]*/g,"");
  const options = ALL_OPTIONS.filter((o) => {
    return o.text.toLowerCase().includes(t) || t == "";
  });

  const [activeOptionID, setActiveOptionID] = useState<string | undefined>("a");

  useEffect(() => {
    const res = options.find((o) => o.id === activeOptionID);
    if (!res) {
      if (options.length === 0) {
        setActiveOptionID(undefined);
      } else {
        setActiveOptionID(options[0].id);
      }
    }
  }, [options]);

  return (
    <div className="suggestion-container">
      {options.map((o) => (
        <div
          className={activeOptionID === o.id ? "active-option suggestion-option" : "suggestion-option"}
          key={o.id}
          onKeyDownCapture={(ev) => {
            if (ev.key === "ArrowDown") {
              ev.preventDefault();
              const index = options.findIndex((e) => e.id === activeOptionID);
              if (index > -1 && options.length > index + 1) {
                setActiveOptionID(options[index + 1].id);
              }
            } else if (ev.key === "ArrowUp") {
              ev.preventDefault();
              const index = options.findIndex((e) => e.id === activeOptionID);
              if (index > 0) {
                setActiveOptionID(options[index - 1].id);
              }
            } else if (ev.key === "Enter") {
              onSelection(o);
            }
          }}
        >
          {o.text}
        </div>
      ))}
    </div>
  );
}
