import { JSONObject } from "@/lib/definations";
import { useEffect, useState } from "react"
import { FiPlus } from "react-icons/fi";
import { IoCloseCircleOutline } from "react-icons/io5";
import * as Utils from "@/lib/utils";
import StockSearchForm from "./StockSearchForm";
import Modal from "../layout/Modal";


export default function StockAddItem({ handleOnAddItem}: {handleOnAddItem: (data: JSONObject) => void}) {
    const [showDialog, setShowDialog] = useState(false);

    const handleOnAddStock = () => {
        setShowDialog(true);
    }

    const addItem = async(data: JSONObject) => {
        handleOnAddItem(data);
    }

    return (
        <>
            <div className="flex flex-col items-center w-[150px] h-[60px]">
               <div className="flex items-center flex-row bg-[#edf2f7] rounded-xl border border-slate-300 p-5 space-x-3 w-full h-full justify-center" onClick={(e) => handleOnAddStock()}>
                    <FiPlus /> <span>Add Stock</span>
                </div>
            </div>

            <Modal isVisible={showDialog} onClose={() => {}}><StockSearchForm handleOnItemSelect={(data) => addItem(data)} handleOnClose={() => setShowDialog(false)} /> </Modal>
        </>
    )
}
