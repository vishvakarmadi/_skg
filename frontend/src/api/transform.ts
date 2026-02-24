// ============================================
// API DATA TRANSFORMER
// Converts snake_case backend responses to
// camelCase frontend types
// ============================================

/**
 * Recursively converts snake_case keys to camelCase
 */
function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Transform a single object's keys from snake_case to camelCase
 */
export function transformKeys<T>(obj: any): T {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map((item) => transformKeys<any>(item)) as unknown as T;
    if (typeof obj !== 'object') return obj;
    if (obj instanceof Date) return obj as unknown as T;

    const transformed: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
        const camelKey = toCamelCase(key);

        // Parse JSON strings that are common in the backend (images, tags, etc.)
        if (typeof value === 'string') {
            if (
                (key === 'images' || key === 'tags' || key === 'purity_features' || key === 'products_used' || key === 'technical_specs') &&
                value.startsWith('[') || value.startsWith('{')
            ) {
                try {
                    transformed[camelKey] = JSON.parse(value);
                } catch {
                    transformed[camelKey] = value;
                }
            } else {
                transformed[camelKey] = value;
            }
        } else if (typeof value === 'object' && value !== null) {
            transformed[camelKey] = transformKeys(value);
        } else {
            transformed[camelKey] = value;
        }
    }
    return transformed as T;
}

/**
 * Transform a paginated API response
 */
export function transformPaginatedResponse<T>(response: any): {
    data: T[];
    meta: {
        currentPage: number;
        lastPage: number;
        perPage: number;
        total: number;
    };
} {
    const rawData = response.data || response;

    // Handle Laravel's paginated response format
    if (rawData.data && Array.isArray(rawData.data)) {
        return {
            data: rawData.data.map((item: any) => transformKeys<T>(item)),
            meta: {
                currentPage: rawData.current_page || rawData.currentPage || 1,
                lastPage: rawData.last_page || rawData.lastPage || 1,
                perPage: rawData.per_page || rawData.perPage || 15,
                total: rawData.total || 0,
            },
        };
    }

    // Flat array response
    if (Array.isArray(rawData)) {
        return {
            data: rawData.map((item: any) => transformKeys<T>(item)),
            meta: { currentPage: 1, lastPage: 1, perPage: rawData.length, total: rawData.length },
        };
    }

    return { data: [], meta: { currentPage: 1, lastPage: 1, perPage: 15, total: 0 } };
}

/**
 * Convert camelCase keys back to snake_case for sending to the backend
 */
export function toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function transformKeysToSnake(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map((item) => transformKeysToSnake(item));
    if (typeof obj !== 'object') return obj;

    const transformed: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
        const snakeKey = toSnakeCase(key);
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            transformed[snakeKey] = transformKeysToSnake(value);
        } else {
            transformed[snakeKey] = value;
        }
    }
    return transformed;
}
