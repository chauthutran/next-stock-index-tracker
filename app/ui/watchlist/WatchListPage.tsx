'use client';

import React, { useState } from 'react';
import WatchList from './WatchList';
import AddWatchListForm from './AddWatchListForm';
import { FiPlus } from "react-icons/fi";
import { Model } from 'mongoose';
import Modal from '../layout/Modal';


const WatchListPage: React.FC = () => {

	const [showAddWatchListForm, setShowAddWatchListForm] = useState(false);

	return (
		<div className="m-3">
			<h2 className="font-semibold text-2xl mb-3">
				<span className="text-navy-blue">Your Watchlist</span>
				<button className="ml-3 text-lg p-2 shadow-lg bg-pastel-blue hover:bg-turquoise focus:ring-2 focus:ring-turquoise text-navy-blue hover:bg-red-500 rounded-full" onClick={() => setShowAddWatchListForm(true)}>
					<FiPlus />
				</button>
			</h2>

			<div className='w-full flex flex-row'>
				<WatchList />
			</div>
			
			<Modal isVisible={showAddWatchListForm} onClose={() => setShowAddWatchListForm(false)}><AddWatchListForm handleOnClose={() => setShowAddWatchListForm(false)} /></Modal>
		</div>
	);
};

export default WatchListPage;