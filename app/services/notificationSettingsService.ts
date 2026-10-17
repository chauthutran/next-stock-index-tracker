import { randomBytes } from "node:crypto";
import { updateDataList, readFileData } from "./fileService";
import { TNotification, TNotificationSettings } from "../../types/models";

const fileName = "notificationsettings.json";

export const getNotificationSettings = async (userId: string | null) => {
  if (!userId) return null;

  const settings = await readFileData<TNotificationSettings>(fileName);
  return settings.find((item) => item.userId === userId) ?? null;
};

export const saveNotificationSettings = async (
  userId: string,
  notifications: TNotification[],
) =>
  updateDataList<TNotificationSettings, TNotificationSettings>(
    fileName,
    (settings) => {
      let userSettings = settings.find((item) => item.userId === userId);

      if (!userSettings) {
        userSettings = {
          _id: randomBytes(12).toString("hex"),
          userId,
          notifications,
        };
        settings.push(userSettings);
      } else {
        userSettings.notifications = notifications;
      }

      return userSettings;
    },
  );

export const addNotificationSetting = async (
  userId: string,
  notification: TNotification,
) =>
  updateDataList<TNotificationSettings, TNotificationSettings>(
    fileName,
    (settings) => {
      let userSettings = settings.find((item) => item.userId === userId);

      if (!userSettings) {
        userSettings = {
          _id: randomBytes(12).toString("hex"),
          userId,
          notifications: [],
        };
        settings.push(userSettings);
      }

      userSettings.notifications.push(notification);
      return userSettings;
    },
  );

export const removeNotificationSetting = async (
  userId: string | null,
  symbol: string | null,
) =>
  updateDataList<TNotificationSettings, TNotificationSettings>(
    fileName,
    (settings) => {
      const userSettings = settings.find(
        (item) => item.userId === userId,
      );
      if (!userSettings || !symbol || !userSettings.notifications.some(
        (item) => item.symbol === symbol,
      )) {
        throw new Error("notifications not found");
      }

      userSettings.notifications = userSettings.notifications.filter(
        (item) => item.symbol !== symbol,
      );
      return userSettings;
    },
  );
