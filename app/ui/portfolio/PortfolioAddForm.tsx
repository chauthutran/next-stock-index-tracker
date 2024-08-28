import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { JSONObject } from '@/lib/definations';
import { IoClose } from "react-icons/io5";
import SearchStock from '../stock-index-list/SearchStock';


interface Investment {
	stockSymbol: string;
	quantity: number;
	purchasePrice: number;
}

interface UpdatePortfolioFormProps {
	existingInvestment?: Investment;
	onSuccess?: (portfolio: JSONObject) => void; // Callback to refresh the portfolio or show a success message
	handleOnClose: () => void;
}

const PortfolioAddForm: React.FC<UpdatePortfolioFormProps> = ({ existingInvestment, onSuccess, handleOnClose }) => {
	const { user } = useAuth();
	const [stockSymbol, setStockSymbol] = useState(existingInvestment?.stockSymbol || '');
	const [quantity, setQuantity] = useState(existingInvestment?.quantity || 0);
	const [purchasePrice, setPurchasePrice] = useState(existingInvestment?.purchasePrice || 0);
	const [error, setError] = useState<string | null>(null);

	const handleSaveBtnClick = async(e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!stockSymbol || quantity <= 0 || purchasePrice <= 0) {
			setError('Please provide valid inputs.');
			return;
		}
		try {
			const response = await axios.post('/api/portfolio', {
				userId: user!._id,
				investment: { symbol: stockSymbol, quantity, purchasePrice },
			});

			if (onSuccess) onSuccess(response.data);

			// Clear form after submission
			setStockSymbol('');
			setQuantity(0);
			setPurchasePrice(0);
			setError(null);
		} catch (error) {
			setError('Failed to update the portfolio.');
		}
	};

	useEffect(() => {
		if (existingInvestment) {
			setStockSymbol(existingInvestment.stockSymbol);
			setQuantity(existingInvestment.quantity);
			setPurchasePrice(existingInvestment.purchasePrice);
		}
	}, [existingInvestment]);

	return (
		<div className="flex flex-col space-y-3 bg-white rounded-lg pb-5 w-2/3 h-fit">
            <h2 className="px-5 py-3 text-xl border-b rounded-t-lg border-b-gray-400 bg-navy-blue bg-opacity-70 text-gray-200 items-center justify-center flex flex-grow">
                Add New Watchlist

                <div className="flex-grow"></div>
                <IoClose className="cursor-pointer" size={28} onClick={() => handleOnClose()} />
            </h2>

			{/* <form onSubmit={handleSubmit} className="space-y-4"> */}
			<div className="grid grid-cols-[auto,1fr] gap-2 p-3 items-center">
				<div>Stock Symbol</div>
				<div><SearchStock handleOnItemSelect={(item) => setStockSymbol(item.symbol)} /></div>

					
				<div>Quantity</div>
				<input
					type="number"
					value={quantity}
					onChange={(e) => setQuantity(Number(e.target.value))}
					placeholder="10"
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
				/>
				
				<div>Purchase Price</div>
				<input
					type="number"
					step="0.01"
					value={purchasePrice}
					onChange={(e) => setPurchasePrice(Number(e.target.value))}
					placeholder="150.00"
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
				/>
				{error && <p className="text-red-600">{error}</p>}

				
                <div></div>
                <div className="flex">
                    <button className="bg-pastel-blue p-3 rounded-lg m-3 w-full" onClick={(e) => handleSaveBtnClick(e)}>{existingInvestment ? 'Update Investment' : 'Add Investment'}</button>
                    <button className="bg-silver p-3 rounded-lg m-3 w-full" onClick={() => handleOnClose()}>Cancel</button>
                </div>
               
			</div>
		</div>
	);
};

export default PortfolioAddForm;
