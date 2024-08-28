import { ChartOptionsWithReturnArray, ChartOptionsWithReturnObject } from './../../../node_modules/yahoo-finance2/dist/cjs/src/modules/chart.d';

// utils/fetchStockIndexData.ts
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import * as Utils from "@/lib/utils";
import yahooFinance from 'yahoo-finance2';


// const API_KEY = process.env.FINANCIAL_MODELING_PREP;
// const BASE_URL = 'https://financialmodelingprep.com/api/v3';

type ValidInterval = "1m" | "2m" | "5m" | "15m" | "30m" | "60m" | "90m" | "1h" | "1d" | "5d" | "1wk" | "1mo" | "3mo" | undefined;


export async function GET(request: NextRequest) {

	const { searchParams } = new URL(request.url);
	const symbol = searchParams.get("symbol");
	const startDate = searchParams.get("startDate");
	const endDate = searchParams.get("endDate");
	const interval = searchParams.get("interval");

	// const startTimestamp = Math.floor(new Date().getTime() / 1000);
  	// const endTimestamp = startTimestamp + 24 * 60 * 60; // Add one day in seconds

	const startTimestamp = Math.floor(new Date(startDate!).getTime() / 1000);
	const endTimestamp = Math.floor(new Date(endDate!).getTime() / 1000);

	// Validate the date range to ensure it's within 7 days for 1m interval
	const MAX_DAYS_FOR_1M = 7 * 24 * 60 * 60; // 7 days in seconds
	if (interval === '1m' && endTimestamp - startTimestamp > MAX_DAYS_FOR_1M) {
		throw new Error('Date range for 1m data cannot exceed 7 days');
	}

	if (
		typeof symbol !== 'string' ||
		typeof startDate !== 'string' ||
		typeof endDate !== 'string' ||
		!(typeof interval === 'string' && ['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h', '1d', '5d', '1wk', '1mo', '3mo'].includes(interval))
	  ) {
		return NextResponse.json({error: "Invalid query, startDate, endDate, or interval"}, { status: 200 });
	  }
	
	try {
		const query = symbol!; // '^DJI';
		
		// const queryOptions = { period1: startDate!, interval: '1m' }; // { period1: '2024-01-01', /* ... */ };
		const queryOptions: ChartOptionsWithReturnArray = {
			// period1: Math.floor(new Date().getTime() / 1000),
			// period2: Math.floor(new Date().getTime() / 1000),
			// period1: startTimestamp,
			// period2: endTimestamp,
			period1: startDate,
			period2: endDate,
			interval: interval as ValidInterval,
			return: 'array' // Ensure the 'return' property is set correctly, 'object' or 'array'
		  };

		const result = await yahooFinance.chart(query, queryOptions);

		return NextResponse.json(result, { status: 200 });
	} catch (error: any) {
		// if (error instanceof Error) {
		//     return NextResponse.json({ error: 'Error fetching data: ' + error.message }, { status: 500 });
		// } else {
		//     return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
		// }

		if (error instanceof yahooFinance.errors.FailedYahooValidationError) {
			// See the validation docs for examples of how to handle this
			// error.result will be a partially validated / coerced result.
		} else if (error instanceof yahooFinance.errors.HTTPError) {
			// Probably you just want to log and skip these
			return NextResponse.json({ error: (`Skipping yf.quote("${symbol}"): [${error.name}] ${error.message}`) }, { status: 500 });
			// return;
		} else {
			// Same here
			return NextResponse.json({ error: `Skipping yf.quote("${symbol}"): [${error.name}] ${error.message}` }, { status: 500 });
			// return;
		}

	}

}