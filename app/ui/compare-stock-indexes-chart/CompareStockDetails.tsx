import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";



export default function CompareStockDetails({stocks, data}: {stocks: JSONObject[], data: JSONObject | null}) {

    const getValue = (stock: JSONObject, propName: string) => {
        return data![`${stock.symbol}_${propName}`];
    }


    return (
        <div className="flex flex-col space-y-3 font-semibold">
            {data !== null && <div>Date: {Utils.formatDisplayDateFromObj(data.timestamp)}</div> }
            {stocks.map((stock: JSONObject, idx: number) => (
                <div key={`detail_${idx}`} className="flex flex-row space-x-4 items-center">
                    <div className="w-2 h-4" style={{backgroundColor: Utils.COLORS_LIST[idx % Utils.COLORS_LIST.length]}}> </div>
                    <div className="flex-1 font-normal" style={{color: Utils.COLORS_LIST[idx % Utils.COLORS_LIST.length]}}>{stock.longname}{stock.longName}</div>
                    {data !== null && <>
                        {getValue(stock, "percentChange") > 0 ? <> 
                            <div className="text-green-600">{Utils.formatDisplayNumber(getValue(stock, "close"))}</div>
                            <div className="text-green-600 p-2 rounded-lg w-24 bg-green-200 flex items-center space-x-2">
                                <FaArrowUp />
                                <div>{Utils.formatDisplayNumber(getValue(stock, "percentChange"))}%</div>
                            </div>
                        </> : 
                        <>
                            <div className="text-red-700">{Utils.formatDisplayNumber(getValue(stock, "close"))}</div>
                            <div className="text-red-700 p-2 rounded-lg bg-red-200 w-24 flex items-center space-x-2">
                                <FaArrowDown />
                                <div>{Utils.formatDisplayNumber(getValue(stock, "percentChange"))}%</div>
                            </div>
                        </>}
                    </>}
                </div>
            ))}
        </div>
    );
}