'use client';

import { JSONObject } from "@/lib/definations";
import axios from "axios";
import { useEffect, useState } from "react";
import * as Utils from "@/lib/utils";
import HistoricalDataItem from "./HistoricalDataItem";
import ChartDateRange from "./ChartDateRange";


export default function HistoricalDataList({ curPriceData }: { curPriceData: JSONObject }) {

	const [selectedDateRange, setSelectedDateRange] = useState("1Y");
	const [historicalData, setHistoricalData] = useState([]);


	const fetchData = async (dateRange: JSONObject) => {
		try {
			const response = await axios.get(`/api/stock-chart-data`, {
				params: {
					"symbol": curPriceData.symbol,
					"startDate": dateRange.startDate,
					"endDate": dateRange.endDate,
					"interval": '1d'
				},
			});

			const dataList = response.data.quotes;
			if (dataList !== undefined) {
				setHistoricalData(dataList);
			}

		} catch (error) {
			console.error('Error fetching stock data:', error);
		}
	};


	useEffect(() => {
		fetchDataByDataRangeName(selectedDateRange);
	}, []);

	const fetchDataByDataRangeName = (dateRangeName: string) => {
		const dateRange = Utils.getDateRange(dateRangeName);
		fetchData(dateRange);
	}

	let dateRangeList = Utils.dateRangeList.slice();
	dateRangeList.shift();

	return (
		<div className="w-full flex flex-col">
			<div className="flex flex-row space-x-6 px-3 font-semibold p-1 bg-slate-300 shadow-sm my-2">
				{dateRangeList.map((item, i) => (
					<ChartDateRange key={`historyData_${i}`} name={item} selected={selectedDateRange == item} handleOnClick={(name: string) => { fetchDataByDataRangeName(name); setSelectedDateRange(name); }} />
				))}
			</div>

			<div className="flex-1 hidden md:block">
				<div className="overflow-y-auto h-[calc(100vh-300px)]">
					<table className="min-w-full bg-white border border-gray-300">
						<thead>
							<tr>
								<th className="py-2 px-4 border-b text-navy-blue text-start">Date</th>
								<th className="py-2 px-4 border-b text-navy-blue text-end">Open</th>
								<th className="py-2 px-4 border-b text-navy-blue text-end">High</th>
								<th className="py-2 px-4 border-b text-navy-blue text-end">Low</th>
								<th className="py-2 px-4 border-b text-navy-blue text-end">Close</th>
								<th className="py-2 px-4 border-b text-navy-blue text-end">Volume</th>
							</tr>
						</thead>
						<tbody>
							{historicalData.map((data: JSONObject, index: number) => (
								<HistoricalDataItem key={`historyData_${index}`} data={data} style="large" index={index} />
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* <!-- Divs for smaller screens --> */}
			<div className="md:hidden">
				{historicalData.reverse().map((expense: JSONObject, index: number) => (
					<HistoricalDataItem style="small" key={`historyData_${expense._id}`} data={expense} index={index} />
				))}
			</div>
		</div>
	)
}