import { useAuth } from "@/contexts/AuthContext";
import { shareNotificationSettings, updateAllowToShareSetting } from "@/lib/utils/shareUserSetting";
import { BsShareFill } from "react-icons/bs";
import ToggleButton from "../basics/ToggleButton";
import { useEffect, useState, useTransition } from "react";
import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";

export default function UserSettingPage() {
    const { user, setUser } = useAuth();
    const [sharedUserList, setSharedUserList] = useState<JSONObject[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    const fetchSharedUserList = () => {
        setError(null);

        startTransition(async () => {
            try {
                const response = await fetch(`api/auth?actionType=sharedUsers`);

                if (!response.ok) {
                    setError("Network response was not ok");
                }
                else {
                    let list = await response.json();
                    list = Utils.removeFromArray(list, user!._id, "_id");
                    setSharedUserList(list);
                }
            } catch (err) {
                setError(Utils.getErrMessage(err));
            }
        });
    }

    useEffect(() => {
        fetchSharedUserList();
    }, []);

    const setAllowToShare = async (value: boolean) => {
        const newUser = await updateAllowToShareSetting(user!._id, value);
        setUser(newUser);
    }

    const shareSettings = async(fromUser: JSONObject, toUserId: string) => {
        const ok = confirm(`Are you sure you want to import settings from user '${fromUser.email}' ?` );
        if( ok ) {
            shareNotificationSettings(fromUser._id, toUserId);
        }
    }

    return (
        <div className="m-3">
            <h2 className="text-2xl font-semibold mb-3">
                <span className="text-navy-blue">User Settings</span>
            </h2>

            <ul className="whitespace-nowrap w-fit list-none p-3 text-sm">
                <li className="flex flex-row justify-between py-4 border-b border-dotted border-gray-400 space-x-20">
                    <span>Share settings</span>
                    <ToggleButton initialChecked={user!.allowToShareSettings} onChange={(newValue) => setAllowToShare(newValue)} />
                </li>

                <li className="flex flex-row justify-between py-4 border-b border-dotted border-gray-400 space-x-20">
                    <div>Click on an user to import the settings</div>
                    <div className="flex justify-center items-center h-full">
                        {pending && <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>}
                        {!pending && sharedUserList !== null && <div className="flex flex-col text-blue-600">
                            {sharedUserList.map((item: JSONObject, index: number) => (
                                <div key={`user_${item._id}`} className="cursor-pointer font-semibold" onClick={() => shareSettings(item, user!._id)}>{item.email}</div>
                            ))}
                        </div>}
                    </div>
                </li>
            </ul>



        </div>
    )
}