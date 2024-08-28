import { JSONObject } from "./definations";

export const SYMBOL_DEFAULT_LIST: JSONObject = {
	"US": ["^DJI", // Dow Jones
		"^GSPC", // S&P 500
		"^IXIC", // Nasdqe
		"^RUT", // Russell
		"^VIX", // Vix
	],
	"EU": ["^GDAXI", // DAX PERFORMANCE-INDEX 
		"^FTSE", // FTSE 10
		"CAC", // CAC 40
		"^IBEX", // IBEX 35
		"^STOXX", // STOXX 5p
	],
	"AS": [
		"^N225", // Nikkei 225
		"000001.SS", // SSE Composite Index
		"^HSI", // Hang Seng Index
		"^BSESN", // BSE SENSEX
		"^NSEI", // Hang Seng Index
	]
};

export const UI_PAGE_LOGIN = "UI_PAGE_LOGIN";
export const UI_PAGE_AUTH_REGISTRATION = "UI_PAGE_AUTH_REGISTRATION";
export const UI_PAGE_HOME = "UI_PAGE_HOME";
export const UI_PAGE_TRENDING = "UI_PAGE_TRENDING";
export const UI_PAGE_COMPARE_STOCK_INDEXES_CHARTS = "UI_PAGE_COMPARE_STOCK_INDEXES_CHARTS";
export const UI_PAGE_NOTIFICATION_PAGE = "UI_PAGE_NOTIFICATION_PAGE";
export const UI_PAGE_WATCH_LIST = "UI_PAGE_WATCH_LIST";
export const UI_PAGE_PORTFOLIO = "UI_PAGE_PORTFOLIO";
export const UI_PAGE_NOTIFICATION_SETTING_PAGE = "UI_PAGE_NOTIFICATION_SETTING_PAGE";
export const UI_PAGE_USER_SETTING_PAGE = "UI_PAGE_USER_SETTING_PAGE";

export const UI_SYMBOL_DETAILS = "UI_SYMBOL_DETAILS";
export const UI_CHART = "UI_CHART";
export const UI_HISTORICAL_DATA = "UI_HISTORICAL_DATA";