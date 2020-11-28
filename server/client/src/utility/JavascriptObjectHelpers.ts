export const sumObjectValues = (object: any) =>
    Object.values<number>(object).reduce((prev: number, curr: number) => prev+curr)