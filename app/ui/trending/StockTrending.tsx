import { JSONObject } from "@/lib/definations";
import axios from "axios";
import { useEffect, useState } from "react";
import * as Utils from "@/lib/utils";
import { useMainUi } from "@/contexts/MainUiContext";
import * as AppStore from "@/lib/AppStore";
import * as Constant from "@/lib/constant";
import useStockTrending from "@/lib/hooks/useStockTrending";
import Loading from "../layout/Loading";
import StockListItem from "../layout/StockListItem";


export default function StockTrending() {

	const {stockTrending, isLoading} = useStockTrending();
	

	if (isLoading) return <Loading />

	return (
		<div className="m-2 text-navy-blue">
			<h2 className="text-2xl font-semibold mb-4">Trending</h2>
			<div className="hidden lg:block w-full">
				<table className="w-full divide-y divide-gray-200">
					<thead className="whitespace-nowrap">
						<tr>
							<th className="py-2 px-3 border-b text-left">Symbol</th>
							<th className="py-2 px-3 border-b text-left">Name</th>
							<th className="py-2 px-3 border-b text-right">Last Price</th>
							<th className="py-2 px-3 border-b text-right">Market Time</th>
							<th className="py-2 px-3 border-b text-right">Change</th>
							<th className="py-2 px-3 border-b text-right">% Change</th>
							<th className="py-2 px-3 border-b text-right">Volume</th>
							<th className="py-2 px-3 border-b text-right">Market Cap</th>
							<th className="py-2 px-3 border-b text-right">Intraday High/Low</th>
						</tr>
					</thead>

					<tbody className="bg-white divide-y divide-gray-200">
						{stockTrending.map((item: JSONObject, idx: number) => (
							<StockListItem
								key={`trending_${idx}`} 
								style="large" 
								data={item} />
						))}
					</tbody>
				</table>
			</div>

			<div className="flex flex-col lg:hidden text-sm">
				{stockTrending.map((item: JSONObject, idx: number) => (
					<StockListItem
						key={`trending_${idx}`} 
						style="small" 
						data={item} />
				))}
			</div>
		</div>
	)

}