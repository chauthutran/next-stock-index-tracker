import axios from 'axios';
import { JSONObject } from '../definations';
import * as Constant from "@/lib/constant";

export async function fetchIndividualData( symbols: string ): Promise<JSONObject> {
	try {
		const response = await axios.get(`/api/stock-index`, {
			params: {
				symbols: symbols
			},
		});

		return {status: "success", data: response.data};
	} catch (error) {
		return {status: "error"};
	}
}