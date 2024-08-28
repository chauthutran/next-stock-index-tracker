/** Displays individual budget details with options to edit or delete. */

"use client";
import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";
import * as Constant from "@/lib/constant";



export default function HistoricalDataItem({ data, style = "large", index }: { data: JSONObject, style: string, index: number }) {

	return (
		<>
			{style == "large" && <tr className="hover:bg-slate-200">
				<td className="py-2 px-4 border-b whitespace-nowrap">{Utils.formatDistplayDate(data.date)}</td>
				<td className="py-2 px-4 border-b text-end whitespace-nowrap">{Utils.formatDisplayNumber(data.open)}</td>
				<td className="py-2 px-4 border-b text-end whitespace-nowrap">{Utils.formatDisplayNumber(data.high)}</td>
				<td className="py-2 px-4 border-b text-end whitespace-nowrap">{Utils.formatDisplayNumber(data.low)}</td>
				<td className="py-2 px-4 border-b text-end whitespace-nowrap">{Utils.formatDisplayNumber(data.close)}</td>
				<td className="py-2 px-4 border-b text-end whitespace-nowrap">{Utils.formatDisplayNumber(data.volume)}</td>
			</tr>}

			{style == "small" && <section className="bg-white p-6 rounded-lg shadow-md mb-6">
  <h2 className="text-2xl font-semibold text-navy-blue mb-4">{Utils.formatDistplayDate(data.date)}</h2>
  
  <div className="grid grid-cols-1 gap-2">
    <div className="flex justify-between">
      <span className="text-gray-700">Open:</span>
      <span className="font-semibold text-navy-blue">{Utils.formatDisplayNumber(data.open)}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-700">High:</span>
      <span className="font-semibold text-navy-blue">{Utils.formatDisplayNumber(data.high)}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-700">Low:</span>
      <span className="font-semibold text-navy-blue">{Utils.formatDisplayNumber(data.low)}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-700">Close:</span>
      <span className="font-semibold text-navy-blue">{Utils.formatDisplayNumber(data.close)}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-700">Volume:</span>
      <span className="font-semibold text-navy-blue">{Utils.formatDisplayNumber(data.volume)}</span>
    </div>
  </div>
</section>}
		</>
	)
}