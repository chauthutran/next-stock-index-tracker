import mongoose from "mongoose";

const NotificationSettingSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	notifications: [
		{
			symbol: { type: String, required: true },
			threshold: { type: Number, required: true }, // The price at which to trigger the alert
			direction: { type: String, required: true }, // Whether the alert is for when the price goes above or below the threshold
			hasNewNotification: { default: false, type: Boolean, required: true }
		},
		{
			timestamps: true,
		}
	],
});

const NotificationSetting = mongoose.models.NotificationSetting || mongoose.model('NotificationSetting', NotificationSettingSchema);

export default NotificationSetting;
