import { Observable, throwError } from "rxjs";

export class HandleError {

    static handle<T>(operation = 'operation') {
        return (error: any): Observable<T> => {
            console.error(`${operation} failed: ${error.message}`);
            return throwError(() => error);
        }
    }

}