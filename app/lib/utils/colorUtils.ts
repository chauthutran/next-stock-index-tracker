export const COLORS_LIST = [
	'#FF5733', '#28A745', '#007BFF',
	'#6F42C1', '#FD7E14', '#FFC107',
	'#20C997', '#E83E8C'
];

/**
* Generates a random color based on a seed number.
* If no seed is provided, it generates a completely random color.
* @param {number} [seed] - The optional seed number for color generation.
* @returns {string} A color in hexadecimal format.
*/
export const generateColor = (seed?: number): string => {
	if (seed !== undefined) {
		return getSeededHexColor(seed);
	} else {
		return getRandomHexColor();
	}
}

/**
 * Generates a random hexadecimal color based on a seed number.
 * @param {number} seed - The seed number for color generation.
 * @returns {string} A color in hexadecimal format based on the seed.
 */
export const getSeededHexColor = (seed: number): string => {
	// Simple hash function
	const hash = seed % 16777215; // 16777215 is FFFFFF in hexadecimal
	const hex = hash.toString(16).padStart(6, '0');
	return `#${hex}`;
}


/**
* Generates a random hexadecimal color.
* @returns {string} A random color in hexadecimal format.
*/
export const getRandomHexColor = (): string => {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}