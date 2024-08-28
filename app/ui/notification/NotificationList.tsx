// components/Notification.tsx
import { forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { JSONObject } from '@/lib/definations';
import * as Utils from "@/lib/utils";
import useNotifications from '@/lib/hooks/useNotifications';
import Loading from '../layout/Loading';

// Define the type for the ref object
interface NotificationListHandles {
	handleOnUpdate: (newNotification: JSONObject[]) => void;
  }

const NotificationList = forwardRef<NotificationListHandles>((props, ref) => {

	const { user } = useAuth();
	const { notificationList: list, isLoading } = useNotifications(user!._id);
 
	if (isLoading) return <Loading />

	return (
		<div className="flex flex-col">
			{list.map((notification: JSONObject, index: number) => (
				<section key={`notification_${index}`} className="bg-white p-6 rounded-lg shadow-md mb-6">
					<h1 className="text-xl font-bold text-navy-blue">{Utils.formatDisplayDateTime(notification.createdDate)}</h1>
					<p className="text-gray-700 mt-4">{notification.message}</p>
				</section>
			))}
		</div>
	);
});

// Add a display name for better debugging
NotificationList.displayName = 'NotificationList';

export default NotificationList;