/** Displays individual budget details with options to edit or delete. */

"use client";
import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";
import * as Constant from "@/lib/constant";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import SymbolBox from "../layout/SymbolBox";


export default function PortfolioItem({ data, style = "large", onSuccess }: { data: JSONObject, style: string, onSuccess: (portfolio: JSONObject) => void}) {

	const { user } = useAuth();
	const profitLoss = data.currentValue - data.investmentValue;

	
	const handleRemovePortfolio = async(data: JSONObject) => {
		const ok = confirm(`Are you sure you want to delete the portfolio '${data.symbol}' ?`);
		if(ok) {
			try {
				const response = await axios.delete(`/api/portfolio?userId=${user!._id}&symbol=${data.symbol}`);
	
				if (onSuccess) onSuccess(response.data);
			} catch (error) {
				alert('Failed to update the portfolio.');
			}
		}
	};


	return (
		<>
			{style == "large" && <tr className="hover:bg-slate-200">
				<td className="py-2 px-4 border-b text-start whitespace-nowrap">
					{/* <span className="px-3 py-1 bg-black text-white rounded-md mr-2 font-bold">{data.symbol}</span> */}
					<SymbolBox data={data} />
				</td>
				<td className="py-2 px-4 border-b text-start whitespace-nowrap">{data.longName}</td>
				<td className="py-2 px-4 border-b text-end whitespace-nowrap">{Utils.formatDisplayNumber(data.investmentValue)}</td>
				<td className="py-2 px-4 border-b text-end whitespace-nowrap">{Utils.formatDisplayNumber(data.currentValue)}</td>
				
				{profitLoss >= 0 && (
				<td className="py-2 px-4 text-end whitespace-nowrap font-semibold flex flex-row space-x-2 rounded-md items-center justify-end">
					<div className="flex py-1 px-2 rounded-md items-center bg-green-100 text-green-600 whitespace-nowrap space-x-2">
						<FaArrowDown />
						<span>{Utils.formatDisplayNumber(profitLoss)}</span>
					</div>
				</td>
				)}
				{profitLoss < 0 && (
					<td className="py-2 px-4 border-b text-end font-semibold flex justify-end">
						<div className="flex py-1 px-2 rounded-md items-center bg-red-100 text-red-600 whitespace-nowrap space-x-2">
							<FaArrowDown />
							<span>{Utils.formatDisplayNumber(profitLoss)}</span>
						</div>
					</td>
				)}
				
				<td className="px-2 cursor-pointer" onClick={() => handleRemovePortfolio(data)} >
					<IoClose size={26} className="text-red-500" />
				</td>
			</tr>}

			{style == "small" && <section className="bg-white p-5 rounded-lg shadow-md mb-2">
				<h2 className="text-lg font-semibold text-navy-blue mb-2 space-x-3 cursor-pointer flex flex-row">
					<span className="px-3 py-1 bg-black text-white rounded-md">{data.symbol}</span> <span>{data.longName}</span> 

					<div className="flex-grow"></div>
					<span><IoClose className="text-red-500" size={26} onClick={() => handleRemovePortfolio(data)} /></span>
				</h2>

				<div className="grid grid-cols-1 gap-2">
					<div className="flex justify-between">
						<span className="text-gray-700">Investment:</span>
						<span className="font-semibold text-navy-blue">{Utils.formatDisplayNumber(data.investmentValue)}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-700">Current Value:</span>
						<span className="font-semibold text-navy-blue">{Utils.formatDisplayNumber(data.currentValue)}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-700">Profit/Loss:</span>
						{profitLoss >= 0 && <div className="font-semibold text-green-600 flex flex-row space-x-2 bg-green-100 py-1 px-2 rounded-md items-center">
							<FaArrowUp />
							<span>{Utils.formatDisplayNumber(profitLoss)}</span>
						</div>}
						{profitLoss < 0 && <div className="font-semibold text-red-600 flex flex-row space-x-2 bg-red-100 py-1 px-2 rounded-md items-center">
							<FaArrowDown />
							<span>{Utils.formatDisplayNumber(profitLoss)}</span>
						</div>}


					</div>
				</div>
			</section>}
		</>
	)
}