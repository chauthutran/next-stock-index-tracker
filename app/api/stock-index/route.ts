
import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';


export async function GET(request: NextRequest) {

	const { searchParams } = new URL(request.url);
	const symbols = searchParams.get("symbols");

	try {
		const arrSymbols = symbols!.split(",");
		// const result = await yahooFinance.quote(arrSymbols, { fields: ['peRatio', 'forwardEps', 'trailingEps', 'dividendYield'] });
		// const result = await yahooFinance.quote(arrSymbols, { fields: [ "symbol", "longName", "dividendYield" ] });
		const result = await yahooFinance.quote(arrSymbols, { fields: [ "marketCap", "region", "quoteType", "typeDisp", "currency", "regularMarketChange", "regularMarketTime", "symbol", "longName", "dividendYield", "regularMarketDayHigh", "regularMarketDayRange", "regularMarketDayLow", "regularMarketVolume", "regularMarketPreviousClose", "fullExchangeName", "regularMarketOpen", "fiftyTwoWeekLowChange", "fiftyTwoWeekLowChangePercent", "fiftyTwoWeekRange", "fiftyTwoWeekHighChange", "fiftyTwoWeekHighChangePercent", "fiftyTwoWeekLow", "fiftyTwoWeekHigh", "fiftyTwoWeekChangePercent", "fiftyDayAverage", "fiftyDayAverageChange", "fiftyDayAverageChangePercent", "twoHundredDayAverage", "twoHundredDayAverageChange", "twoHundredDayAverageChangePercent", "sourceInterval", "exchangeDataDelayedBy", "marketState", "regularMarketChangePercent", "regularMarketPrice", "exchange", "shortName", "longName", "messageBoardId", "exchangeTimezoneName", "exchangeTimezoneShortName", "gmtOffSetMilliseconds", "market", "esgPopulated", "tradeable", "cryptoTradeable", "symbol"
		]});

		return NextResponse.json(result, { status: 200 });
	} catch (error: any) {

		if (error instanceof yahooFinance.errors.FailedYahooValidationError) {
			// See the validation docs for examples of how to handle this
			// error.result will be a partially validated / coerced result.
		} else if (error instanceof yahooFinance.errors.HTTPError) {
			// Probably you just want to log and skip these
			return NextResponse.json({ error: (`Skipping yf.quote("${symbols}"): [${error.name}] ${error.message}`) }, { status: 500 });
			// return;
		} else {
			// Same here
			return NextResponse.json({ error: `Skipping yf.quote("${symbols}"): [${error.name}] ${error.message}` }, { status: 500 });
			// return;
		}
	}

}