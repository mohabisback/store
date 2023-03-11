//then i'll do only every delay
const throttle = (
  func:any,
  delay:number = 1000,
  is1stNow:boolean = false) => {
  let cantRepeat = false;
  return ((...args:any) => { //returned function executed every event
    if (cantRepeat) return;
    cantRepeat = true;
    if(is1stNow) func(...args);
    setTimeout(() => {
      if(!is1stNow) func(...args);
      cantRepeat = false;
    }, delay);
  })
}
export default throttle
//To be used like this:

// useEffect(() => {
//   const handleResize = throttle(() => {
//     setWindowSize(window.innerWidth);
//   }, 1000);

//   window.addEventListener("resize", handleResize);
//   return () => window.removeEventListener("resize", handleResize);
// }, []);


// React.useEffect(() => {
//   const handleResize = throttleAndBreakpoint(() => {
//     dispatch({ type: 'SET_WIDTH', payload: window.innerWidth || 
//     document.documentElement.clientWidth || document.body.clientWidth })

//   }, false, 1000, 20, window.innerWidth || 
//   document.documentElement.clientWidth || document.body.clientWidth);

//   window.addEventListener("resize", handleResize);
//   return () => window.removeEventListener("resize", handleResize);
// }, []);