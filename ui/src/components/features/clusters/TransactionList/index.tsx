import { Checkbox } from "@/components/ui-library/ui/checkbox";
import { Input } from "@/components/ui-library/ui/input";
import { cn } from "@/components/ui-library/utils";
import { Transaction } from "@/types/transaction";
import { DollarSign } from "lucide-react";
import { ListItem } from "./ListItem";

type TransactionListProps = {
    transactions: Transaction[];
    selected: Record<number, boolean>;
    onToggle: (id: number) => void;
    categoryByTxId: Record<string, string>;
    onChangeCategory: (id: number, value: string) => void;
    formatAmount: (amt: number, currency: string) => string;
};

export function TransactionList({
    transactions,
    selected,
    onToggle,
    categoryByTxId,
    onChangeCategory,
    formatAmount,
}: TransactionListProps) {
    return (
        <div className="flex flex-col gap-4">
            {transactions.map((tx) => <ListItem key={tx.id} transaction={tx} />)}
        </div>
    );
}
