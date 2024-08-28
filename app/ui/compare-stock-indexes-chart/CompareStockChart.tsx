import { JSONObject } from "@/lib/definations";
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { format, parseISO } from 'date-fns';
import * as Utils from "@/lib/utils";


export default function CompareStockChart({ chartData, onUpdateDetails }: { chartData: JSONObject, onUpdateDetails: (data: JSONObject) => void }) {

	const formatXAxis = (tickItem: string) => {
		return Utils.formatDisplayDateFromObj(tickItem);
	};

	const formatYPriceAxis = (tickItem: string) => {
		return Utils.formatDisplayNumber(tickItem) + "%";
	};


	return (
		<>
			<ResponsiveContainer width="100%" height={500}>
				<ComposedChart
					height={400}
					data={chartData.data}
					margin={{ top: 5, right: 30, bottom: 5 }}
					onMouseMove={(state: JSONObject) => {
						if (state && state.activePayload && state.activePayload.length > 0) {
							onUpdateDetails(state.activePayload[0].payload
							);
						} else {
							// setDetails(null);
						}
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />

					<XAxis dataKey="timestamp" tickFormatter={formatXAxis} />

					<YAxis tickFormatter={formatYPriceAxis} />
					<ReferenceLine y={0} stroke="red" strokeWidth={2} strokeDasharray="3 3" />

					{chartData.symbols.map((symbol: string, idx: number) => (
						<Line type="monotone" key={`${symbol}_${idx}`} dataKey={`${symbol}_percentChange`} stroke={Utils.COLORS_LIST[idx % Utils.COLORS_LIST.length]} dot={false} strokeWidth={2} />
						// <Area  key={`${symbol}_${idx}`} type="monotone" dataKey={`${symbol}_percentChange`}  strokeWidth={1} activeDot={{ r: 8 }} dot={false} fill={Utils.COLORS_LIST[idx % Utils.COLORS_LIST.length]} opacity={0.5}/>
					))}

				</ComposedChart>
			</ResponsiveContainer>
		</>
	)
}