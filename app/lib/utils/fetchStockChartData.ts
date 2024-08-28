import * as Utils from '@/lib/utils';
import axios from 'axios';
import { JSONObject } from './../definations';

/**
 * 
 * @param symbol 
Dow Jones Industrial Average (DJIA) --- Symbol: DJIA
S&P 500 --- Symbol: SPX
NASDAQ Composite --- Symbol: IXIC
Russell 2000e --- Symbol: RUT
S&P 100e --- Symbol: OEX
NYSE Compositee --- Symbol: NYA
FTSE 100 (UK) --- Symbol: FTSE
DAX (Germany) --- Symbol: GDAXI
CAC 40 (France) --- Symbol: FCHI
Nikkei 225 (Japan) --- Symbol: N225
Hang Seng Index (Hong Kong) --- Symbol: HSI
Shanghai Composite Index (China) --- Symbol: SSEC
S&P/TSX Composite (Canada) --- Symbol: GSPTSE
...
*/

/**
 * 
 * @param symbols For example "DJIA"
 * @returns 
 */
export default async function fetchChartData(symbol: string, periodName: string): Promise<JSONObject> {
	const options = getOptions(periodName);

	const response = await axios.get(`/api/stock-chart-data`, {
		params: {
			"symbol": symbol,
			"startDate": options.startDate,
			"endDate": options.endDate,
			"interval": options.interval
		},
	});
	
	let dataList = response.data.quotes;
	if (dataList === undefined) {
		response.data.quotes = []
	}
	else if (options.isOneDay) {
		response.data.quotes = getChartDataInLatestDate(response.data.quotes);
	}

	return response;
}


const getOptions = (periodName: string): JSONObject => {
	let dateRange: JSONObject = Utils.getDateRange(periodName);
	let interval: string | undefined;
	let isOneDay = false;

	if(periodName == "1D" ) {
		isOneDay = true;
		interval = "1m";
	}
	else if(periodName == "7D" ) {
		interval = "1m";
	}
	else if(periodName == "1M" ) {
		interval = "5m";
	}
	else {
		interval = "1d";
	}

	return ( {
		startDate: dateRange.startDate, 
		endDate: dateRange.endDate, 
		interval, 
		isOneDay
	} );
}


const getChartDataInLatestDate = (dataList: JSONObject[]) => {
	let data = [];
	if (dataList !== undefined && dataList.length > 0) {
		var latestDate = dataList[0].date.split("T")[0];
		for (var i = 0; i < dataList.length; i++) {
			if (latestDate == dataList[i].date.split("T")[0]) {
				data.push(dataList[i]);
			}
			else {
				return data;
			}
		}
	}

	return data;
}