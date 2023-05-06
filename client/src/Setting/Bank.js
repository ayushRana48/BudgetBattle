import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Route, Routes, Outlet } from 'react-router-dom'; // Import the Outlet component
import { Tooltip } from "react-tooltip";



export default function Bank({currentUser,bankName,accessToken,reRender,bankBrand,accountNum}){

    const [show,setShow]=useState(false)
    
    console.log("user from IUnvite ")
    console.log(currentUser)

    function deleteBank(){
        console.log("delete")
        const url = `http://localhost:3500/users/deleteBank`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                "user":currentUser,
                "bankName":bankName,
                "accessToken":accessToken
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            reRender()
        })
        .catch(err => console.log(err));
    }

    const handleMouseEnter = () => {
        setShow(true);
      };
    
      const handleMouseLeave = () => {
        setShow(false);
      };


    return(
        <div className=""> 
            <div className="mx-auto w-[40%] p-2 hover:bg-hoverGray ">
            <div className="flex  mb-2">
                <img className="mr-4" src="/Bank1.svg"></img>

                <div className="w-[45%]">
                    <h1 className="text-sm mt-3 truncate">{bankName}</h1>
                </div>
                <div className="w-32 h-11 justify-center  mt-[-0.4rem]">
                    {show ?
                        <div className="bg-[#575757] text-white text-xxs h-5 rounded-md" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            <p className="py-1">{bankBrand}  {accountNum}</p>
                        </div>
                        :
                        <div className=" text-white text-xxs h-5 rounded-md" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        
                        </div>
                    }
                    
                    <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className=""><img className="w-6" src="/info.svg"/></button>
                </div>
                
                <div className="flex ml-auto mr-1 gap-x-1"> 
                    <img onClick={deleteBank} className="w-12 h-10 mt-1 p-1 hover:bg-red hover:cursor-pointer rounded-md" src="/inviteClick/No.svg"></img>
                </div>

            </div>
            </div>
            <div className="h-[3px] mx-auto w-[40%] bg-hoverGray" ></div>
        </div>


    ) 
}