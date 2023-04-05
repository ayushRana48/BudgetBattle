import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function Register(){
    const [registerData,setRegisterData] = useState({user:"",password:""})
    const [approve,setApprove]=useState(false)

    const navigate = useNavigate();

    function newUser(){
        if(!registerData.user || !registerData.password){
            alert("Missing username or password")
            return;
        }
        fetch('http://localhost:3500/register',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            user:registerData.user,
            pwd:registerData.password
        })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            navigate('/')})
        .catch(err=>alert("Username already taken"))
    }

    return(
        <div className='signUp'>
            <h1 className="text-lg mb-8">Sign Up</h1>
            <div className="flex gap-x-16 justify-center">
                <input className="rounded-md focus:outline-none border-2 p-1.5 placeholder-ml-4 border-purple"type="text" placeholder="username" name="Ruser" value={registerData.user} 
                onChange={e=>setRegisterData((x)=>({...x, user:e.target.value}))}></input>
                <input className="rounded-md focus:outline-none border-2 p-1.5 placeholder-ml-4 border-purple"type="text" placeholder="password" name="Rpwd" value={registerData.password } 
                onChange={e=>setRegisterData((x)=>({...x, password:e.target.value}))}></input>
            </div>
            
            <button className="mt-4 rounded-md bg-purple px-4 py-1 text-white " onClick={newUser}>Sign Up</button>
        </div>
    )
}
  