import type { PaginatedResponse } from "../types";

export function extractResults<T>(data: T[] | PaginatedResponse<T> | any): T[] {
    if (!data) return [];
    if (Array.isArray(data)) {
        return data;
    }
    if (data && typeof data === "object" && Array.isArray(data.results)) {
        return data.results;
    }
    return [];
}
