'use client';

import Navigation from './layout/Navigation';
import * as Constant from "@/lib/constant";
import { useMainUi } from '@/contexts/MainUiContext';
import StockIndexDetails from './stock-index-data/StockIndexDetails';
import HomePage from './HomePage';
import * as AppStore from "@/lib/AppStore";
import CompareStocksPage from './compare-stock-indexes-chart/CompareStockPage';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import WatchListPage from './watchlist/WatchListPage';
import StockTrending from './trending/StockTrending';
import PortfolioPage from './portfolio/PortfolioPage';
import NotificationSettingPage from './notificationSetting/NotificationSettingPage';
import NotificationPage from './notification/NotificationPage';
import UserSettingPage from './userSetting/UserSettingPage';


export default function AppWrapper() {

	const {mainPage} = useMainUi();
	
	return (
		<div className="text-textPrimary">
		
			{ mainPage == Constant.UI_PAGE_HOME && <HomePage />}
			{ mainPage == Constant.UI_SYMBOL_DETAILS && <StockIndexDetails curPriceData={AppStore.getSelectedSymbolData()} />}
			{ mainPage == Constant.UI_PAGE_TRENDING && <StockTrending />}
			{ mainPage == Constant.UI_PAGE_COMPARE_STOCK_INDEXES_CHARTS && <CompareStocksPage />}
			{ mainPage == Constant.UI_PAGE_NOTIFICATION_PAGE && <NotificationPage />}

			{ mainPage == Constant.UI_PAGE_WATCH_LIST && <WatchListPage />}
			{ mainPage == Constant.UI_PAGE_PORTFOLIO && <PortfolioPage />}
			{ mainPage == Constant.UI_PAGE_NOTIFICATION_SETTING_PAGE && <NotificationSettingPage />}
			{ mainPage == Constant.UI_PAGE_USER_SETTING_PAGE && <UserSettingPage />}

			
			{ mainPage == Constant.UI_PAGE_LOGIN && <LoginForm />}
			{ mainPage == Constant.UI_PAGE_AUTH_REGISTRATION && <RegisterForm />}
		</div>
	);
};