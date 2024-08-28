import { JSONObject } from "../definations";

export const cloneJSONObject = ( obj: JSONObject | JSONObject[]) => {
return JSON.parse(JSON.stringify(obj));
}

/** 
 * Relate to Searching/Replace data in a list
 *  */ 

export const findItemFromList = ( list: JSONObject[], value: any, propertyName: string ): JSONObject | null =>
{
    let item = null as JSONObject | null;

    if( list )
    {
        // If propertyName being compare to has not been passed, set it as 'id'.
        if ( propertyName === undefined )
        {
            propertyName = "id";
        }

        for( let i = 0; i < list.length; i++ )
        {
            let listItem = list[i];

            if ( listItem[propertyName] == value )
            {
                item = listItem;
                break;
            }
        }
    }

    return item;
}

export const findAndReplaceItemFromList = function( list: JSONObject[], searchValue: any, searchProperty: string, replacedData: JSONObject )
{
    var found = false;
    
    // Found item, replace a new one
    for( let i = 0; i < list.length; i++ )
    {
        var item = list[i];
        if ( item[ searchProperty ] == searchValue )
        {
            list[i] = cloneJSONObject( replacedData );
            found = true;
        }
    }

    // Not found item, add a new one
    if( !found )
    {
        list[list.length] = replacedData;
    }

}