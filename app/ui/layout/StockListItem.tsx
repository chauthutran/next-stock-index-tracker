import { useAuth } from "@/contexts/AuthContext";
import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";
import { useEffect, useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import * as AppStore from "@/lib/AppStore";
import * as Constant from "@/lib/constant";
import { useMainUi } from "@/contexts/MainUiContext";
import { fetchIndividualData } from "@/lib/utils/fetchStockIndexes";
import Loading from "./Loading";
import SymbolBox from "./SymbolBox";

interface StockListItemProps {
	data: JSONObject;
	style?: string; // Make style optional with the ? operator
	handleRemoveStock?: (stock: JSONObject) => void; // Make handleRemoveStock optional
  }

const StockListItem: React.FC<StockListItemProps> = ({ data, style = "large", handleRemoveStock }) => {
	
	return (
		<>
			{style == "large" && <tr className="hover:bg-slate-200">
				<td className="text-left whitespace-nowrap py-2 px-3 border-b text-blue-700 cursor-pointer font-semibold">
					<SymbolBox data={data} />
				</td>
				<td className="text-left whitespace-nowrap py-2 px-3 border-b">{data.longName}</td>
				<td className="text-right whitespace-nowrap py-2 px-3 border-b">{Utils.formatDisplayNumber(data.regularMarketPrice)}</td>
				<td className="text-right whitespace-nowrap py-2 px-3 border-b">{Utils.formatDisplayTimeFromObj(data.regularMarketTime)} {data.exchangeTimezoneShortName}</td>
				<td className={`text-right whitespace-nowrap py-2 px-3 border-b font-semibold ${data.regularMarketChange > 0 ? "text-green-600" : "text-red-600"} `}>{Utils.formatDisplayNumber(data.regularMarketChange)}</td>
				<td className={`text-right whitespace-nowrap py-2 px-3 border-b font-semibold ${data.regularMarketChange > 0 ? "text-green-600" : "text-red-600"} `}>{Utils.formatDisplayNumber(data.regularMarketChangePercent)}%</td>
				<td className="text-right whitespace-nowrap py-2 px-3 border-b font-semibold">{Utils.formatNumberToK(data.regularMarketVolume)}</td>
				<td className="text-right whitespace-nowrap py-2 px-3 border-b">{Utils.formatNumberToK(data.marketCap)}</td>
				<td className="text-right whitespace-nowrap py-2 px-3 border-b">{Utils.formatDisplayNumber(data.regularMarketDayHigh)} - {Utils.formatDisplayNumber(data.regularMarketDayLow)}</td>
				{handleRemoveStock  && <td className="text-right whitespace-nowrap py-2 px-3 border-b cursor-pointer" onClick={() => handleRemoveStock(data)} >
					<IoClose size={26} className="text-red-500" />
				</td>}
			</tr>}

			{style == "small" && <section className="px-2 py-3 flex flex-col border-b odd:bg-gray-100 hover:bg-gray-200">
				<h2 className="text-lg font-semibold text-navy-blue mb-2 space-x-3 flex flex-row">
					<SymbolBox data={data} />
					<span>{data.longName}</span>

					<div className="flex-grow"></div>
					{handleRemoveStock  && <span><IoClose className="text-red" size={26}  onClick={() => handleRemoveStock(data)} /></span>}
				</h2>

				<div className="flex flex-col odd:bg-gray-100 hover:bg-gray-200">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3">
						<div>Last Price: <span className="font-semibold">{Utils.formatDisplayNumber(data.regularMarketPrice)}</span></div>
						<div>Market Time: <span className="font-semibold"> {Utils.formatDisplayTimeFromObj(data.regularMarketTime)} {data.exchangeTimezoneShortName}</span></div>
						<div>Change: <span className={`font-semibold ${data.regularMarketChange > 0 ? "text-green-600" : "text-red-600"} `}>{Utils.formatDisplayNumber(data.regularMarketChange)} ({Utils.formatDisplayNumber(data.regularMarketChangePercent)}%)</span></div>
						<div>Volumn: <span className="font-semibold">{Utils.formatNumberToK(data.regularMarketVolume)}</span></div>
						{data.marketCap && <div>Market cap: <span className="font-semibold">{Utils.formatNumberToK(data.marketCap)}</span></div>}
						<div>Intraday High/Low
						: <span className="font-semibold">{Utils.formatDisplayNumber(data.regularMarketDayHigh)} - {Utils.formatDisplayNumber(data.regularMarketDayLow)}</span></div>
					</div>
				</div>
			</section>}
		</>
	)
}

export default StockListItem;