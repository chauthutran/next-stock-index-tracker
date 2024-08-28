"use server";

import mongoose, { Schema } from "mongoose";



const StockSchema: Schema = new Schema({
	symbol: { type: String, required: true },
	name: { type: String, required: true },
	addedAt: { type: Date, default: Date.now }
});

const WatchlistGroupSchema: Schema = new Schema({
	groupName: { type: String, required: true },
	stocks: [StockSchema]
});


const UserSchema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		allowToShareSettings: {type: Boolean, required: true, default: false},
		watchlist: [WatchlistGroupSchema]
	},
	{
		timestamps: true,
	}
)
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;