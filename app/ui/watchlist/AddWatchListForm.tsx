import { JSONObject } from "@/lib/definations";
import SearchStock from "../stock-index-list/SearchStock";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import DropdownInput from "../basics/DropdownInput";
import { IoClose } from "react-icons/io5";


export default function AddWatchListForm({ handleOnClose }: { handleOnClose: () => void }) {

    const { user, setUser } = useAuth();
    const [groupName, setGroupName] = useState("");
    const [selectedSymbol, setSelectedSymbol] = useState<JSONObject | null>(null);
    const [error, setError] = useState("");

    const addStockToWatchlist = async () => {
        
        if (groupName !== "" && selectedSymbol !== null) {
            const newStock = { symbol: selectedSymbol.symbol, name: selectedSymbol.shortname, addedAt: new Date() };
            const payload = { action: "add", userId: user!._id, groupName: groupName, stock: newStock }

            const response = await fetch("api/watchlist", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                setError("Network response was not ok");
            }
            else {
                const newUser = await response.json();
                setUser(newUser);
                alert("Add successfully !");
            }
        }
    };

    const groupNameList = user!.watchlist.map((item: JSONObject) => item.groupName);

    return (
        <div className="flex flex-col space-y-3 bg-white rounded-lg pb-5 w-2/3 h-fit">
            <h2 className="px-5 py-3 text-xl border-b rounded-t-lg border-b-gray-400 bg-navy-blue bg-opacity-70 text-gray-200 items-center justify-center flex flex-grow">
                Add New Watchlist

                <div className="flex-grow"></div>
                <IoClose className="cursor-pointer" size={28} onClick={() => handleOnClose()} />
            </h2>

            <div className="grid grid-cols-[auto,1fr] gap-2 p-3 items-center">
                <div>Group Name</div>
                <div className="flex flex-row space-x-3 items-center w-full ml-1">
                    <DropdownInput
                        suggestions={groupNameList}
                        onChange={(name) => setGroupName(name)}
                        onSelect={(name) => setGroupName(name)} />
                </div>
                {/* Error message for group name */}
                {groupName == "" && <>
                    <div></div>
                    <div className="text-red-500 italic text-sm">* This field is required</div>
                </>}

                <div>Search a Stock</div>
                <div><SearchStock handleOnItemSelect={(item) => setSelectedSymbol(item)} /></div>
                {/* Error message for stock */}
                {selectedSymbol == null && <>
                    <div></div>
                    <div className="text-red-500 italic text-sm">* This field is required</div>
                </>}

                <div></div>
                <div className="flex">
                    <button className="bg-pastel-blue p-3 rounded-lg m-3 w-full" onClick={() => addStockToWatchlist()}>Add</button>
                    <button className="bg-silver p-3 rounded-lg m-3 w-full" onClick={() => handleOnClose()}>Cancel</button>
                </div>
            </div>

        </div>
    )
}
