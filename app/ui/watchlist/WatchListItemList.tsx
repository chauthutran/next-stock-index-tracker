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
import Loading from "../layout/Loading";
import StockListItem from "../layout/StockListItem";


export default function WatchListItemList({ groupName }: { groupName: string }) {

	const { user, setUser } = useAuth();
	const [error, setError] = useState("");
	const [stocks, setStocks] = useState<JSONObject[] | null>(null);

	const showWatchlistByGroup = async (groupName: string) => {
		const groupItem = Utils.findFromArray(user!.watchlist, groupName, "groupName");
		const symbols = groupItem!.stocks.map((item: JSONObject) => item.symbol);
		const response = await fetchIndividualData(symbols.join(","));

		if (response.status == "success") {
			setStocks(response.data);
		}
	}

	useEffect(() => {
		showWatchlistByGroup(groupName);
	}, []);

	useEffect(() => {
		showWatchlistByGroup(groupName);
	}, [groupName, user]);


	const removeStockToWatchlist = async (groupName: string, stock: JSONObject) => {
		const ok = confirm(`Are you sure you want to remove the stock '${stock.longName}' from the list ?`);
		if (ok) {
			const newStock = { symbol: stock.symbol, name: stock.shortname, addedAt: new Date() };
			const payload = { action: "remove", userId: user!._id, groupName: groupName, stock: newStock }

			const response = await fetch("api/watchlist", {
				method: "POST",
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				setError("Network response was not ok");
			}
			else {
				const newUser = await response.json();
				setUser(newUser);
				alert("Delete successfully !");
			}
		}
	};

	if( stocks === null ) return <><Loading /></>

	return (
		<>
		<div className="m-3">
			<div className="hidden lg:block">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50 whitespace-nowrap">
						<tr>
							<th className="py-2 px-4 border-b text-left">Symbol</th>
							<th className="py-2 px-4 border-b text-left text-navy-blue">Name</th>
							<th className="py-2 px-4 border-b text-right text-navy-blue">Last Price</th>
							<th className="py-2 px-4 border-b text-right text-navy-blue">Market Time</th>
							<th className="py-2 px-4 border-b text-right text-navy-blue">Change</th>
							<th className="py-2 px-4 border-b text-right text-navy-blue">% Change</th>
							<th className="py-2 px-4 border-b text-right text-navy-blue">Volume</th>
							<th className="py-2 px-4 border-b text-right text-navy-blue">Market Cap</th>
							<th className="py-2 px-4 border-b text-right text-navy-blue">Intraday High/Low</th>
							<th className="py-2 px-4 border-b text-right text-navy-blue">Action</th>
						</tr>
					</thead>

					<tbody className="bg-white divide-y divide-gray-200">
						{stocks !== null && stocks.map((item: JSONObject, idx: number) => (
							<StockListItem
								key={`watchlist_details_${idx}`} 
								style="large" 
								data={item} 
								handleRemoveStock={(data: JSONObject) => removeStockToWatchlist(groupName, data)} />
						))}
					</tbody>
				</table>
			</div>

			<div className="flex flex-col lg:hidden text-sm">
			{stocks !== null && stocks.map((item: JSONObject, idx: number) => (
					<StockListItem
						key={`watchlist_details_${idx}`}
						style="small"
						data={item}
						handleRemoveStock={(data: JSONObject) => removeStockToWatchlist(groupName, data)} />
			))}
			</div>
		</div>
{/* 


					
			<div className="font-medium w-full mt-2 rounded-md">
				<div className="flex flex-col w-full">
					{stocks !== null && stocks.map((stock: JSONObject, idx: number) => (
						<div
							className={`flex flex-row ${(idx % 2) === 0 ? "bg-white" : "bg-gray-100"} p-3 cursor-pointer`}
							key={`watchlist_${idx}`}
							onClick={() => showStockDetails(stock)}
						>
							<div className="flex flex-col space-y-3 flex-shrink-0">
								<div className="space-y-3">
									<div className="font-bold text-white bg-black rounded-md px-2 py-1 text-sm w-fit">
										{stock.symbol}
									</div>
									<div>{stock.longName}</div>
								</div>
							</div>

							<div className="flex flex-row text-right space-x-4 flex-1 items-end justify-end text-lg font-semibold">
								<div className="p-2">
									{Utils.formatDisplayNumber(stock.regularMarketPrice)}
								</div>

								<div className="p-2 rounded-lg flex-row space-x-2 hidden md:flex">
									{Utils.formatDisplayNumber(stock.regularMarketChange)}
								</div>

								{stock.regularMarketChangePercent > 0 && (
									<div className="bg-green-100 text-green-600 p-2 rounded-lg flex flex-row space-x-2">
										<FaArrowUp />
										<div>{Utils.formatDisplayNumber(stock.regularMarketChangePercent)}%</div>
									</div>
								)}
								{stock.regularMarketChangePercent < 0 && (
									<div className="bg-red-100 text-red-600 p-2 rounded-lg flex flex-row space-x-2">
										<FaArrowDown />
										<div>{Utils.formatDisplayNumber(stock.regularMarketChangePercent)}%</div>
									</div>
								)}
							</div>

							<div
								className="flex items-center ml-4 cursor-pointer text-red-700"
								onClick={() => removeStockToWatchlist(groupName, stock)}
							>
								<IoClose size={26} />
							</div>
						</div>))}
				</div>
			</div> */}
		</>
	)
}