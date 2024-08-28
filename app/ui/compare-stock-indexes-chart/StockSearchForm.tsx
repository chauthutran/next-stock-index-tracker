import { JSONObject } from "@/lib/definations";
import { IoClose } from "react-icons/io5";
import SearchStock from "../stock-index-list/SearchStock";


export default function StockSearchForm({handleOnItemSelect, handleOnClose}: {handleOnItemSelect: (stockData: JSONObject) => void, handleOnClose: () => void}) {

    return (
        <div className="flex flex-col w-1/2 min-h-96 bg-white rounded-lg">
            <h2 className="font-medium shadow-sm text-xl p-3 bg-[#FFDB58] flex flex-row">
                <span className="flex-1">Add stock to compare</span>
                <span className="text-right" onClick={(() => handleOnClose())}><IoClose /></span>
            </h2>
            
            <div className="w-full"><SearchStock handleOnItemSelect={(stockData) => handleOnItemSelect(stockData)} /></div>

        </div>
    )
}
