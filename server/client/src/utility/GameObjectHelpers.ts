/**
 * GameObjectContext helper functions
 * 
 */

import { mapFinderOptions } from "sequelize/types/lib/utils";

/**
 * Convert a JSON object with integer keys to a map
 * @param object
 */
export function objectToMap<T>(object: { [index: string]: T}): Map<number, T>
{
    return new Map(Object.entries(object).map((value: [string, T]) =>
                [parseInt(value[0]), value[1]]));
}

export const findById = (id: number) => (object: { id: number }) =>
        object.id === id;

export const findByIds = (ids: number[]) => (object: { id: number }) =>
        ids? ids.includes(object.id) : false;

/**
 * Return object with key id from map, or default object if not exists
 */
export function findObjectInMap(map: Map<number, any>, id: number)
{
    return map.has(id) ? map.get(id) : { id: -1, name: "error" };
}

/**
 * Return all objects with id in ids from map, or default objects if they dont exist
 */
 export function findObjectsInMap(map: Map<number, any>, ids: number[])
{
    return ids.map((id: number) => { return map.has(id) ? map.get(id) : { id: -1, name: "error" }});
}

/**
 *  Find all objects with given ids in give list. Returns duplicates if they are present in id list
 */
/*export const findObjectsInListById = (list: any[], ids: number[]) =>
{
    if(list === undefined || ids === undefined) return [{ id: -1, name: "error" }];
    try
    {
       let out = ids.map((id: number) => {
           let found = list.find((object: any) => object.id === id);
           if(found !== undefined) return found;
           return { id: -1, name: "error" };
        });
        if(out !== undefined) return out;
    }
    catch(err)
    {

    }

    return ids.map(() => { return { id: -1, name: "error" } });
}*/