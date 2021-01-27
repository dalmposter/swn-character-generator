export const sumObjectValues = (object: any) =>
    Object.values<number>(object).reduce((prev: number, curr: number) => prev+curr)


/*
    replacer and reviver code was copied as-is from
    https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
    Their purpose is to facilitate the parsing and stringifying of maps to and from json
*/
export function replacer(key, value) {
    const originalObject = this[key];
    if(originalObject instanceof Map) {
        return {
        dataType: 'Map',
        value: Array.from(originalObject.entries()),
        };
    } else {
        return value;
    }
}

export function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}