"use client";

import { JSONObject } from '@/lib/definations';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as Utils from "@/lib/utils";


interface AuthContextProps {
	user: JSONObject | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	register: (user: JSONObject) => Promise<void>;
	setUser: (user: JSONObject | null) => void,
	error: string | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
	user: null,
	login: async () => { },
	logout: () => { },
	register: async(user: JSONObject) => {},
	setUser: (user: JSONObject | null) => {},
	error: null,
	loading: false
});

export const useAuth = (): AuthContextProps => {
	const context = useContext(AuthContext);
	if (!context) {
	  throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const login = async (email: string, password: string) => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(`api/auth?actionType=login&email=${email}&password=${password}`);
            
			if (!response.ok) {
                setError("Network response was not ok");
            }
            else {
                const foundUser = await response.json();
                if (foundUser != null ) {
                    setUser(foundUser);
                }
                else {
                    setError("Username/password is wrong.");
                }
            }
		} catch (err) {
			setError(Utils.getErrMessage(err));
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
	}

	const register = async(user: JSONObject) => {
		setLoading(true);
		setError(null);

		const payload = {payload: user, actionType: "add"};
		
		try {
			const response = await fetch("api/auth", {
				method: "POST",
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify(payload)
			});

			if( !response.ok ){
				setError("Network response was not ok");
			}
			else {
				const newUser = await response.json();
				setUser(newUser);
			}
		}
		catch (err) {
			setError(Utils.getErrMessage(err));
		} finally {
			setLoading(false);
		}
	}

	return (
		<AuthContext.Provider value={{ user, setUser, loading, error: error, login, logout, register }}>
			{children}
		</AuthContext.Provider>
	);
};
