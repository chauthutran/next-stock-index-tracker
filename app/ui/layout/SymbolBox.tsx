
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

	const { setMainPage } = useMainUi();

	const showStockDetails = (stock: JSONObject) => {
		AppStore.setSelectedSymbolData(stock);
		setMainPage(Constant.UI_SYMBOL_DETAILS);
	}


	return (
		<span
			className={`px-3 py-1 bg-black text-white rounded-md font-bold cursor-pointer`}
			onClick={() => showStockDetails(data)}>{data.symbol}
		</span>
	)
}