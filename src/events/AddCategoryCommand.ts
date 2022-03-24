import { BehaviorSubject, Subject } from 'rxjs';

const AddCategoryCommand = new BehaviorSubject<boolean>(false);

export default AddCategoryCommand;
