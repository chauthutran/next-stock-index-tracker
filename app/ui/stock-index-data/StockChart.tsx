'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar } from 'recharts';
import axios from 'axios';
import { JSONObject } from '@/lib/definations';
import * as Utils from "@/lib/utils";
import ChartDateRange from './ChartDateRange';
import { format, parseISO } from 'date-fns';
import { TooltipProps } from 'recharts';
import fetchStockChartData from '@/lib/utils/fetchStockChartData';

const CustomTooltip = ({payload, label}: any) => {

	if (payload && payload.length) {

		const formattedDate = format(parseISO(label), "dd MMM yyyy HH:mm");
		const data = payload[0].payload;
		return (
			<div className="flex flex-col custom-tooltip bg-white p-2 border border-gray-200 rounded shadow text-xs space-y-2">
				<div className="text-gray-500 flex justify-between space-x-3">
					<span>Date:</span>
					<span className="text-right font-semibold">{formattedDate}</span>
				</div>
				{data.close && (
					<div className="text-gray-500 flex justify-between space-x-3">
						<span>Close:</span>
						<span className="font-semibold text-right">{Utils.formatDisplayNumber(data.close)}</span>
					</div>
				)}
				{data.open && (
					<div className="text-gray-500 flex justify-between space-x-3">
						<span>Open:</span>
						<span className="font-semibold text-right">{Utils.formatDisplayNumber(data.open)}</span>
					</div>
				)}
				{data.high && (
					<div className="text-gray-500 flex justify-between space-x-3">
						<span>High:</span>
						<span className="font-semibold text-right">{Utils.formatDisplayNumber(data.high)}</span>
					</div>
				)}
				{data.low && (
					<div className="text-gray-500 flex justify-between space-x-3">
						<span>Low:</span>
						<span className="font-semibold text-right">{Utils.formatDisplayNumber(data.low)}</span>
					</div>
				)}
			</div>
		);
	}

	return null;
};


export default function StockChart({ symbol }: { symbol: string }) {
	const [dateRangeName, setDateRangeName] = useState("1D");
	const [chartData, setChartData] = useState<JSONObject[] | null>(null);

	const fetchData = async() => {
		const data = await fetchStockChartData(symbol, dateRangeName);

		if( data !== undefined ) {
			if( data.statusText === "OK" ) { 
				setChartData(data.data.quotes);
			}
			else {
				// errMsg = "Error while fetching stock data.";
			}
		}
	
	}

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		fetchData();
	}, [symbol,dateRangeName]);


	const getYTicks = (): string[] => {
		let ticks = [];
		let tempTicks = [];
		if (chartData != undefined) {
			for (let i = 0; i < chartData.length; i++) {
				let close = chartData[i].close;
				if (close !== null) {
					tempTicks.push(close);
				}
			}

			tempTicks = tempTicks.sort((a, b) => a - b);
			const minTick = Math.ceil(tempTicks[0]);
			const maxTick = Math.round(tempTicks[tempTicks.length - 1]);

			const step = Math.round((maxTick - minTick) / 10);
			for (var i = minTick; i <= maxTick; i += step) {
				ticks.push(i.toFixed(2));
			}

			// Remove the last item, add the "maxTick" as last item
			ticks.pop();
			ticks.push(maxTick.toFixed(2));
		}

		return ticks;
	}


	const formatYPriceAxis = (tickItem: string) => {
		return Utils.formatDisplayNumber(tickItem);
	};

	const formatYVolumeAxis = (tickItem: string) => {
		return Utils.formatNumberToK(tickItem);
	};


	const yTicks = getYTicks();

	if (chartData === null ) return <div>Loading ...</div>;


	return (
		<div className="pt-7">
			<ResponsiveContainer width="100%" height={360}>
				<ComposedChart
					height={400}
					data={chartData}
					margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray="3 3" />

					<defs>
						<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
							<stop offset="45%" stopColor="#85C1E9" stopOpacity={0.8} />
							<stop offset="95%" stopColor="#60a5fa " stopOpacity={0.2} />
						</linearGradient>
					</defs>

					<XAxis dataKey="date"
						axisLine={false}
						tick={false}
					// tickFormatter={tickFormatter}
					// interval={xInterval()} // Ensures every tick is displayed
					// ticks={chartData.map(item => item.date.split("T")[0])} // Ensures unique ticks for each date entry
					/>

					<YAxis
						yAxisId="yPrice"
						orientation="right"
						domain={[yTicks[0], yTicks[yTicks.length - 1]]}  // Customize the vertical axis range
						tickCount={yTicks.length - 1}       // Set the number of ticks
						ticks={yTicks}
						tick={{ fontSize: 11 }}
						// tick={false}  // Hide the Y-axis labels
						axisLine={false}  // Optionally hide the Y-axis line
						tickLine={false}  // Optionally hide the tick lines
						tickFormatter={formatYPriceAxis}
					/>
					<YAxis
						yAxisId="yVolume"
						orientation="left"
						tick={{ fontSize: 11 }}
						tickFormatter={formatYVolumeAxis}
					/>

					<Tooltip content={<CustomTooltip />} />

					{/* <Area type="monotone"  dataKey="low"  />
					 <Area type="monotone" dataKey="high" />
					 <Area type="monotone" dataKey="open" /> */}
					<Bar yAxisId="yVolume" dataKey="volume" barSize={20} fill="#ABB2B9" />
					<Area yAxisId="yPrice" type="monotone" dataKey="close" strokeWidth={1} activeDot={{ r: 8 }} dot={false} fill="url(#colorUv)" />
				</ComposedChart>
			</ResponsiveContainer>

			<div className="flex flex-row space-x-6 px-3 font-semibold">
				{Utils.dateRangeList.map((item, i) => (
					<ChartDateRange key={`dateRange_${i}`} name={item} selected={dateRangeName == item} handleOnClick={(name: string) => setDateRangeName(name)} />
				))}
			</div>

			<hr className="text-black border mb-3" />

		</div>
	);
};