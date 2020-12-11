/**
 * GameObjectContext helper functions
 * 
 */

/**
 * Convert a JSON object with integer keys to a map
 */
export function objectToMap<T>(object: { [index: string]: T}): Map<number, T>
{
    return new Map(Object.entries(object).map((value: [string, T]) =>
                [parseInt(value[0]), value[1]]));
}

/**
 * Return object with key id from map, or default object if not exists
 */
export function findObjectInMap(id: number, ...maps: Map<number, any>[])
{
    for(const map of maps)
    {
        if(map.has(id)) return map.get(id);
    }
    return { id: -1, name: "error" };
}

/**
 * Return all objects with id in ids from map, or default objects if they dont exist
 */
 export function findObjectsInMap(ids: number[], ...maps: Map<number, any>[])
{
    return ids.map((id: number) => findObjectInMap(id, ...maps));
}




// DEPRECATED/LEGACY/UNFINSHED functions
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
}

export const findById = (id: number) => (object: { id: number }) =>
        object.id === id;

export const findByIds = (ids: number[]) => (object: { id: number }) =>
        ids? ids.includes(object.id) : false;
*/