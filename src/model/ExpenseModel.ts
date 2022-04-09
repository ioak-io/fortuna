export default interface ExpenseModel {
  _id?: string;
  description: string;
  billDate: string;
  billId?: string;
  amount?: number;
  category: string;
  tagId: string[];
}
