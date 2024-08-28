// components/Notification.tsx
import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { FiPlus } from 'react-icons/fi';
import { JSONObject } from '@/lib/definations';
import * as Utils from "@/lib/utils";
import { useQuery } from 'react-query';
import NotificationSettingList from './NotificationList';
import Modal from '../layout/Modal';


export default function NotificationPage() {

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
				<span className="text-navy-blue">Your Notifications</span>
			</h2>
			<div className="p-2">
				<NotificationSettingList ref={notificationListRef} />
			</div>
		</div>
	);
};