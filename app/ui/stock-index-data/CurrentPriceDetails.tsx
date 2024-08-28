import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";


export default function CurrentPriceDetails({priceData}: {priceData: JSONObject}) {

	return (
		<ul className="whitespace-nowrap w-fit list-none p-3 text-sm">
			<li className="flex flex-row justify-between py-2 border-b border-dotted border-gray-400">Currency: <span className="font-semibold">{priceData.currency}</span></li>
			<li className="flex flex-row justify-between py-2 border-b border-dotted border-gray-400">
				<div>Close:</div>
				<span className={`font-semibold ${priceData.regularMarketChange > 0 ? "text-green-500" : "text-red-500"}`}>
					<span className="font-semibold px-3">{Utils.formatDisplayNumber(priceData.regularMarketPrice)}</span>
					({priceData.regularMarketChangePercent > 0 && "+"}{Utils.formatDisplayNumber(priceData.regularMarketChangePercent)}%)
				</span>
			</li>
			
			{priceData.marketCap && <li className="flex flex-row justify-between py-2 border-b border-dotted border-gray-400">
				<span>Market Cap:</span>
				<span className="font-semibold">{Utils.formatDisplayNumber(priceData.marketCap)}</span>
			</li>}
			{priceData.dividendYield && <li className="flex flex-row justify-between py-2 border-b border-dotted border-gray-400">
				<span>Dividend Yield:</span>
				<span className="font-semibold">{Utils.formatDisplayNumber(priceData.dividendYield)}</span>
			</li>}
			<li className="flex flex-row justify-between py-2 border-b border-dotted border-gray-400">
				<span>Open:</span>
				<span className="font-semibold">{Utils.formatDisplayNumber(priceData.regularMarketOpen)}</span>
			</li>
			<li className="flex flex-row justify-between py-2 border-b border-dotted border-gray-400">
				<span className="pr-3">Day High/Low:</span>
				<span className="font-semibold">{Utils.formatDisplayNumber(priceData.regularMarketDayLow)} - {Utils.formatDisplayNumber(priceData.regularMarketDayHigh)}</span>
			</li>
			{priceData.fiftyTwoWeekLowChange && <li className="flex flex-row justify-between py-2 border-b border-dotted border-gray-400">
				<span className="pr-3">55 Week High/Low:</span>
				<span className="font-semibold">{Utils.formatDisplayNumber(priceData.fiftyTwoWeekLow)} - {Utils.formatDisplayNumber(priceData.fiftyTwoWeekHigh)}</span>
			</li>}
			<li className="flex flex-row justify-between py-2 border-b border-dotted border-gray-400">
				<span>Volume:</span>
				<span className="font-semibold">{Utils.formatDisplayNumber(priceData.regularMarketVolume)}</span>
			</li>
		</ul>
	)
}