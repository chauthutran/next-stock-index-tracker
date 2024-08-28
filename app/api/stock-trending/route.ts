
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';


export async function GET(request: NextRequest) {

	try {
		// const queryOptions = { count: 5, lang: 'en-US' };
		// const trendingSymbols = await yahooFinance.trendingSymbols("US", queryOptions);

		const response = await axios.get(`https://query2.finance.yahoo.com/v1/finance/trending/US?count=20&useQuotes=true&fields=logoUrl,regularMarketChangePercent,regularMarketPrice,longName,regularMarketChange,regularMarketVolume,marketCap,regularMarketDayHigh,regularMarketDayLow`);

		return NextResponse.json(response.data.finance.result[0].quotes, { status: 200 });
	} catch (error: any) {

		if (error instanceof yahooFinance.errors.FailedYahooValidationError) {
			// See the validation docs for examples of how to handle this
			// error.result will be a partially validated / coerced result.
			return NextResponse.json({ error: (`[${error.name}] ${error.message}`) }, { status: 500 });
		} else if (error instanceof yahooFinance.errors.HTTPError) {
			// Probably you just want to log and skip these
			return NextResponse.json({ error: (`[${error.name}] ${error.message}`) }, { status: 500 });
			// return;
		} else {
			// Same here
			return NextResponse.json({ error: `[${error.name}] ${error.message}` }, { status: 500 });
			// return;
		}
	}

}