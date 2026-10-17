import { randomBytes } from "node:crypto";
import { TNotificationRecord } from "../../types/models";
import { readFileData, updateDataList } from "./fileService";

const fileName = "notifications.json";

export const getNotifications = async (userId: string | null) => {
  if (!userId) return [];

  const notifications = await readFileData<TNotificationRecord>(fileName);
  return notifications.filter((notification) => notification.userId === userId);
};

export const saveNotifications = async (
  userId: string,
  notifications: Partial<TNotificationRecord>[],
) => {
  if (typeof userId !== "string" || !userId || !Array.isArray(notifications)) {
    throw new Error("A user ID and notification list are required.");
  }

  const validatedNotifications = notifications.map(
    ({ notificationSettingId, message, ...notification }) => {
      if (!notificationSettingId || !message) {
        throw new Error(
          "Each notification must include a setting ID and message.",
        );
      }

      return { ...notification, notificationSettingId, message };
    },
  );

  return updateDataList<TNotificationRecord, TNotificationRecord[]>(
    fileName,
    (notificationList) => {
      const updatedNotifications = validatedNotifications.map(
        (notification) => ({
          ...notification,
          _id: notification._id ?? randomBytes(12).toString("hex"),
          userId,
          newMessage: notification.newMessage ?? true,
          createdDate: notification.createdDate ?? new Date().toISOString(),
        }),
      );

      const otherUsersNotifications = notificationList.filter(
        (notification) => notification.userId !== userId,
      );
      notificationList.splice(
        0,
        notificationList.length,
        ...otherUsersNotifications,
        ...updatedNotifications,
      );

      return updatedNotifications;
    },
  );
};

export const markNotificationAsRead = async (
  notification: Partial<TNotificationRecord> & { _id: string },
) =>
  updateDataList<TNotificationRecord, TNotificationRecord>(
    fileName,
    (notifications) => {
      const existingNotification = notifications.find(
        (item) => item._id === notification._id,
      );
      if (!existingNotification) {
        throw new Error(`The notification '${notification._id}' is not found`);
      }

      Object.assign(existingNotification, notification, { newMessage: false });
      return existingNotification;
    },
  );

export const deleteNotification = async (id: string | null) =>
  updateDataList<TNotificationRecord, TNotificationRecord>(
    fileName,
    (notifications) => {
      const index = notifications.findIndex((item) => item._id === id);
      if (index === -1) {
        throw new Error(`The notification '${id}' is not found`);
      }

      return notifications.splice(index, 1)[0];
    },
  );
