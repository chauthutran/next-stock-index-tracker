"use client";

import { JSONObject } from '@/lib/definations';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as Utils from "@/lib/utils";


interface StockVoteContextProps {
	stockVoteList: JSONObject[] | null;
	saveStockVote: (user: JSONObject) => Promise<void>;
	error: string | null;
	loading: boolean;
}

const StockVoteContext = createContext<StockVoteContextProps>({
	stockVoteList: null,
	saveStockVote: async(payload: JSONObject) => {},
	error: null,
	loading: false
});

export const useStockVote = (): StockVoteContextProps => {
	const context = useContext(StockVoteContext);
	if (!context) {
	  throw new Error('useStockVote must be used within an StockVoteProvider');
	}
	return context;
};

export const StockVoteProvider = ({ children }: { children: ReactNode }) => {
	const [stockVoteList, setStockVoteList] = useState<JSONObject[] | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchStockVoteList = async () => {
        setError(null);
		try {
			const response = await fetch(`api/stock-vote`);
            if (!response.ok) {
                setError("Network response was not ok");
            }
            else {
                const list = await response.json();
				setStockVoteList(list);
            }

		} catch (err) {
			setError(Utils.getErrMessage(err));
		}
	};


    useEffect(() => {
        if( stockVoteList === null ) {
            fetchStockVoteList();
        }
    }, []);

	const saveStockVote = async(payload: JSONObject) => {
		setError(null);

        try {
            const response = await fetch("api/stock-vote", {
                method: "POST",
                headers: {
                    "Content-type": "appliction/json"
                },
                body: JSON.stringify(payload)
            })

            if( !response.ok ){
                setError("Network response was not ok");
            }
            else {
                var newStockVote = await response.json();
                let tempList = Utils.cloneJSONObject(stockVoteList!);
               
                // Update list
                let foundExpense = Utils.findItemFromList(tempList!, newStockVote._id, "_id");
                if( foundExpense == null ) { // Add case
                    tempList!.push( newStockVote );
                }
                else { // Update case
                    Utils.findAndReplaceItemFromList(tempList!, newStockVote._id, "_id", newStockVote);
                }

                setStockVoteList( tempList );
            }
        }
        catch( err ) {
            setError(Utils.getErrMessage(err));
        }
	}

	return (
		<StockVoteContext.Provider value={{ stockVoteList, saveStockVote, loading, error }}>
			{children}
		</StockVoteContext.Provider>
	);
};
