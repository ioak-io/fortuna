import { useEffect, useCallback } from "react";

interface KeyboardShortcutHandlers {
    onNext?: () => void;
    onPrevious?: () => void;
    onFlip?: () => void;
    onRestart?: () => void;
    onClose?: () => void;
}

export function useKeyboardShortcuts({
    onNext,
    onPrevious,
    onFlip,
    onRestart,
    onClose,
}: KeyboardShortcutHandlers) {
    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            const active = document.activeElement as HTMLElement | null;

            // Don't override space/enter when a button or input has focus
            if (
                active &&
                (active.tagName === "BUTTON" ||
                    active.tagName === "INPUT" ||
                    active.tagName === "TEXTAREA" ||
                    active.getAttribute("contenteditable") === "true")
            ) {
                return;
            }

            switch (event.key) {
                case "ArrowRight":
                    onNext?.();
                    break;
                case "ArrowLeft":
                    onPrevious?.();
                    break;
                case " ":
                case "Enter":
                    event.preventDefault(); // prevent scrolling or accidental submits
                    onFlip?.();
                    break;
                case "r":
                case "R":
                    onRestart?.();
                    break;
                case "Escape":
                    onClose?.();
                    break;
                default:
                    break;
            }
        },
        [onNext, onPrevious, onFlip, onRestart, onClose]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [handleKeyPress]);
}
