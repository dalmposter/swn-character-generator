/**
 * GameObjectContext helper functions
 * 
 */

export const findById = (id: number) => (object: { id: number }) =>
        object.id === id;

export const findByIds = (ids: number[]) => (object: { id: number }) =>
        ids? ids.includes(object.id) : false;

/**
 * Return the first object in given list that returns true under test function
 * @param list 
 * @param test 
 */
export const findObjectInList = (list: any[], test: (object: { id: number }) => boolean) =>
{
    try
    {
        let out = list.find(test);
        if(out !== undefined) return out;
    }
    catch(err)
    {

    }

    return { id: -1, name: "error" };
}

/**
 * Takes a test function and a list and searches for all that match the test function in given list
 */
 export const findObjectsInList = (list: any[], test: (object: { id: number }) => boolean, min: number = 1) =>
{
    try
    {
        let out = list.filter(test);
        if(out.length < min)
            out = new Array(min - out.length).map(() => {
                    return { id: -1, name: "error" }
                }).concat(out);
        if(out !== undefined) return out;
    }
    catch(err)
    {

    }

    return new Array(min).map(() => { return { id: -1, name: "error" } });
}

/**
 *  Find all objects with given ids in give list. Returns duplicates if they are present in id list
 */
export const findObjectsInListById = (list: any[], ids: number[]) =>
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