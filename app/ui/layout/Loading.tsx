// components/Loading.tsx
import React from 'react';

// Define the props type if needed
type LoadingProps = {
	size?: 'small' | 'medium' | 'large';
	color?: string;
};

const Loading: React.FC<LoadingProps> = ({ size = 'medium', color = 'blue-500' }) => {
	const sizeClass = {
		small: 'w-4 h-4',
		medium: 'w-8 h-8',
		large: 'w-12 h-12'
	}[size];

	return (
		<div className="flex justify-center items-center h-screen">
			<div
				className={`border-t-4 border-solid border-${color} ${sizeClass} border-gray-300 rounded-full animate-spin`}
			></div>
		</div>
	);
};

export default Loading;
