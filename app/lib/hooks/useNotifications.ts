'use client';

import useSWR from 'swr';
// import fetchStockData from '@/lib/utils/fetchStockIndexes';
import { JSONObject } from '../definations';
import * as Utils from "@/lib/utils";
import axios from 'axios';
import { fetchIndividualData } from '../utils/fetchStockIndexes';
import { useEffect } from 'react';


// const fetcher = (userId: string) => axios.get(`/api/notifications?userId=${userId}`).then(res => res.data);


const fetcher = async (userId: string) => {
	try {
	  const response = await axios.get(`/api/notifications`, {
		params: {
			userId: userId,
		},
	  });
  
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
  

const useNotifications  = (userId: string) => {
	const { data, mutate, error, isValidating } = useSWR(
		`/api/notifications?userId=${userId}`,
		() => fetcher(userId),
		{
		  refreshInterval: 5 * 60 * 60 * 1000, // Fetch data every 5 hours
		  revalidateOnFocus: true,
		  revalidateOnReconnect: true,
		}
	  );


	if (error) {
		console.error("Error in useStockData:", error);
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
		notificationList: data,
		isLoading: !error && isValidating,
		dateTimeStamp: new Date().getTime()
	};
};

export default useNotifications;

