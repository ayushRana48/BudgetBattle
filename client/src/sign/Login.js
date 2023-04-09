import { useState, useEffect } from "react";
import {Link} from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import Register from "./Register";



export default function Login({getCurrentUser}){

    const [loginData,setLoginData] = useState({user:"",password:""})

    const navigate = useNavigate();

    function logIn(){
        fetch('http://localhost:3500/auth',{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body: JSON.stringify({
            user:loginData.user,
            pwd:loginData.password
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          getCurrentUser(loginData.user)
          localStorage.setItem('user', JSON.stringify(loginData.user));

          navigate('/in')
        })
        .catch(err => alert("Invalid username or password"))
    }
    
    return(
    <div className="mt-24">
    <div className='login'>
        <h1 className="text-lg mb-8">Log In</h1>
        <div className="flex gap-x-16 justify-center">
          <input className="rounded-md focus:outline-none border-2 p-1.5 placeholder-ml-4 border-purple" placeholder="username" type="text" name="Luser" value={loginData.user} onChange={e=>setLoginData((x)=>({...x, user:e.target.value}))}></input>
          <input className="rounded-md focus:outline-none border-2 p-1.5 placeholder-ml-4 border-purple" placeholder="password" type="text" name="Lpwd" value={loginData.password} onChange={e=>setLoginData((x)=>({...x, password:e.target.value}))}></input>
        </div>
        
        <button className="mt-4 border rounded-md bg-purple px-4 py-1 text-white border-purple" onClick={logIn}>login</button>
        
    </div>
    <div class="flex items-center mt-8 justify-center mx-auto">
      <div class="h-1 w-80 bg-hoverGray"></div>
      <h1 class="mx-2 text-m">or</h1>
      <div class="h-1 w-80 bg-hoverGray"></div>
    </div>
    <div className="mt-4">
      <Register getCurrentUser={getCurrentUser}></Register>
    </div>
    </div>

    )


}