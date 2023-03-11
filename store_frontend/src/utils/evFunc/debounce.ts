//debounce = finish repeating then i'll do
const debounce = (func:any, delay:number) => {
  let timeout:NodeJS.Timeout|null;
  return ((...args:any) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func(...args);
    }, delay);
  });
};
export default debounce
//To be used like this:

// useEffect(() => {
//   const handleResize = debounce(() => {
//     setWindowSize(window.innerWidth);
//   }, 1000);

//   window.addEventListener("resize", handleResize);
//   return () => window.removeEventListener("resize", handleResize);
// }, []);
