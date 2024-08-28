"use client";

import { JSONObject } from "@/lib/definations";
import StockChart from "./StockChart";
import * as Utils from "@/lib/utils";
import CurrentPriceDetails from "./CurrentPriceDetails";
import HistoricalDataList from "./HistoricalDataList";
import { MdHistory } from "react-icons/md";
import { useState } from "react";
import { IoBarChartSharp } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";


export default function StockIndexDetails({curPriceData}: {curPriceData: JSONObject}) {

    const [showHistoryData, setShowHistoryData] = useState(false);

    return (
        <div className="flex flex-row p-3">
            <div className="flex-1">
                <h2 className="font-bold text-3xl flex items-center space-x-2 just mb-3">
                    <div className="mr-2 items-center">{curPriceData.longName}</div>
                   
                    {showHistoryData &&  <button className="items-center text-lg shadow-lg bg-gold p-2 rounded-full hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500" onClick={()=> setShowHistoryData(false)}>
                        <IoBarChartSharp size={14} className="text-navy-blue" />
                    </button>}

                    {!showHistoryData &&  <button className="items-center text-lg shadow-lg bg-gold p-2 rounded-full hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500" onClick={()=> setShowHistoryData(true)}>
                        <FaHistory size={14}  className="text-navy-blue" />
                    </button>}
                </h2>
                
                
                <div className="text-xs">As of <span className="font-medium">{Utils.formatDisplayDateTime(curPriceData.regularMarketTime)} {curPriceData.exchangeTimezoneShortName}.</span> Market Open.</div>

                <div className="flex flex-row">
                    {!showHistoryData && <div className="flex-1">
                        <StockChart symbol={curPriceData.symbol} />
                    </div>}

                    {showHistoryData && <div className="flex-1">
                        <HistoricalDataList curPriceData={curPriceData} />
                    </div>}

                    <div className="m-3 hidden md:block">
                        <CurrentPriceDetails priceData={curPriceData} />
                    </div>
                </div>

                <div className="m-3 md:hidden">
                    <CurrentPriceDetails priceData={curPriceData} />
                </div>
            </div>
        </div>
    )
}