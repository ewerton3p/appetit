import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { ResponseData } from "../interfaces/ResponseData";
import { Category } from "../interfaces/Category";
import { HandleError } from "../utils/helpers/HandleException";

@Injectable({ providedIn: 'root' })
export class CategoryService {

    private apiUrl = `${environment.apiUrl}/Categories`;

    constructor(private http: HttpClient) {}

    getCategories(page: number, searchTerm: string): Observable<ResponseData<Category[]>> {
        return this.http.get<ResponseData<Category[]>>(`${this.apiUrl}?page=${page}&search=${searchTerm}`)
        .pipe(catchError(HandleError.handle<ResponseData<Category[]>>('getCategories')));
    }

    getCategoryById(id: number) : Observable<ResponseData<Category>> {
        return this.http.get<ResponseData<Category>>(`${this.apiUrl}/${id}`)
        .pipe(catchError(HandleError.handle<ResponseData<Category>>('getCategoryById')));
    }

    createCategory(category: Category) : Observable<Response> {
        return this.http.post<Response>(`${this.apiUrl}/Category`, category)
        .pipe(catchError(HandleError.handle<Response>('createCategory')));
    }

    updateCategory(category: Category) : Observable<Response> {
        return this.http.put<Response>(`${this.apiUrl}/Category/${category.id}`, category)
        .pipe(catchError(HandleError.handle<Response>('updateCategory')));
    }

    deleteCategory(id: number) : Observable<Response> {
        return this.http.delete<Response>(`${this.apiUrl}/Category/${id}`)
        .pipe(catchError(HandleError.handle<Response>('deleteCategory')));
    }

}