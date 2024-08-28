import { JSONObject } from "@/lib/definations";
import { useEffect, useState } from "react"
import StockSelectItem from "./StockSelectItem";
import * as Utils from "@/lib/utils";
import StockAddItem from "./StockAddItem";
import CompareStockDetails from "./CompareStockDetails";
import fetchHistoricalData from "@/lib/utils/fetchStockHistoricalData";
import CompareStockChart from "./CompareStockChart";
import * as AppStore from "@/lib/AppStore";
import * as Constant from "@/lib/constant";
import { fetchIndividualData } from "@/lib/utils/fetchStockIndexes";
import Loading from "../layout/Loading";


interface PercentChange {
	timestamp: number;
	percentChange: number;
	close: number;
}

// interface CompareStockPageProps {
// 	stockList?: JSONObject[]; // Stock is a placeholder type; replace with your actual type
// }

// const CompareStockPage: React.FC<CompareStockPageProps> = ({ stockList = [] }) => {
export default function CompareStockPage() {

	const [stocks, setStocks] = useState<JSONObject[]>([]);
	const [details, setDetails] = useState<JSONObject | null>(null);
	const [loading, setLoading] = useState(false);


	const fetchDataForCompareStocks = async(symbols: string[]) => {
		let list: JSONObject[] = [];
		for( var i=0; i<symbols.length; i++ ) {
			const searchSymbolData = await fetchIndividualData(symbols[i]);
			const data = await fetchHistoricalData(symbols[i], "7D");

			let chartData = searchSymbolData.data[0];
			
			const longName = searchSymbolData.longname !== undefined ? searchSymbolData.longname : searchSymbolData.longName;
			chartData.longname = longName;
			chartData.chartData = data.data;
			list.push( chartData );
		}
		setLoading(false);
		setStocks(list);
	}

	useEffect(() => {
		const symbols = AppStore.getCompareSymbolList();
		if( symbols.length > 0 ) {
			setLoading(true);
			fetchDataForCompareStocks(symbols);
		}
		else {
			setLoading(false);
		}
	}, []);


	const addStockData = (stockData: JSONObject) => {
		fetchHistoricalData(stockData.symbol, "7D").then(response => {
			stockData.chartData = response.data;

			let temp = Utils.cloneJSONObject(stocks);
			temp.push(stockData);
			setStocks(temp);
		});
	}

	const calculatePercentChange = (historicalData: JSONObject): PercentChange[] => {

		if (!historicalData || !historicalData.timestamp || !historicalData.indicators.quote[0].close) {
			return [];
		}

		const { timestamp, indicators } = historicalData;
		const closePrices = indicators.quote[0].close;

		const percentChanges: PercentChange[] = closePrices.map((price: number, index: number, prices: number[]): PercentChange => {
			if (index === 0) {
				return { timestamp: timestamp[index], percentChange: 0, close: price }; // No change for the first minute
			}
			const previousPrice = prices[index - 1];
			const percentChange = ((price - previousPrice) / previousPrice) * 100;
			return { timestamp: timestamp[index], percentChange, close: price };
		});

		return percentChanges;
	};

	const removeStockData = (stockData: JSONObject) => {
		let temp = Utils.cloneJSONObject(stocks);
		temp = Utils.removeFromArray(temp, stockData.symbol, "symbol");

		setStocks(temp);
	}

	const transformChartData = () => {
		let symbols: string[] = [];
		let transformedData: JSONObject[] = [];

		for (var i = 0; i < stocks.length; i++) {
			const symbol = stocks[i].symbol;
			symbols.push(symbol);

			const chartData = calculatePercentChange(stocks[i].chartData);
			for (var j = 0; j < chartData.length; j++) {
				let data: JSONObject = {};
				let longName = stocks[i].longname;
				data.longname = (longName !== undefined ) ? longName : stocks[i].longName;

				var found = Utils.findFromArray(transformedData, chartData[j].timestamp + "", "timestamp");
				if (!found) {
					let tempData: JSONObject = {};
					tempData.timestamp = chartData[j].timestamp;
					tempData[`${symbol}_percentChange`] = chartData[j].percentChange;
					tempData[`${symbol}_close`] = chartData[j].close;

					transformedData.push(tempData);

				}
				else {
					found[`${symbol}_percentChange`] = chartData[j].percentChange;
					found[`${symbol}_close`] = chartData[j].close;
				}
			}
		}

		return {
			symbols,
			data: transformedData
		};
	}


	const transformedData = transformChartData();


	if(loading) return ( <Loading /> );
	
	return (
		<div className="m-5 flex flex-col space-y-5">
			{/* Search div */}
			<div className="flex flex-row rounded-xl m-2 space-x-3 items-center text-sm">
				<div className="w-1/3">Compare up to four stocks by adding the symbol or company name.
				</div>
				{/* For the selected stocks */}
				{stocks.map((item, idx) => (
					<StockSelectItem
						key={`compare_${idx}`}
						stockData={item}
						index={idx}
						handleOnRemoveItem={(stockData) => removeStockData(stockData)}
					/>
				))}

				{/* For add new stock */}
				<StockAddItem
					key={`compare_${stocks.length}`}
					handleOnAddItem={(stockData) => addStockData(stockData)}
				/>
			</div>
			
			<div className="flex flex-row">
				{/* Charts */}
				<CompareStockChart chartData={transformedData} onUpdateDetails={(data) => setDetails(data)} />
				{/* Details */}
				{details !== null && <div className="hidden lg:block"><CompareStockDetails stocks={stocks} data={details} /></div>}
			</div>

			{/* Details */}
			{details !== null && <div className="lg:hidden"><CompareStockDetails stocks={stocks} data={details} /></div>}
		</div>
	)
}