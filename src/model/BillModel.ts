import ExpenseModel from './ExpenseModel';

export default interface BillModel {
  _id?: string;
  number: string;
  description?: string;
  billDate: string;
  total: number;
  items: ExpenseModel[];
}
