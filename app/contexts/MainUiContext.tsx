"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as Constant from "@/lib/constant";


interface MainUiContextProps {
	mainPage: string;
	setMainPage: (pageName: string) => void;
}

const MainUiContext = createContext<MainUiContextProps>({
	mainPage: Constant.UI_PAGE_HOME,
	setMainPage: (pageName: String) => {}
});

export const useMainUi = (): MainUiContextProps => {
	const context = useContext(MainUiContext);
	if (!context) {
	  throw new Error('useMainUi must be used within an MainUiProvider');
	}
	return context;
};

export const MainUiProvider = ({ children }: { children: ReactNode }) => {
	const [mainPage, setMainPage] = useState<string>(Constant.UI_PAGE_HOME);

	return (
		<MainUiContext.Provider value={{ mainPage, setMainPage }}>
			{children}
		</MainUiContext.Provider>
	);
};
