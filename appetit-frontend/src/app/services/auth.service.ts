import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";
import { ResponseAuth } from "../interfaces/ResponseAuth";

export class AuthService {

    private apiUrl = `${environment.apiUrl}/Auth/Login`;

    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<ResponseAuth> {
        return this.http.post<ResponseAuth>(this.apiUrl, { email, password });
    }
}