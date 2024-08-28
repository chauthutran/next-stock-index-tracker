"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useMainUi } from "@/contexts/MainUiContext";
import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import * as AppStore from "@/lib/AppStore";
import * as Constant from "@/lib/constant";


export default function NotificationSettingItem({ data, onDeleteSuccess }: { data: JSONObject, onDeleteSuccess: (newUserNotification: JSONObject) => void }) {

	const { user } = useAuth();

	const { setMainPage } = useMainUi();

	const showStockDetails = (stock: JSONObject) => {
		AppStore.setSelectedSymbolData(stock);
		setMainPage(Constant.UI_SYMBOL_DETAILS);
	}
	const handleRemoveNotification = async(data: JSONObject) => {
		const ok = confirm(`Are you sure you want to delete the notification '${data.symbol}' ?`);
		if(ok) {
			try {
				const response = await axios.delete(`/api/notification-settings?userId=${user!._id}&symbol=${data.symbol}`);
	
				alert(`The notification ${data.symbol} is deleted successfully!`);

				if (onDeleteSuccess) onDeleteSuccess(response.data);
			} catch (error) {
				alert('Failed to update the portfolio.');
			}
		}
	};


	return (
		<tr className="hover:bg-slate-200">
			<td className="py-2 px-4 border-b text-start whitespace-nowrap"><span className="px-3 py-1 bg-black text-white rounded-md mr-2 font-bold" onClick={() => showStockDetails(data)}>{data.symbol}</span></td>
			<td className="py-2 px-4 border-b text-end whitespace-nowrap">{Utils.formatDisplayNumber(data.threshold)}</td>
			<td className="py-2 px-4 border-b text-end whitespace-nowrap">{data.direction}</td>
			<td className="px-2 border-b text-end cursor-pointer">
				<div className="flex justify-end items-center">
					<IoClose size={26} className="text-red-500" onClick={() => handleRemoveNotification(data)} />
				</div>
			</td>
		</tr>
	)
}