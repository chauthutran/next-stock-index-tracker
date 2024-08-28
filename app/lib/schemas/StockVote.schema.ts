"use server";

import mongoose, { Schema } from "mongoose";


const StockVoteSchema = new Schema(
	{
		symbol: { type: String, required: true, unique: true },
		votes: {
            "upvotes": {
                count:{type: Number, required: false, default: 0},
                userIds:[{type: String, required: true}] // User id list here
            },
            "downvotes":{
                count:{type: Number, required: false, default: 0},
                userIds:[{type: String, required: true}] // User id list here
            }
         },
	},
	{
		timestamps: true,
	}
)
const StockVote = mongoose.models.StockVote || mongoose.model('StockVote', StockVoteSchema);

export default StockVote;