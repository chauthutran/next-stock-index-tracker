'use client';

import { useEffect, useState } from 'react';
import * as Constant from "@/lib/constant";
import { useMainUi } from '@/contexts/MainUiContext';
import { JSONObject } from '@/lib/definations';
import StockIndexList from './stock-index-list/StockIndexList';
import SearchStock from './stock-index-list/SearchStock';
import { fetchIndividualData } from '@/lib/utils/fetchStockIndexes';
import * as AppStore from "@/lib/AppStore";
import CountryList from './stock-index-list/CountryList';
import StockTrending from './trending/StockTrending';


export default function HomePage() {

	const { mainPage, setMainPage } = useMainUi();

	const [selectedStock, setSelectedStock] = useState<JSONObject | null>(null);
	const [symbolList, setSymbolList] = useState<string[]>(Constant.SYMBOL_DEFAULT_LIST["US"]);

	useEffect(() => {
		AppStore.setCompareSymbolList([]);
	}, [])

	const addItem = async (data: JSONObject) => {
		const response = await fetchIndividualData(data.symbol);
		if (response.status == "success") {
			AppStore.setSelectedSymbolData(response.data[0]);
			setMainPage(Constant.UI_SYMBOL_DETAILS);
			setSelectedStock(response.data[0]);
		}
	}

	const handleCountryChange = (cnCode: string) => {
		const list: string[] = Constant.SYMBOL_DEFAULT_LIST[cnCode];
		setSymbolList(list);
	}

	const handleShowCompareChart = (countryCode: string) => {
		const symbols: string[] = Constant.SYMBOL_DEFAULT_LIST[countryCode];
		AppStore.setCompareSymbolList(symbols);

		setMainPage(Constant.UI_PAGE_COMPARE_STOCK_INDEXES_CHARTS);
	};

console.log("===== symbolList");
console.log(symbolList);
	return (
		<div className='flex flex-col'>
			
			<div className="ml-2 w-1/2"><SearchStock handleOnItemSelect={(stockData) => addItem(stockData)} /></div>

			<div className="ml-2 mt-5 mb-2"><CountryList
				selectedItem="US"
				onSelectedItem={(countryCode) => handleCountryChange(countryCode)}
				onCompareMarkets={(countryCode) => handleShowCompareChart(countryCode)}
			/></div>

			{symbolList.length > 0 && <div><StockIndexList symbols={symbolList} handleOnItemClick={(item) => AppStore.setSelectedSymbolData(item)} /></div>}
		</div>
	);
};