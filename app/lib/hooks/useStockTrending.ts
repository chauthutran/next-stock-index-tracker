'use client';

import useSWR from 'swr';
import { JSONObject } from '../definations';
import * as Utils from "@/lib/utils";
import axios from 'axios';
import { useEffect } from 'react';


// const fetcher = () => axios.get("/api/stock-trending").then(res => res);


const fetcher = async () => {
	try {
	  const response = await axios.get(`/api/stock-trending`);
  
	  // Check if the response data is valid
	  if (response && response.data) {
		return response.data;
	  } else {
		throw new Error("Received empty or invalid data from the API");
	  }
	} catch (error) {
	  console.error("Error fetching data:", error);
	  throw error; // Rethrow the error to be handled by SWR
	}
  };
  

const useStockTrending = () => {
	// const {data, mutate, error, isValidating} = useSWR({}, fetcher, {
	// 	// refreshInterval: 5 * 1000, //  Fetch data every 5 seconds
	// 	refreshInterval: 5 * 60 * 60 * 1000, // Fetch data every 5 minutes
	// 	revalidateOnFocus: true,
	// 	revalidateOnReconnect: true,
	// });

	const { data, mutate, error, isValidating } = useSWR(
		`/api/stock-trending`,
		() => fetcher(),
		{
		  refreshInterval: 5 * 60 * 60 * 1000, // Fetch data every 5 hours
		  revalidateOnFocus: true,
		  revalidateOnReconnect: true,
		}
	  );




	if (error) {
		console.error("Error in useStockTrending:", error);
	  }

	// let stockTrending: JSONObject[] = [];
	// let errMsg = "";
	// if( data !== undefined ) {
	// 	if( data.statusText !== "OK" ) {
	// 		errMsg = "Error while fetching stock data.";
	// 	}
	// 	else {
	// 		stockTrending = Utils.cloneJSONObject(data.data);
	// 	}
	// }
	
	useEffect(() => {
		// // Fetch data immediately
		// mutate();
		
		// // Return a cleanup function to stop revalidation by calling mutate 
		return () => {
		  mutate(undefined, false); // Stop revalidation on unmount
		};
	  }, [mutate]);
	
	return {
		stockTrending: data,
		// errMsg: errMsg,
		isLoading: !error && !data, isValidating,
		dateTimeStamp: new Date().getTime()
	};
};

export default useStockTrending;

