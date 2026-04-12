import { Pagination } from "./Pagination";

export interface ResponseData<T> {
    data: T;
    message: string;
    success: boolean;
    pagination: Pagination;
}