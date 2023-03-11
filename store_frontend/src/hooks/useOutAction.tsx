import React from 'react';

//close when click, touch, scroll outside
const useOutAction = (elementRef:React.RefObject<HTMLElement>,
  callback:Function,) =>{
  React.useEffect(() => {
    const handler = (ev:Event):any => {
      if (elementRef.current &&
          ev.target instanceof(Node) &&
        !elementRef.current.contains(ev.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    document.addEventListener('scroll', handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
      document.removeEventListener('scroll', handler);
    };
  }, [elementRef, callback]);

}

export default useOutAction
