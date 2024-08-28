
import connectToDatabase from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';


export async function GET(request: NextRequest) {

	await connectToDatabase(); // Ensure DB connection
	
	const { searchParams } = new URL(request.url);
	const requestType = searchParams.get("requestType"); // search, timeSeries, ...
	const symbol = searchParams.get("symbol");


	try {
		// if( requestType === "search")
		// { 
			const options = {
				quotesCount: 10
			}
			const result = await yahooFinance.search(symbol!, options);
			return NextResponse.json(result, { status: 200 });
		// }
		// else if( requestType == "timeSeries") {
		// 	const startDate = searchParams.get("startDate");
		// 	const endDate = searchParams.get("endDate");
		// 	const startTimestamp = Math.floor(new Date(startDate!).getTime() / 1000);
		// 	const endTimestamp = Math.floor(new Date(endDate!).getTime() / 1000);


			// FundamentalsTimeSeriesOptions {
			// 	period1: Date | number | string;
			// 	period2?: Date | number | string;
			// 	type?: string;
			// 	merge?: boolean;
			// 	padTimeSeries?: boolean;
			// 	lang?: string;
			// 	region?: string;
			// 	module: string;
			// }


			// const options = {
			// 	period1: startTimestamp,
			// 	period2: endTimestamp,
			// 	padTimeSeries: true
			// }
			// const result = await yahooFinance.fundamentalsTimeSeries(symbol!, options);
		// }
	} catch (error: any) {

		if (error instanceof yahooFinance.errors.FailedYahooValidationError) {
			// See the validation docs for examples of how to handle this
			// error.result will be a partially validated / coerced result.
		} else if (error instanceof yahooFinance.errors.HTTPError) {
			// Probably you just want to log and skip these
			return NextResponse.json({ error: (`Skipping yf.quote("${symbol}"): [${error.name}] ${error.message}`) }, { status: 500 });
		} else {
			return NextResponse.json({ error: `Skipping yf.quote("${symbol}"): [${error.name}] ${error.message}` }, { status: 500 });
		}
	}

}