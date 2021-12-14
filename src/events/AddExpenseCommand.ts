import { BehaviorSubject, Subject } from 'rxjs';

const AddExpenseCommand = new BehaviorSubject<boolean>(false);

export default AddExpenseCommand;
