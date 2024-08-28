import { JSONObject } from "../definations";


export const getErrMessage = (ex: any) => {
	if (ex instanceof Error) {
		return `An error occurred: ${ex.message}`;
	}
	else if (ex.name === 'AbortError') {
		console.error('Fetch request timed out');
	}

	return `An unexpected error occurred: ${ex}`;
}

// Add commas to thousands.
// 12345 ==> 12,345.00
export const formatDisplayNumber = (n: number | string): string => {
	let num = convertToNumber(n);

	const formattedNum = new Intl.NumberFormat('en-US', {
		style: 'decimal',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(num);

	return formattedNum;
}

export const formatNumberToK = (n: number | string) => {
	let num = convertToNumber(n);

	if (num >= 1e9) {
		return (num / 1e9).toFixed(0).replace(/\.0$/, '') + 'B'; // Billions
	}
	if (num >= 1e6) {
		return (num / 1e6).toFixed(0).replace(/\.0$/, '') + 'M'; // Millions
	}
	if (num >= 1e3) {
		return (num / 1e3).toFixed(0).replace(/\.0$/, '') + 'k'; // Thousands
	}
	return formatDisplayNumber(num); // Less than thousands, retain decimal places
}

export const convertToNumber = (n: string | number): number => {
	let num;
	if (typeof n === 'string') {
		num = parseFloat(n);
	}
	else {
		num = n;
	}

	return num;
}


export const removeFromArray = function( list: JSONObject[], value: string, propertyName: string )
{
	let index: any;

	for( let i = 0; i < list.length; i++ )
	{
		var item = list[i];
		if ( item[ propertyName ] == value ) 
		{
			index = i;
			break;
		}
	}

	if ( index != undefined ) 
	{
		list.splice( index, 1 );
	}

	return list;
};


export const findFromArray = function( list: JSONObject[], value: string, propertyName: string )
{
	for( let i = 0; i < list.length; i++ )
	{
		var item = list[i];
		if ( item[ propertyName ] == value ) 
		{
			return item;
		}
	}
	
	return;
};
