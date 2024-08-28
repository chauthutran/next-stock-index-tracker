

import { format, parseISO } from 'date-fns';
import { JSONObject } from '../definations';

export const dateRangeList = ["1D", "7D", "1M", "3M", "6M", "9M", "1Y", "2Y", "5Y", "All"];
    
export const getDateRange = (rangeName: string) => {
	let dateRange: JSONObject = {};

	switch (rangeName) {
		case "1D":
			dateRange = getDateRangeFromCurrentDate(2);
			break;
		case "7D":
			dateRange = getDateRangeFromCurrentDate(7);
			break;
		case "1M":
			dateRange = getDateRange_Months(1);
			break;
		case "3M":
			dateRange = getDateRange_Months(3);
			break;
		case "6M":
			dateRange = getDateRange_Months(6);
			break;
		case "9M":
			dateRange = getDateRange_Months(9);
			break;
		case "1Y":
			dateRange = getDateRange_Years(1);
			break;
		case "2Y":
			dateRange = getDateRange_Years(2);
			break;
		case "5Y":
			dateRange = getDateRange_Years(5);
			break;
		case "All":
			dateRange = getDateRange_Years(100);
			break;
	}

	return dateRange;
}


export const getDateRangeFromCurrentDate = (dayNo: number): JSONObject => {
	const curDate = new Date();
	curDate.setDate(curDate.getDate() + 1);

	let daysAgo = new Date();
	daysAgo.setDate(curDate.getDate() - dayNo);

	return {
		startDate: formatToDbDate(daysAgo),
		endDate: formatToDbDate(curDate)
	}
}

const getDateRange_Months = (monthNo: number): JSONObject => {
	const curDate = new Date();
	curDate.setDate(curDate.getDate() + 1);

	const startDate = new Date();
	startDate.setMonth(startDate.getMonth() - monthNo);

	return {
		startDate: formatToDbDate(startDate),
		endDate: formatToDbDate(curDate)
	}
}


 const getDateRange_Years = (yearNo: number): JSONObject => {
	const curDate = new Date();
	curDate.setDate(curDate.getDate() + 1);

	const startDate = new Date();
	startDate.setFullYear(startDate.getFullYear() - yearNo);

	return {
		startDate: formatToDbDate(startDate),
		endDate: formatToDbDate(curDate)
	}
}

export const formatToDbDate = (date: Date): string => {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${date.getFullYear()}-${month}-${day}`;
}

export const formatToDbDateTime = (date: Date): string => {
	const hours = (date.getHours() + "").padStart(2, '0');
	const minutes = (date.getMinutes() + "").padStart(2, '0');
	const seconds = (date.getSeconds() + "").padStart(2, '0');

	return `${formatToDbDate(date)}T${hours}:${minutes}:${seconds}`;
}

export const formatDisplayDateTime = (dateStr: string): string => {
	if( identifyStringType(dateStr) === "Date" )
	{ 
		const date = parseISO(dateStr);
		return format(date, 'MMM dd, yyyy HH:mm');
	}

	return formatDisplayDateTimeFromObj(dateStr);
}


export const formatDistplayDate = (dateStr: string): string => {
	const date = parseISO(dateStr);
	return format(date, 'MMM dd, yyyy');
}


export const formatDisplayDateFromObj = (timestamp: string): string => {
	const date = new Date(parseInt(timestamp) * 1000);

	const dateStr = parseISO(formatToDbDate(date));
	return format(dateStr, 'MMM dd, yyyy');
}

export const formatDisplayTimeFromObj = (timestamp: string): string => {
	const date = new Date(parseInt(timestamp) * 1000);

	const dateStr = parseISO(formatToDbDateTime(date));
	return format(dateStr, 'HH:mm');
}

export const formatDisplayDateTimeFromObj = (timestamp: string): string => {
	const date = new Date(parseInt(timestamp) * 1000);

	const dateStr = parseISO(formatToDbDateTime(date));
	return format(dateStr, 'MMM dd, yyyy HH:mm');
}

export const identifyStringType = (value: string): string => {
    if (isTimestamp(value)) {
        return 'Timestamp';
    } else {
        return 'Date';
    }
}


const isTimestamp = (timestampString: string): boolean => {
    // Check if the string is numeric
    const isNumeric = /^\d+$/.test(timestampString);
    if (!isNumeric) return false;

    // Convert to number and check if it's a valid timestamp
    const timestamp = Number(timestampString);
    const now = Date.now();
    // Consider valid timestamps to be within a plausible range
    return timestamp > 0 && timestamp < now + 100000000000;
}
