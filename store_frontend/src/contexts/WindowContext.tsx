import React from 'react'
import breakThrottle from '../utils/evFunc/breakThrottle'
import throttle from '../utils/evFunc/throttle'

type State = {
  clientX:number,
  clientY:number,
  scrollX:number,
  lastScrollX:number,
  scrollY:number,
  lastScrollY:number
}
let clientX:number = 0
let clientY:number = 0
const initialize = () => {
      // Guess the initial mouse position approximately if possible:
      const hoveredEls = document.querySelectorAll(':hover');
      const hoveredEl = hoveredEls[hoveredEls.length - 1]; // Get the most specific hovered element
  
      if (hoveredEl != null) {
          var rect = hoveredEl.getBoundingClientRect();
          // Set the values from hovered element's position
          clientX = rect.x + (rect.width/2);
          clientY = rect.y + (rect.height/2);
      }
}
const getScrollX = ():number => document.documentElement.scrollLeft || document.body.scrollLeft || window.scrollX
const getScrollY = ():number => document.documentElement.scrollTop || document.body.scrollTop || window.scrollY

const initialState:State = {
  clientX,
  clientY,
  scrollX:getScrollX(),
  lastScrollX:getScrollX(),
  scrollY:getScrollY(),
  lastScrollY:getScrollY()
}
const WindowContext = React.createContext(initialState)

type Action = {
  type: string,
  payload?: {clientX:number, clientY:number}
}
const WindowReducer = (state:State, {type, payload}:Action):State => {
  switch (type) {
    case 'SET_XY':
      return (!payload) ? state : {
        ...state,
        clientX: payload.clientX,
        clientY: payload.clientY
      }
    case 'SET_SCROLL':
      return {
        ...state,
        lastScrollX:state.scrollX,
        lastScrollY:state.scrollY,
        scrollX:getScrollX(),
        scrollY:getScrollY(),
      }
    default:
      return state
  }
}

export const WindowProvider = ({children}:{children:React.ReactNode}) => {
  const [state, dispatch] = React.useReducer(WindowReducer, initialState)

  React.useEffect(() => {
    const handleMouseMove = throttle((ev:MouseEvent)=>{
      dispatch({type: 'SET_XY', payload:{clientX:ev.clientX, clientY:ev.clientY}})
    }, 100)
  
      document.addEventListener("mousemove", handleMouseMove);
      return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  React.useEffect(() => {
    const handleScroll = throttle((ev:Event)=>{
      dispatch({type: 'SET_SCROLL'})
    }, 50)
  
      document.addEventListener("scroll", handleScroll);
      return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  const providedValue = {
    clientX: state.clientX,
    clientY: state.clientY,
    scrollX: state.scrollX,
    scrollY: state.scrollY,
    lastScrollX: state.lastScrollX,
    lastScrollY: state.lastScrollY,
  }

  return <WindowContext.Provider value={providedValue}>
    {children}
  </WindowContext.Provider>
}

export default WindowContext