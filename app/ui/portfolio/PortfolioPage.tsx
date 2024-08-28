// components/Portfolio.tsx
import { useState, useEffect, useRef } from 'react';
import { FiPlus } from 'react-icons/fi';
import PortfolioAddForm from './PortfolioAddForm';
import { JSONObject } from '@/lib/definations';
import PortfolioList from './PortfolioList';
import Modal from '../layout/Modal';


export default function PortfolioPage() {

	const listRef = useRef<any>(null);
	const [showAddForm, setShowAddForm] = useState(false);
	
	const onUpdateList = (newPortfolio: JSONObject) => {
		if (listRef.current) {
			listRef.current.handleOnUpdate(newPortfolio.investments);
		}
	}

	return (
		<div className="m-3">
				<h2 className="text-2xl font-semibold mb-3">
				<span className="text-navy-blue">Your Portfolio</span>
				<button className="ml-3 text-lg p-2 shadow-lg bg-pastel-blue hover:bg-turquoise focus:ring-2 focus:ring-turquoise text-navy-blue rounded-full" onClick={() => setShowAddForm(true)} >
					<FiPlus />
				</button>
			</h2>
			<div className="p-2">
				<PortfolioList ref={listRef} />
			</div>

			<Modal isVisible={showAddForm} onClose={() => setShowAddForm(false)}>
				<PortfolioAddForm handleOnClose={() => setShowAddForm(false)} onSuccess={(newPortfolio) => onUpdateList(newPortfolio) } />
			</Modal>
		</div>
	);
};