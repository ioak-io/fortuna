import {
    Item,
    ItemContent,
    ItemTitle,
    ItemDescription,
    ItemActions,
} from "@/components/ui-library/ui/item";
import { cn } from "@/components/ui-library/utils";
import { Transaction } from "@/types/transaction";
import { Pizza, Shirt } from "lucide-react";

type ListItemProps = {
    transaction: Transaction;
};

export function ListItem({ transaction }: ListItemProps) {
    return (
        <Item variant="default" className="flex bg-muted/20 items-center justify-between gap-4 p-4">
            {/* Left: Dollar icon */}
            <Pizza className="bg-muted/40 rounded-md p-2 h-10 w-10" />

            {/* Middle: Description + Date */}
            <ItemContent className="flex flex-col">
                <ItemTitle className="text-sm break-all line-clamp-2">
                    {transaction.description}
                </ItemTitle>
                <ItemDescription className="text-xs text-muted-foreground">
                    {new Date(transaction.transaction_date).toLocaleDateString()}
                </ItemDescription>
            </ItemContent>

            {/* Right: Amount */}
            <ItemActions>
                <span
                    className={cn(
                        transaction.type === "debit" ? "text-red-500/70" : "text-green-500/70"
                    )}
                >
                    {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: transaction.currency ?? "USD",
                        minimumFractionDigits:
                            Number.isInteger(transaction.amount) ? 0 : 2,
                        maximumFractionDigits: 2,
                    }).format(transaction.amount)}
                </span>
            </ItemActions>
        </Item>
    );
}
