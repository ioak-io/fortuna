import clsx from "clsx";

function KeyBindingIcon({ label, square }: { label: string, square?: boolean }) {
  return (
    <span
      className={clsx(`h-6 flex items-center justify-center text-xs font-mono rounded border-1 border-border/20`,
        square ? "w-6" : "px-2")}
    >
      {label}
    </span>
  );
}

export default KeyBindingIcon;