import ExpenseModel from './ExpenseModel';

export default interface PaginationModel {
  pageSize: number;
  pageNo: number;
  hasMore: boolean;
}
