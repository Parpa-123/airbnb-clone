import type { PaginatedResponse } from "../types";


export function extractResults<T>(data: T[] | PaginatedResponse<T>): T[] {
    if (Array.isArray(data)) {
        return data;
    }
    return data.results ?? [];
}
