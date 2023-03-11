
//i'll do only every difference
export const brottle = (
  mainFunc:(...args:any)=>any,
  diffsValues:[number, ()=>number][],
  is1stNow:boolean = false) => {
  //fixed during all events, value changes only
  let inits:number[]=[]
  const diffs = diffsValues.map(i=>i[0])
  return ((...args:any) => { //returned function executed every event
    //changeable outside values goes here
    const values = diffsValues.map(i=>i[1]())
    if (inits.length < 1){
      if (is1stNow) mainFunc(...args);
      inits = values
    }

    if (values.some((v,n)=> Math.abs(v-inits[n])>= diffs[n])) {
      mainFunc(...args);
      inits = values
    }
  });
};
export default brottle
//used like this

// React.useEffect(() => {
//   const handleResize = breakPoint(
//     () => { //main function
//       dispatch({ type: 'SET_WIDTH', payload: window.innerWidth || 
//       document.documentElement.clientWidth || document.body.clientWidth })
//     },
//     ()=> window.innerWidth || 
//     document.documentElement.clientWidth || document.body.clientWidth,
//     20,
//     false);

//   window.addEventListener("resize", handleResize);
//   return () => window.removeEventListener("resize", handleResize);
// }, []);
