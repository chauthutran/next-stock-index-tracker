import { useState } from "react"
import { FaCodeCompare } from "react-icons/fa6";


export default function CountryList({selectedItem, onSelectedItem, onCompareMarkets}: {selectedItem: string, onSelectedItem: (countryCode: string) => void, onCompareMarkets: (countryCode: string) => void }) {

    const [selected, setSelected] = useState(selectedItem);

    const handleSelectedItem = (code: string) => {
        setSelected(code);
        onSelectedItem(code);
    }

    return (
        <div>
            <div className="flex flex-row font-semibold space-x-3 cursor-pointer">
                <div 
                    onClick={() => onCompareMarkets(selected)}
                    className="text-gray-400 p-2 rounded-xl flex space-x-2 font-normal">
                    <FaCodeCompare />
                    <div>Compare Markets</div></div>
                <div
                    onClick={()=> handleSelectedItem("US")} 
                    className={`${selected == "US" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"} p-2 rounded-xl`}>US</div>
                <div 
                    onClick={()=> handleSelectedItem("EU")} 
                    className={`${selected == "EU" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"} p-2 rounded-xl cursor-pointer`}>Europe</div>
                <div 
                    onClick={()=> handleSelectedItem("AS")} 
                    className={`${selected == "AS" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"} p-2 rounded-xl cursor-pointer`}>Asia</div>
            </div>

        </div>
    )
}