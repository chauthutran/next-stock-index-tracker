'use client';

import useSWR from 'swr';
import fetchStockChartData from '@/lib/utils/fetchStockChartData';
import { JSONObject } from '../definations';
import { useEffect } from 'react';
import * as Utils from "@/lib/utils";


const fetcher = ({ symbol, periodName }: { symbol: string, periodName: string }) => fetchStockChartData(symbol, periodName);

const useStockChartData = (symbol: string, periodName: string) => {
	const { data, error, isValidating, mutate } = useSWR({ symbol, periodName }, fetcher, {
		// refreshInterval: 5 * 1000, // Fetch data every 5 seconds
		refreshInterval: 5 * 60 * 60 * 1000, // Fetch data every 5 minutes
		revalidateOnFocus: true,
		revalidateOnReconnect: true,
	});

	let chartData: JSONObject | null = null;
	let errMsg = "";

	if( data !== undefined ) {
		if( data.statusText !== "OK" ) { 
			errMsg = "Error while fetching stock data.";
		}
		else {
			chartData = Utils.cloneJSONObject(data.data);
		}
	}

	
	useEffect(() => {
		 // Fetch data immediately
		 mutate();
		 
		// Return a cleanup function to stop revalidation by calling mutate 
		return () => {
			mutate(undefined, false); // Stop revalidation on unmount
		};
	}, [symbol, periodName, mutate]);
	
	return {
		chartData,
		errMsg,
		isLoading: !error && !data, isValidating,
		dateTimeStamp: new Date().getTime()
	};
};

export default useStockChartData;
