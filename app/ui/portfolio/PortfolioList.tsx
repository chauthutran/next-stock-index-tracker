// components/Portfolio.tsx
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { JSONObject } from '@/lib/definations';
import * as Utils from "@/lib/utils";
import PortfolioItem from './PortfolioItem';
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import Loading from '../layout/Loading';


interface PortfolioListHandles {
	handleOnUpdate: (investments: JSONObject[]) => void;
  }

const PortfolioList = forwardRef<PortfolioListHandles>((props, ref) => {

	const { user } = useAuth();
	const [list, setList] = useState<JSONObject[]>([]);

	// Define the handleOnUpdate function
	const handleOnUpdate = async(newList: JSONObject[]) => {
		const result = await transformData(newList);
		setList(result);
	};

	// Expose the handleOnUpdate function to the parent component
	useImperativeHandle(ref, () => ({
		handleOnUpdate
	}));

	const fetchData = async () => {
		try {
			const response = await axios.get(`/api/portfolio`, {
				params: {
					userId: user!._id
				}
			});
			
			console.log("Response:", response);
			
			if (response.status !== 200) {
				throw new Error("Error while fetching stock data.");
			}
			
			if (!response.data) {
				setList([]);
			} else {
				const investments = response.data.investments;
				const result = await transformData(investments);
				setList(Utils.cloneJSONObject(result));
			}
		} catch (error) {
			console.error("Fetch data error:", Utils.getErrMessage(error));
		}
	}


	const calculatePerformance = (portfolio: JSONObject[]): JSONObject => {
		let totalInvestment = 0;
		let currentValue = 0;

		portfolio.forEach((item) => {
			totalInvestment += item.investmentValue;
			currentValue += item.currentValue;
		});

		return {
			totalInvestment,
			currentValue,
			profitLoss: currentValue - totalInvestment,
		};
	};

	useEffect(() => {
		fetchData();
	}, []);

	const transformData = async(investments: JSONObject[]): Promise<JSONObject[]> => {
		let result: JSONObject[] = [];
		const symbols = investments.map((item: JSONObject) => item.symbol);
		const currentPricesResponse = await axios.get(`/api/stock-index`, {
			params: {
				symbols: symbols.join(",")
			},
		});

		for (var i = 0; i < investments.length; i++) {
			const foundCurrentPrice = Utils.findFromArray(currentPricesResponse.data, investments[i].symbol, "symbol")!;
			let item = { ...investments[i], ...foundCurrentPrice };
			
			item.investmentValue = item.quantity * item.purchasePrice;
			item.currentValue = item.quantity * foundCurrentPrice.regularMarketPrice;

			result.push( item );
		}

		return result;
	}
	
	const totalData = calculatePerformance(list);
	 

	return (
		<div className="flex flex-col space-y-8 text-navy-blue">

			<div className="w-1/3 bg-pastel-blue bg-opacity-30 px-5 py-3 min-w-72 rounded-sm">
				<div className="flex justify-between">
					<span className="text-gray-700 whitespace-nowrap">Total Investment:</span>
					<span className="font-semibold whitespace-nowrap py-1 px-2">{Utils.formatDisplayNumber(totalData.totalInvestment)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-gray-700 whitespace-nowrap">Current Value:</span>
					<span className="font-semibold whitespace-nowrap py-1 px-2">{Utils.formatDisplayNumber(totalData.currentValue)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-gray-700 whitespace-nowrap">Profit/Loss:</span>

					{totalData.profitLoss >= 0 && <div className={`flex flex-row space-x-2 font-semibold whitespace-nowrap bg-green-200 text-green-600 py-1 px-2 rounded-md items-center`}>
						<FaArrowUp />
						<span>{Utils.formatDisplayNumber(totalData?.profitLoss)}</span>
					</div>}
					{totalData.profitLoss < 0 && <div className={`flex flex-row space-x-2 font-semibold whitespace-nowrap bg-red-200 text-red-600 py-1 px-2 rounded-md items-center`}>
						<FaArrowDown />
						<span>{Utils.formatDisplayNumber(totalData?.profitLoss)}</span></div>}
				</div>
			</div>

			<div className="w-full overflow-x-auto hidden md:block"> {/* Container for handling horizontal scroll */}
				<table className="min-w-full bg-white"> {/* Ensure table takes up at least the full width */}
					<thead>
						<tr>
							<th className="py-2 px-4 border-b text-start">Symbol</th>
							<th className="py-2 px-4 border-b text-start">Name</th>
							<th className="py-2 px-4 border-b text-end">Investment Value</th>
							<th className="py-2 px-4 border-b text-end">Current Value</th>
							<th className="py-2 px-4 border-b text-end">Profit/Loss</th>
							<th className="py-2 px-4 border-b text-end">#</th>
						</tr>
					</thead>
					<tbody>
						{list.map((investment: any, index: number) => (
							<PortfolioItem data={investment} style="large" key={`item_${index}`} onSuccess={(newPortfolio: JSONObject) => handleOnUpdate(newPortfolio.investments)}/>
						))}
					</tbody>
				</table>
			</div>

			{/* <!-- Divs for smaller screens --> */}
			<div className="md:hidden">
				{list.map((investment: any, index: number) => (
					<PortfolioItem data={investment} style="small" key={`item_${index}`} onSuccess={(newPortfolio: JSONObject) => handleOnUpdate(newPortfolio.investments)} />
				))}
			</div>

		</div>
	);
});

// Add a display name for better debugging
PortfolioList.displayName = 'PortfolioList';

export default PortfolioList;