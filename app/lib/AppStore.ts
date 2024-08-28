import { JSONObject } from "./definations";

let COMPARE_SYMBOL_LIST : string[] = [];
let SELECTED_SYMBOL_DATA: JSONObject;

export const setSelectedSymbolData = (data: JSONObject) => {
    SELECTED_SYMBOL_DATA = data;
}

export const getSelectedSymbolData = () => {
    return SELECTED_SYMBOL_DATA;
}

export const setCompareSymbolList = (symbolList: string[]) => {
    COMPARE_SYMBOL_LIST = symbolList;
}

export const getCompareSymbolList = () => {
    return COMPARE_SYMBOL_LIST;
}