'use client';

import useSWR from 'swr';
// import fetchStockData from '@/lib/utils/fetchStockIndexes';
import { JSONObject } from '../definations';
import * as Utils from "@/lib/utils";
import axios from 'axios';
import { fetchIndividualData } from '../utils/fetchStockIndexes';
import { useEffect } from 'react';


const fetcher = (symbols: string[]) => axios.get(`/api/stock-index`, {
	params: {
		symbols: symbols.join(",")
	},
}).then(res => res);

const useStockData = (symbols: string[]) => {
	const {data, mutate, error, isValidating} = useSWR(symbols, fetcher, {
		// refreshInterval: 5 * 1000, //  Fetch data every 5 seconds
		refreshInterval: 5 * 60 * 60 * 1000, // Fetch data every 5 minutes
		revalidateOnFocus: true,
		revalidateOnReconnect: true,
	});


	let stockPriceList: JSONObject[] = [];
	let errMsg = "";
	if( data !== undefined ) {
		if( data.statusText !== "OK" ) {
			errMsg = "Error while fetching stock data.";
		}
		else {
			stockPriceList = Utils.cloneJSONObject(data.data);
		}
	}
	
	useEffect(() => {
		 // Fetch data immediately
		 mutate();
		
		// // Return a cleanup function to stop revalidation by calling mutate 
		return () => {
		  mutate(undefined, false); // Stop revalidation on unmount
		};
	  }, [mutate]);
	
	return {
		stockPriceList: stockPriceList,
		errMsg: errMsg,
		isLoading: !error && !data, isValidating,
		dateTimeStamp: new Date().getTime()
	};
};

export default useStockData;

