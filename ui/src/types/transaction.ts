export interface Transaction {
    id: number;
    team_id: string;
    statement_id: number;
    transaction_date: string;
    description: string;
    amount: number;
    currency?: string | null;
    type: "debit" | "credit";
    category_id?: number | null;
    created_at: string;
    updated_at: string;
}