// i'll do if time and/or if difference
const breakThrottle = (
  mainFunc:(...args:any)=>any,
  diffsValues: [number, (...args:any)=>number][],  
  delay:number = 1000,
  breakOrThrottle:boolean = false, //true for And, false for Or
  is1stNow:boolean = false) => {

  let isWaiting = false;
  let inits:number[] = []
  const diffs:number[] = diffsValues.map(v=>v[0])
  let timeout: NodeJS.Timeout;
  return ((...args:any) => { //returned function executed every event
    const values:number[] = diffsValues.map(v=>v[1](...args))

    if (inits.length < 1){
      if (is1stNow) mainFunc(...args);
      inits = values
    }

    if (!isWaiting || breakOrThrottle) {
      if (values.some((v,n)=> Math.abs(v-inits[n])>= diffs[n])) {
        mainFunc(...args);
        inits = values
        if (breakOrThrottle) {isWaiting = false; clearTimeout(timeout)}       
        return;
      }
      if (isWaiting) return;
      isWaiting = true;
    } else {
      return;
    }
    
    timeout = setTimeout(() => {
      isWaiting = false

      const values:number[] = diffsValues.map(v=>v[1](...args))
      if (values.some((v,n)=> Math.abs(v-inits[n])>= diffs[n]) || breakOrThrottle) {
        mainFunc(...args);
        inits = values
      }
    }, delay);
  })
}
export default breakThrottle
//To be used like this:


// React.useEffect(() => {   
//   const getWidth = ()=>(document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth)
//   const getHeight = ()=>(document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight)
// const handleResize = breakThrottle(
//   () => { //main function
//     dispatch({ type: 'SET_W_H_F_P', payload:{width: getWidth(), height: getHeight()} })
//   },[ //array of [difference, valueFunction]
//     [20, getWidth ],
//     [20, getHeight ],
//   ],
//   1000, false, false);

//   window.addEventListener("resize", handleResize);
//   return () => window.removeEventListener("resize", handleResize);
// }, []);