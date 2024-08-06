export function clone_object<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}