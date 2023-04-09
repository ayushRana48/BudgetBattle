import './App.css';
import { useState, useEffect } from "react";
import { Route,Routes } from 'react-router-dom'
import Register from './sign/Register';
import Login from './sign/Login';
import In from './dash/In';
import Group from './dash/Group';


function App() {

  const[currentUser,setCurrentUser]= useState()
  const[userGroups,setUserGroups] = useState([])


  //fix this
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('user'));
    if(user){
      setCurrentUser(user)
    }
    console.log(currentUser)
  },[])

  function getCurrentUser(x){
    setCurrentUser(x)
    console.log(currentUser)
  }

  function resetUser(){
    setCurrentUser()
  }

  function getGroups(x){
    console.log("frim app groups")
    console.log(x)
    setUserGroups(x)
  }

  const groupRoutesList = userGroups.map(x=>{
    const groupPath = "/in/group/" + x.groupId
    return(
      <Route path={groupPath} element={<Group currentUser={currentUser} groupName={x.groupName} groupId={x.groupId}/>}> </Route> 
    )
  })

  console.log(groupRoutesList)

  
  return (
    <div className="App">
      <Routes>
            <Route path="/in" element={<In getGroups={getGroups} resetUser= {resetUser} currentUser={currentUser}/>}></Route>
            <Route path="/" element={<Login getCurrentUser={getCurrentUser}/>}></Route> 
            <Route path="group/d5e7f0f11fd5170d1b66" element={<h1>dddd</h1>}></Route>
            {groupRoutesList}
      </Routes>
    </div>
  );
}

export default App;
