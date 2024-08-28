import mongoose from "mongoose";


const PortfolioSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	investments: [
		{
			symbol: { type: String, required: true },
			quantity: { type: Number, required: true },
			purchasePrice: { type: Number, required: true },
		},
		{
			timestamps: true,
		}
	],
});

const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);

export default Portfolio;
