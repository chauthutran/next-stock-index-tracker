'use client';

import useSWR from 'swr';
// import fetchStockData from '@/lib/utils/fetchStockIndexes';
import { JSONObject } from '../definations';
import * as Utils from "@/lib/utils";
import axios from 'axios';
import { fetchIndividualData } from '../utils/fetchStockIndexes';
import { useEffect } from 'react';


const fetcher = (userId: string) => axios.get(`/api/portfolio?userId=${userId}`).then(res => res);

const usePortfolio  = (userId: string) => {
	const {data, mutate, error, isValidating} = useSWR(userId, fetcher, {
		// refreshInterval: 5 * 1000, //  Fetch data every 5 seconds
		refreshInterval: 5 * 60 * 60 * 1000, // Fetch data every 5 minutes
		revalidateOnFocus: true,
		revalidateOnReconnect: true,
	});


	let portfolioList: JSONObject[] = [];
	let errMsg = "";
	if( data !== undefined ) {
		if( data.statusText !== "OK" ) {
			errMsg = "Error while fetching stock data.";
		}
		else {
			if(data.data == null ) {
				portfolioList = [];
			}
			else {
				portfolioList = Utils.cloneJSONObject(data.data.investments);
			}
		}
	}
	
	useEffect(() => {
		//  // Fetch data immediately
		//  mutate();
		
		// // Return a cleanup function to stop revalidation by calling mutate 
		return () => {
		  mutate(undefined, false); // Stop revalidation on unmount
		};
	  }, [mutate]);
	
	return {
		portfolioList: portfolioList,
		errMsg: errMsg,
		isLoading: !error && isValidating,
		dateTimeStamp: new Date().getTime()
	};
};

export default usePortfolio;

