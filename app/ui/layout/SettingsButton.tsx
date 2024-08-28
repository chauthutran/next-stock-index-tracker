import { JSONObject } from '@/lib/definations';
import React, { useEffect, useRef, useState } from 'react';
import { RiUserSettingsFill } from "react-icons/ri";
import { BiSolidPurchaseTag } from "react-icons/bi";
import * as Constant from "@/lib/constant";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdNotificationAdd } from "react-icons/md";
import { IoLogOutSharp } from "react-icons/io5";
import { RiStockFill } from "react-icons/ri";
import { IoMdHome } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";


export default function SettingsButton({ handleItemClick }: { handleItemClick: (pageName: string) => void }) {
	// State to manage dropdown visibility
	const [isOpen, setIsOpen] = useState(false);
	const divRef = useRef<HTMLDivElement>(null);

	// Toggle the dropdown visibility
	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (divRef.current && !divRef.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const renderUserRelatedMenus = () => {
		return (
			<>
				<li className="py-4 hover:text-gold flex space-x-2 items-center cursor-pointer" onClick={() => handleItemClick(Constant.UI_PAGE_WATCH_LIST)} >
					<BiSolidPurchaseTag size={22} />
					<span>Watchlist</span>
				</li>
				<li className="py-4 hover:text-gold flex space-x-2 items-center cursor-pointer" onClick={() => handleItemClick(Constant.UI_PAGE_PORTFOLIO)} >
					<RiStockFill size={22} />
					<span>Portfolio</span>
				</li>
				<li className="py-4 hover:text-gold flex space-x-2 items-center cursor-pointer" onClick={() => handleItemClick(Constant.UI_PAGE_NOTIFICATION_SETTING_PAGE)} >
					<MdNotificationAdd size={22} />
					<span>Notification</span>
				</li>
				<li className="py-4 hover:text-gold flex space-x-2 items-center cursor-pointer" onClick={() => handleItemClick(Constant.UI_PAGE_USER_SETTING_PAGE)} >
					<IoMdSettings size={22} />
					<span>User Settings</span>
				</li>

				<li className="my-3 border-b border-gray-600 "></li>
				<li className=" text-red-600 hover:text-red-400 py-2 flex space-x-2 items-center cursor-pointer font-bold" onClick={() => handleItemClick("logout")} >
					<IoLogOutSharp size={22} />
					<span>Log-out</span>
				</li>
			</>
		)
	}

	return (
		<>
			{/* For the large size */}
			<div className="relative text-left hidden lg:flex">
				<button
					onClick={toggleDropdown}
					className="p-1 bg-gold text-black rounded-full hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
				>
					<RiUserSettingsFill size={20} />
				</button>

				{/* Dropdown menu */}
				{isOpen && (
					<div ref={divRef} className="absolute right-0 mt-2 w-48 bg-white border-2 border-gray-300 rounded-md shadow-lg">
						<ul className="py-1 text-navy-blue px-4">
							{renderUserRelatedMenus()}
						</ul>
					</div>
				)}
			</div>

			{/* For the medium or small size */}
			<div className="lg:hidden text-white">
				<li className="my-3 border-b border-gray-600 "></li>
				{renderUserRelatedMenus()}
			</div>
		</>

	);
};