import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";
import SymbolBox from "../layout/SymbolBox";


export default function StockIndex({ stockData }: { stockData: JSONObject}) {

	const percent = stockData.regularMarketChangePercent;
	const closePrice = stockData.regularMarketPrice;
	const previousClosePrice = stockData.regularMarketPreviousClose;


	return (
		<div className="p-2 border-b-2" >
			<h3 className="font-bold">
				<div className="mb-2">
					<SymbolBox data={stockData} />
				</div>
								{stockData.longName}</h3>
			<p className={`${percent > 0 ? 'text-green-500' : 'text-red-500'}`}>
				{Utils.formatDisplayNumber(closePrice)} {percent !== undefined && <span className="text-sm">({percent > 0 ? '+' : ''}{percent.toFixed(2)}%)</span>}</p>
		</div>
	)
}