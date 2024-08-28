
import { useAuth } from "@/contexts/AuthContext";
import { useMainUi } from "@/contexts/MainUiContext";
import { useStockVote } from "@/contexts/StockVoteContext";
import * as AppStore from "@/lib/AppStore";
import * as Constant from "@/lib/constant";
import { JSONObject } from "@/lib/definations";
import StockVote from "@/lib/schemas/StockVote.schema";
import * as Utils from "@/lib/utils";
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";


export default function SymbolBox({ data }: { data: JSONObject }) {

	const { user } = useAuth();
	const { setMainPage } = useMainUi();
	const { stockVoteList, saveStockVote } = useStockVote();

	const getStockVoteIFAny = (): JSONObject | null => {
		if(stockVoteList === null ) return null;
		const found = Utils.findItemFromList(stockVoteList, data.symbol, "symbol");
		if( found !== null ) {
			if( user !== null ) {
				if( found.upvotes.userIds.indexOf(user!._id) >= 0 ) {
					return {
						voteType: "upvote",
						data: found
					};
				}
				else if( found.downvotes.userIds.indexOf(user!._id) >= 0 ) {
					return {
						voteType: "downvote",
						data: found
					};
				}
			}
			return {
				data: found
			};
		}

		return null;
	}

	const showStockDetails = (stock: JSONObject) => {
		AppStore.setSelectedSymbolData(stock);
		setMainPage(Constant.UI_SYMBOL_DETAILS);
	}

	const setVote = (voteType: string) => {
		if( user !== null ) {
			saveStockVote({userId: user!._id, symbol: data.symbol, voteType});
		}
	}

	const stockVote = getStockVoteIFAny();
	

	return (
		<div className={`flex flex-row items-center bg-blue-100 w-fit pr-2 rounded-md mr-2`}>
			<span
				className={`px-3 py-1 bg-black text-white ${user !== null ? "rounded-l-md" : "rounded-md"}  font-bold cursor-pointer`}
				onClick={() => showStockDetails(data)}>{data.symbol}
			</span>
			
			<div className="relative inline-block">
				<BiDislike className={`mx-2 ${(stockVote != null && stockVote.data.voteType === "downvote") ? "text-slate-blue" : user === null ? "text-gray-400" : "text-slate-700 cursor-pointer"}`} onClick={(stockVote === null  || stockVote.data === undefined || stockVote.voteType !== "downvote") ? () => setVote("downvote"): undefined }  />
				
				{(stockVote !== null && stockVote.data.votes.downvotes.count > 0 ) && <span
					className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
				>
					{stockVote.data.votes.downvotes.count}
				</span>}
			</div>
			
			<div className="relative inline-block">
				<BiLike className={`ml-5 mr-1 ${(stockVote != null && stockVote.data.voteType === "upvote") ? "text-slate-blue" : user === null ? "text-gray-400" : "text-slate-700 cursor-pointer"}`} onClick={(stockVote === null  || stockVote.data === undefined || stockVote.voteType !== "upvote") ? () => setVote("upvote"): undefined }  />
				
				{(stockVote !== null && stockVote.data.votes.upvotes.count > 0 ) && <span
					className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
				>
					{stockVote.data.votes.upvotes.count}
				</span>}
			</div>
		</div>
	)
}