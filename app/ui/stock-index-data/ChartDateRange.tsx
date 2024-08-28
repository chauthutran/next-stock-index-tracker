'use client';

import { useEffect } from "react"

export default function ChartDateRange({name, selected, handleOnClick}: {name: string, selected: boolean, handleOnClick: (name: string) => void}) {

    useEffect(() => {

    }, [selected])
    
    return ( 
        <div onClick={() => handleOnClick(name)} className={`${(selected) ? "text-blue-600 bg-slate-200" : ""} cursor-pointer hover:bg-slate-200 rounded-xl p-2 hover:text-blue-600`}>{name}</div>
    )
}