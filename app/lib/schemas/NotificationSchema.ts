import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
	  userId: { type: String, required: true },
    notificationSettingId: { type: String, required: true },
    message: { type: String, required: true },
    newMessage: { type: Boolean, required: true, default: true },
    createdDate: { type: Date, required: true }
  },
  {
    timestamps: true,
  }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);

export default Notification;
