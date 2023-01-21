import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const [counter, setCounter] = React.useState(5)
  
  const navigate = useNavigate()
  React.useEffect(()=>{
    const interval = setInterval(() => {
      setCounter(counter=>{
        if (counter <= 1) clearInterval(interval) //no more after 0
        return counter - 1
      })
    }, 1000);

    return () => clearInterval(interval);
  },[])

  React.useEffect(()=>{
    if (counter <= 0){
      navigate('/')
    }
  },[counter, navigate])

  return (
  <>
    <h1>Page not found.</h1>
    <h2>You'll be redirected to home page in {counter} seconds.</h2>
  </>
  
  )

};

export default Error;
