import React from 'react'
import useOutAction from './useOutAction';

const useDrop = (reset:Object) =>{
  const [isDropped, setIsDropped] = React.useState(false);
  let elRef = React.useRef<any>(null);
  useOutAction(elRef, ()=>{setIsDropped(false)}); 

  React.useEffect(() => {
    setIsDropped(false);
  }, [reset]);

  return {elRef, isDropped, setIsDropped}
}

export default useDrop