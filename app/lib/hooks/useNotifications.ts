'use client';

import useSWR from 'swr';
// import fetchStockData from '@/lib/utils/fetchStockIndexes';
import { JSONObject } from '../definations';
import * as Utils from "@/lib/utils";
import axios from 'axios';
import { fetchIndividualData } from '../utils/fetchStockIndexes';
import { useEffect } from 'react';


const fetcher = (userId: string) => axios.get(`/api/notifications?userId=${userId}`).then(res => res);

const useNotifications  = (userId: string) => {
	const {data, mutate, error, isValidating} = useSWR(userId, fetcher, {
		// refreshInterval: 5 * 1000, //  Fetch data every 5 seconds
		refreshInterval: 5 * 60 * 60 * 1000, // Fetch data every 5 minutes
		revalidateOnFocus: true,
		revalidateOnReconnect: true,
	});


	let notificationList: JSONObject[] = [];
	let errMsg = "";
	if( data !== undefined ) {
		if( data.statusText !== "OK" ) {
			errMsg = "Error while fetching notifications.";
		}
		else {
			if(data.data == null ) {
				notificationList = [];
			}
			else {
				notificationList = Utils.cloneJSONObject(data.data);
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
		notificationList: notificationList,
		errMsg: errMsg,
		isLoading: !error && isValidating,
		dateTimeStamp: new Date().getTime()
	};
};

export default useNotifications;

