import { useAuth } from "@/contexts/AuthContext";
import { JSONObject } from "@/lib/definations";
import { fetchIndividualData } from "@/lib/utils/fetchStockIndexes";
import { useState } from "react";
import WatchListItemList from "./WatchListItemList";
import * as Utils from "@/lib/utils";


export default function WatchList() {

	const { user } = useAuth();
	const initWatchlistGroup = (user!.watchlist !== undefined && user!.watchlist.length > 0) ? user!.watchlist[0] : null;
	const [selected, setSeleted] = useState<JSONObject | null>(initWatchlistGroup);

	const handleSelectedItem = (item: JSONObject) => {
		setSeleted(item);
	}

	return (
		<div className="flex flex-col w-full mr-2">
			<div className="flex flex-row space-x-2 m-2 font-medium">
				{user!.watchlist.map((item: JSONObject, idx: number) => (
					<div 
						key={`watchlist_${idx}`}
						className={`px-3 py-1 hover:bg-yellow-600 rounded-md bg-gold text-navy-blue ${selected !== null && selected.groupName == item.groupName ? "bg-gold" : "bg-gray-200 text-gray-500"}`}
						onClick={() => handleSelectedItem(item)}>
							{item.groupName}
					</div>
				))}
			</div>

			<hr className="ml-2 border-t-2 border-gray-300 shadow-xl" />

			<div className="flex-1">
				{selected !== null && <WatchListItemList groupName={selected.groupName}/>}
			</div>
		</div>
	)
}