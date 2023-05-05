import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { format, startOfDay } from 'date-fns';

import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = ({getStartDate,getEndDate,groupId,startDate1,endDate1}) => {
  const currentDate = new Date();
  const tomorrow = new Date(currentDate.setDate(currentDate.getDate() + 1));

  const yesterday = new Date(currentDate.setDate(currentDate.getDate() - 1));



  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [edit,setEdit]= useState(false)


  useEffect(()=>{
    const url = `http://localhost:3500/group/getStartDate?groupId=${groupId}`;
       fetch(url, {
           method: 'GET',
           headers: {
               'Authorization': `Bearer ${groupId}`,
               'Content-Type': 'application/json'
           }
       })
       .then(response => response.json())
       .then(data => {
        console.log(data)
        console.log("fro, liken 88s")

           if(data.startDate){
                let date = new Date(data.startDate);
                const options = {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric'
                };
                let outputDate = date.toLocaleDateString('en-US', options);

                setStartDate(outputDate)
              }
       })
       .catch(err => console.log(err));

       const url2 = `http://localhost:3500/group/getEndDate?groupId=${groupId}`;
       fetch(url2, {
           method: 'GET',
           headers: {
               'Authorization': `Bearer ${groupId}`,
               'Content-Type': 'application/json'
           }
       })
       .then(response => response.json())
       .then(data => {
         if(data.endDate){

            let date = new Date(data.endDate);
                const options = {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric'
                };
                let outputDate = date.toLocaleDateString('en-US', options);

             setEndDate(outputDate)
         }
       })
       .catch(err => console.log(err));

   },[])



  const handleStartDateChange = (date) => {
    setStartDate(date);
    console.log(date)
    getStartDate(date)
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    getEndDate(date)

  };

  console.log(startDate)
  const date = new Date(startDate);
const timestamp = date.getTime();

console.log(timestamp);
  function editTrue(){
    const curr = new Date();
    console.log(timestamp);
    if(startDate && curr.getTime()>timestamp){
      alert("Challenge Already Started, can't edit dates")
    }
    else{
      setEdit(true)
    }

  }

  function saveDate(){
    let url1="http://localhost:3500/group/setStartDate"
    let url2="http://localhost:3500/group/setEndDate"

    fetch(url1, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${groupId}`,
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            "groupId":groupId,
            "startDate":startDate
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch(err => console.log(err));

    fetch(url2, {
      method: 'PUT',
      headers: {
          'Authorization': `Bearer ${groupId}`,
          'Content-Type': 'application/json'
      },
      body:JSON.stringify({
          "groupId":groupId,
          "endDate":endDate
      }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch(err => console.log(err));

    localStorage.setItem('startDate', JSON.stringify(startDate));
    localStorage.setItem('endDate', JSON.stringify(endDate));


    setEdit(false)

  }


  

  return (
    edit?
      <div className="date-range-picker flex justify-center mb-12">
      <div>
        
        <label className='text-xs'>Start Date:</label>
        <DatePicker
  selected={startDate ? new Date(startDate) : null}
  onChange={handleStartDateChange}
          dateFormat="P"
          minDate={tomorrow}
          maxDate={endDate}
          placeholderText="start"

          className="border rounded p-2 text-xs"

        />
      </div>
      <div>
        <label className='text-xs'>End Date:</label>
        <DatePicker
  selected={endDate ? new Date(endDate) : null}
  onChange={handleEndDateChange}
          dateFormat="P"
          minDate={startDate || currentDate}
          placeholderText="end"
          className="border rounded p-2 text-xs"
          // calendarClassName="border rounded mt-2"
        />
      </div>
      <button onClick={saveDate} className="w-12 h-[36px] mt-6 text-white text-sm font-light p-1 bg-purple hover:bg-darkPurple hover:cursor-pointer rounded-md">
        save
      </button>
    </div>
    
    :
    <div className="flex justify-center gap-x-12 mt-1 mb-12">
      <div>
          <h1 className="text-sm">{(startDate && new Date(startDate).toLocaleDateString()) || "Set Date"}</h1>
          <h1 className="text-xs">Start Date</h1>
      </div>
      <div>
          <h1 className="text-sm">{(endDate && new Date(endDate).toLocaleDateString()) || "Set Date"}</h1>
          <h1 className="text-xs">End Date</h1>
      </div>
      <button onClick={editTrue} className="px-3 py-1 bg-purple hover:bg-darkPurple hover:cursor-pointer rounded-md">
        <img className="w-6"src='/Edit.svg'></img>
      </button>
    </div>
  
      

    
  );
};

export default DateRangePicker;



