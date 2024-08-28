import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { JSONObject } from '@/lib/definations';
import { IoClose } from 'react-icons/io5';
import SearchStock from '../stock-index-list/SearchStock';

interface Notification {
	symbol: string;
	threshold: number;
	direction: string;
  }
  
  interface NotificationSettingAddFormProps {
	existingNotification?: Notification;
	onSuccess?: (notification: Notification) => void;
	handleOnClose: () => void;
  }

const NotificationSettingAddForm: React.FC<NotificationSettingAddFormProps> = ({ existingNotification, onSuccess, handleOnClose }) => {

	const { user } = useAuth();
	const [stockSymbol, setStockSymbol] = useState(existingNotification?.symbol || '');
	// const [longName, setLongName] = useState(existingNotification?.longName || '');
	const [threshold, setThreshold] = useState(existingNotification?.threshold || 0);
	const [direction, setDirection] = useState(existingNotification?.direction || 'above');

	const [error, setError] = useState<string | null>(null);

	const handleSaveBtnClick = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!stockSymbol) {
			setError('Please provide valid inputs.');
			return;
		}
		try {
			const response = await axios.post('/api/notification-settings', {
				userId: user!._id,
				notification: { symbol: stockSymbol, threshold, direction },
			});

			alert("The notification is saved !");
			if (onSuccess) onSuccess(response.data);

			// Clear form after submission
			setStockSymbol("");
			setThreshold(0);
			setDirection("above");
			setError(null);

		} catch (error) {
			setError('Failed to update the notification.');
		}
	};

	useEffect(() => {
		if (existingNotification) {
			setStockSymbol(existingNotification.symbol);
			// setLongName(existingNotification.longName);
			setThreshold(existingNotification.threshold);
			setDirection(existingNotification.direction || 'above');
		}
	}, [existingNotification]);

	return (
		<div className="flex flex-col space-y-3 bg-white rounded-lg pb-5 w-2/3 h-fit">
            
			<h2 className="px-5 py-3 text-xl border-b rounded-t-lg border-b-gray-400 bg-navy-blue bg-opacity-70 text-gray-200 items-center justify-center flex flex-grow">
                Add New Notification

                <div className="flex-grow"></div>
                <IoClose className="cursor-pointer" size={28} onClick={() => handleOnClose()} />
            </h2>

			{/* <form onSubmit={handleSubmit} className="space-y-4"> */}
			<div className="grid grid-cols-[auto,1fr] gap-2 p-3 items-center">
			
				<div>Stock Symbol <span className="text-red-500">*</span></div>
				<div><SearchStock handleOnItemSelect={(item) => setStockSymbol(item.symbol)} /></div>
				{stockSymbol === "" && 
				<><div></div><p className="italic text-sm text-red-600">* This field is required</p></>}


				<div>Threshold <span className="text-red-500">*</span></div>
				<input
					type="number"
					value={threshold}
					onChange={(e) => setThreshold(Number(e.target.value))}
					placeholder="10"
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
				/>
				{threshold === 0 && <><div></div><p className="italic text-sm text-red-600">* This field is required</p></>}

				<div>Direction <span className="text-red-500">*</span></div>
				<select
					value={direction}
					onChange={(e) => setDirection(e.target.value)}
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
				>
					<option value="above">Above</option>
					<option value="below">Below</option>
				</select>


				<div></div>
				<div className="flex">
					<button className="bg-pastel-blue p-3 rounded-lg m-3 w-full" onClick={(e) => handleSaveBtnClick(e)}>{existingNotification ? 'Update Investment' : 'Add Investment'}</button>
					<button className="bg-silver p-3 rounded-lg m-3 w-full" onClick={() => handleOnClose()}>Cancel</button>
				</div>
			</div>
		</div>
	);
};

export default NotificationSettingAddForm;