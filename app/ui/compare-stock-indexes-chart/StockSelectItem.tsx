
import { JSONObject } from "@/lib/definations";
import { useEffect, useState } from "react"
import { FiPlus } from "react-icons/fi";
import { IoCloseCircleOutline } from "react-icons/io5";
import * as Utils from "@/lib/utils";


export default function StockSelectItem({ stockData, handleOnRemoveItem, index }: { stockData: JSONObject, handleOnRemoveItem: (data: JSONObject) => void, index: number }) {

	const handleOnRemoveStock = () => {
		handleOnRemoveItem(stockData);
	}

	const bgColor = Utils.COLORS_LIST[index % Utils.COLORS_LIST.length];
	const rgbaColor = `${bgColor}${Math.round(0.3 * 255).toString(16).padStart(2, '0')}`;


	const longName = stockData.longname !== undefined ? stockData.longname : stockData.longName;

	return (
		<>
			<div className="flex flex-col items-center w-[150px] h-[60px]">
				<div className={`flex flex-col text-left justify-between rounded-xl border border-slate-300 p-3 space-y-1 font-bold w-full h-full`} style={{ backgroundColor: rgbaColor }}>
					<div className="flex">
						<span className={`flex-1 text-[${bgColor}]`}>{stockData.symbol}</span>
						<IoCloseCircleOutline size={22} onClick={() => handleOnRemoveStock()} />
					</div>

					<div className="text-gray-600 text-xs hidden lg:block">{Utils.truncatedText(longName)}</div>
					<div className="text-gray-600 text-xs lg:hidden">{Utils.truncatedText(longName, 5)}</div>
				</div>
			</div>
		</>
	)
}
