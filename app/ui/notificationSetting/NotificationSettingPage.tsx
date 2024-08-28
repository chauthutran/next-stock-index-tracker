// components/Notification.tsx
import { useState, useEffect, useRef, useTransition } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { FiPlus } from 'react-icons/fi';
import { JSONObject } from '@/lib/definations';
import * as Utils from "@/lib/utils";
import { useQuery } from 'react-query';
import NotificationSettingList from './NotificationSettingList';
import NotificationSettingAddForm from './NotificationSettingAddForm';
import Modal from '../layout/Modal';
import { BsShareFill } from "react-icons/bs";
import { RiUserShared2Fill } from "react-icons/ri";
import { updateAllowToShareSetting } from '@/lib/utils/shareUserSetting';


export default function NotificationSettingPage() {

	const notificationListRef = useRef<any>(null);
	const [showAddForm, setShowAddForm] = useState(false);
	
	const onUpdateList = (newNotification: JSONObject) => {
		if (notificationListRef.current) {
			notificationListRef.current.handleOnUpdate(newNotification.notifications);
		}
	}

	return (
		<div className="m-3">
				<h2 className="text-2xl font-semibold mb-3">
				<span className="text-navy-blue">Notification Settings</span>
				<button className="ml-3 text-lg p-2 shadow-lg bg-pastel-blue hover:bg-turquoise focus:ring-2 focus:ring-turquoise text-navy-blue rounded-full" onClick={() => setShowAddForm(true)} >
					<FiPlus /> 
				</button>
			</h2>
			<div className="p-2">
				<NotificationSettingList ref={notificationListRef} />
			</div>

			<Modal isVisible={showAddForm} onClose={() => setShowAddForm(false)}>
				<NotificationSettingAddForm onSuccess={(newNotification) => onUpdateList(newNotification) } handleOnClose={() => setShowAddForm(false)} />
			</Modal>
		</div>
	);
};