import React, { useState } from 'react';

interface ToggleButtonProps {
    initialChecked?: boolean;
    onChange?: (checked: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ initialChecked = false, onChange }) => {
    const [checked, setChecked] = useState(initialChecked);

    const handleChange = () => {
        const newChecked = !checked;
        setChecked(newChecked);
        if (onChange) {
            onChange(newChecked);
        }
    };
console.log("checked: " + checked);
    return (
        <div className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                id="toggle"
                checked={checked}
                onChange={handleChange}
                className="sr-only"
            />
            <div
                onClick={handleChange}
                className={`w-12 h-6 rounded-full ${checked ? 'bg-blue-500' : 'bg-gray-200'} transition-colors duration-300 ease-in-out`}
            >
                <div
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ease-in-out ${checked ? 'translate-x-6' : ''}`}
                />
            </div>
        </div>
    );
};

export default ToggleButton;
