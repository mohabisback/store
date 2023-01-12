import { useRef, useState } from 'react'
const ZoomImage = ({ zoom, alt, ...rest }) => {
  const time = 0.5
  const imageRef = useRef(null)
  const [initialRec, setInitialRec] = useState({top:0, left: 0, width: 0, height: 0})
  const [initial, setInitial] = useState(false)
  const [final, setFinal] = useState(false)
  //console.log(imageRef.current.getBoundingClientRect());
  
  const GoZoomIn=()=>{
    const rec = imageRef.current.getBoundingClientRect();
    setInitialRec({top:rec.top, left: rec.left, width: rec.width, height: rec.height})
    setInitial(true)
    setTimeout(() => {
      setFinal(true)
    }, 10);
  }
  const GoZoomOut=()=>{    
    const rec = imageRef.current.getBoundingClientRect();
    //setInitialRec({top:rec.top, left: rec.left, width: rec.width, height: rec.height})
    setFinal(false)
    setTimeout(() => {
      setInitial(false)
    }, time * 1000);
  }
  
  if (!zoom) return <img alt={alt} {...rest} />
  else
    return (
      <>
        <img alt={alt} {...rest} ref={imageRef} onClick={(e)=>{GoZoomIn()}} style={{cursor: 'zoom-in'}}/>
        {initial &&
        <div onClick={(e)=>{GoZoomOut()}}
          style = {!final ? {
            position: 'fixed',
            top: initialRec.top,
            left: initialRec.left,
            width: initialRec.width,
            height: initialRec.height,
            //display: 'block',
            backgroundColor: 'transparent',
            transition: 'all ease ' + time + 's',
            cursor:'zoom-in'
            
          } : {
            position: 'fixed',
            zIndex: '10001',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            transition: 'all ease ' + time + 's',
            cursor:'zoom-out'
          }}
        >
          <img alt={alt} {...rest} 
          style={!final ? {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transition: 'all ease ' + time + 's'
          } : {
            width: '100vw',
            height: '100vh',
            objectFit: 'contain',
            transition: 'all ease ' + time + 's'
          }} ></img>
        </div>}
      </>
    )
}
export default ZoomImage