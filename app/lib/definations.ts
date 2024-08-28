
export type JSONObject = { [key: string]: any };


export interface Option {
	value: string;
	label: string;
}

export interface EditableDropdownProps {
	options: Option[];
	onChange: (selected: Option) => void;
	onAdd: (newOption: Option) => void;
}
