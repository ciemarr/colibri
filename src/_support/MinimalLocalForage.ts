export interface MinimalLocalForage {
    getItem<T>(key: string, callback?: (err: any, value: T) => void): Promise<T>;
    setItem<T>(key: string, value: T, callback?: (err: any, value: T) => void): Promise<T>;
}
