import { produce } from "./producer";
import { consume } from "./consumer";


produce().catch((err:any) => {console.error('producer error: ' + err)});
consume().catch((err:any) => {console.error('consume error: ' + err)});