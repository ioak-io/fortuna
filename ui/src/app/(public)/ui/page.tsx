"use client";

export default function Ui() {
    return (
        <div className="p-12 bg-background border-0 flex flex-col gap-4 rounded-lg">Background
            <div className="p-2 h-12 bg-sidebar rounded-lg">sidebar</div>
            <div className="p-12 bg-card flex gap-4 flex-col rounded-lg">
                Card
                <div className="p-2 h-12 bg-muted-1 rounded-lg">muted 1</div>
                <div className="p-2 h-12 bg-muted-2 rounded-lg">muted 2</div>
                <div className="p-2 h-12 bg-muted-3 rounded-lg">muted 3</div>
                <div className="p-2 h-12 bg-muted rounded-lg">muted</div>
                <div className="p-2 h-12 bg-background rounded-lg">background</div>
                <div className="p-2 h-12 bg-accent rounded-lg">accent</div>
                <div className="p-2 h-12 bg-sidebar rounded-lg">sidebar</div>
            </div>
        </div>
    )
}
