"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, WandFortuna, X, Maximize2, Minimize2, MessageCircleMore } from "lucide-react";
import { Button } from "@/components/ui-library/ui/button";
import { Card } from "@/components/ui-library/ui/card";
import { ScrollArea } from "@/components/ui-library/ui/scroll-area";
import TextareaAutosize from "react-textarea-autosize";

export function ChatbotWidget() {
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [messages, setMessages] = useState<
        { id: string; role: "user" | "assistant"; content: string }[]
    >([{ id: "m1", role: "assistant", content: "Hi! How can I help you today?" }]);
    const [input, setInput] = useState("");
    const endRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    function onSend(e?: React.FormEvent) {
        e?.preventDefault();
        const text = input.trim();
        if (!text) return;
        const uid = crypto.randomUUID();
        setMessages((m) => [...m, { id: uid, role: "user", content: text }]);
        setInput("");

        // Mock assistant reply
        setTimeout(() => {
            setMessages((m) => [
                ...m,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: "Thanks for your message. This is a demo reply.",
                },
            ]);
        }, 450);
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Floating Action Button */}
            {!open && (
                <Button
                    onClick={() => setOpen(true)}
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground"
                    aria-label="Open chat"
                >
                    <MessageCircleMore className="size-6" />
                </Button>
            )}

            {/* Overlay for expanded mode */}
            {open && expanded && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    onClick={() => setExpanded(false)}
                />
            )}

            {/* Chat window */}
            {open && (
                <div
                    className={`z-50 ${expanded
                        ? "fixed inset-0 flex items-center justify-center p-2 sm:p-8"
                        : "absolute bottom-0 right-0"
                        }`}
                >
                    <Card
                        className={`flex flex-col overflow-hidden rounded-xl shadow-2xl border border-border py-0 gap-0
              ${expanded ? "w-full h-full sm:w-[720px] sm:h-[640px]" : "w-[min(92vw,380px)] h-[560px]"}`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <div className="flex items-center gap-3">
                                <WandFortuna />
                                <span className="text-sm font-medium">Bloom's higher order thinking</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {/* Expand / Shrink button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setExpanded(!expanded)}
                                    aria-label={expanded ? "Shrink" : "Expand"}
                                    className="h-8 w-8"
                                >
                                    {expanded ? (
                                        <Minimize2 className="h-4 w-4" />
                                    ) : (
                                        <Maximize2 className="h-4 w-4" />
                                    )}
                                </Button>

                                {/* Close button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setOpen(false);
                                        setExpanded(false);
                                    }}
                                    aria-label="Close"
                                    className="h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full px-4 pt-2">
                                <div className="flex flex-col gap-3 pr-2">
                                    {messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${m.role === "user"
                                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                                    : "bg-muted text-foreground rounded-bl-none"
                                                    }`}
                                            >
                                                {m.content}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={endRef} />
                                </div>
                            </ScrollArea>
                        </div>


                        {/* Compose Area */}
                        <form onSubmit={onSend} className="px-4 py-4 border-t-1">
                            <div className="relative flex items-end rounded-lg bg-muted/40 py-1">
                                <TextareaAutosize
                                    autoFocus
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    minRows={1}
                                    maxRows={5}
                                    className="flex-1 resize-none bg-transparent outline-none text-sm leading-5 py-2 px-2 pr-10"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="absolute bottom-1.5 right-1.5 h-8 w-8 rounded-full"
                                    aria-label="Send"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
