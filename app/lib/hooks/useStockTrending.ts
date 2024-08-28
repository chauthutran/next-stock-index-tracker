'use client';

import useSWR from 'swr';
import { JSONObject } from '../definations';
import * as Utils from "@/lib/utils";
import axios from 'axios';
import { useEffect } from 'react';


const fetcher = () => axios.get("/api/stock-trending").then(res => res);

const useStockTrending = () => {
	const {data, mutate, error, isValidating} = useSWR({}, fetcher, {
		// refreshInterval: 5 * 1000, //  Fetch data every 5 seconds
		refreshInterval: 5 * 60 * 60 * 1000, // Fetch data every 5 minutes
		revalidateOnFocus: true,
		revalidateOnReconnect: true,
	});


	let stockTrending: JSONObject[] = [];
	let errMsg = "";
	if( data !== undefined ) {
		if( data.statusText !== "OK" ) {
			errMsg = "Error while fetching stock data.";
		}
		else {
			stockTrending = Utils.cloneJSONObject(data.data);
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
		stockTrending: stockTrending,
		errMsg: errMsg,
		isLoading: !error && !data, isValidating,
		dateTimeStamp: new Date().getTime()
	};
};

export default useStockTrending;

