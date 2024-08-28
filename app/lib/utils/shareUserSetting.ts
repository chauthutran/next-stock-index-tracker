import { JSONObject } from '@/lib/definations';
import axios from "axios";
import NotificationSetting from "../schemas/NotificationSettingSchema";
import * as Utils from "@/lib/utils";

/**
 * Shares notification settings from one user to another.
 *
 * @param fromUserId - The ID of the user whose settings will be shared.
 * @param toUserId - The ID of the user who will receive the shared settings.
 * @returns The newly created notification settings for the target user or an error message.
 */
export const shareNotificationSettings = async( fromUserId: string, toUserId: string ): Promise<JSONObject> => {
  try {
    const fromUser_NotificationSettingList = await getNotificationSettingList(fromUserId);
    const toUser_NotificationSettingList = await getNotificationSettingList(toUserId);
    
    for( var i=0; i<fromUser_NotificationSettingList.length; i++ ) {
        const setting = fromUser_NotificationSettingList[i];
        const found = Utils.findItemFromList(toUser_NotificationSettingList, setting.symbol, "symbol");
        if( found === null ) {
            toUser_NotificationSettingList.push(setting);
        }
    }

    const updatedSettings = await saveNotificationSettingList(toUserId, toUser_NotificationSettingList);

    return updatedSettings;
    
  } catch (error) {
    console.error("Error sharing notification settings:", error);
    return { error: "Failed to share notification settings." };
  }
}


export const updateAllowToShareSetting = async(userId: string, allowToShare: boolean): Promise<JSONObject> => {
    try {
        const response = await axios.post('/api/auth', {
            userId: userId,
            allowToShareSettings: allowToShare,
            actionType: "allowToShare"
        });
        
        return response.data;
    }
    catch( err) {
        console.log( "Error while fetching stock data. Error: " + Utils.getErrMessage(err) );
        return [];
    }
}


const getNotificationSettingList = async(userId: string): Promise<JSONObject[]> => {
    try {
        var response = await axios.get(`/api/notification-settings?userId=${userId}`);
		if (response.statusText !== "OK") {
			console.log( "Error while fetching stock data." );
            return [];
		}
        
        return response.data.notifications;
    }
    catch( err) {
        console.log( "Error while fetching stock data. Error: " + Utils.getErrMessage(err) );
        return [];
    }
    
}

const saveNotificationSettingList = async(userId: string, notificationList: JSONObject[]): Promise<JSONObject[]> => {
    try {
        const response = await axios.post('/api/notification-settings', {
            userId: userId,
            notifications: notificationList
        });
console.log(response);
        return response.data.notifications;
    }
    catch( err) {
        console.log( "Error while fetching stock data. Error: " + Utils.getErrMessage(err) );
        return [];
    }
    
}

// const getWatchingSettingList = async(userId: string): Promise<JSONObject[]> => {
//     try {
//         var response = await axios.get(`/api/watchlist?userId=${userId}`);
// 		console.log(response);
// 		let errMsg = "";
// 		if (response.statusText !== "OK") {
// 			console.log( "Error while fetching stock data." );
//             return [];
// 		}
        
//         return response.data.notifications;
//     }
//     catch( err) {
//         console.log( "Error while fetching stock data. Error: " + Utils.getErrMessage(err) );
//         return [];
//     }
    
// }