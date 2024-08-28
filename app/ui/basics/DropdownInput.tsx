import React, { useState, useEffect } from 'react';

interface DropdownInputProps {
	suggestions: string[]; // Array of suggestions for the dropdown
	onSelect: (selectedItem: string) => void; // Callback function when an item is selected
	onChange: ( value: string) => void;
}

const DropdownInput: React.FC<DropdownInputProps> = ({ suggestions, onSelect, onChange }) => {
	const [inputValue, setInputValue] = useState('');
	const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
	const [showDropdown, setShowDropdown] = useState(false);

	useEffect(() => {
		if (inputValue) {
			setFilteredSuggestions(
				suggestions.filter(suggestion =>
					suggestion.toLowerCase().includes(inputValue.toLowerCase())
				)
			);
		} else {
			setFilteredSuggestions([]);
		}
	}, [inputValue, suggestions]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setInputValue(value);
		setShowDropdown(true);
		onChange(value)
	};

	const handleSuggestionClick = (suggestion: string) => {
		setInputValue(suggestion);
		setShowDropdown(false);
		onSelect(suggestion);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (!(event.target as HTMLElement).closest('.dropdown-container')) {
			setShowDropdown(false);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	return (
		<div className="relative dropdown-container w-full justify-center">
			<input
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				className="p-3 border border-gray-300 rounded-md w-full"
				placeholder="Enter text..."
			/>

			{showDropdown && filteredSuggestions.length > 0 && (
				<ul className="absolute top-full left-0 mt-1 w-full border border-gray-300 bg-white rounded shadow-lg z-10">
					{filteredSuggestions.map((suggestion, index) => (
						<li
							key={index}
							onClick={() => handleSuggestionClick(suggestion)}
							className="p-2 cursor-pointer hover:bg-gray-200"
						>
							{suggestion}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default DropdownInput;
