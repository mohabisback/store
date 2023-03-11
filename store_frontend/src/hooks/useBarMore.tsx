import React from 'react';
import ThemeContext from '../contexts/ThemeContext'
import {TyNavObject} from '../SharedLayout/Header/NavItem'
import useMutationObserver from '../hooks/useMutationObserver'

const useBarMore = (
  initItems:any[],
  barRef:React.RefObject<HTMLUListElement>,
  widthPercent:number=100,
  moreIcon?:JSX.Element,
  observed?:React.RefObject<HTMLUListElement>[]
) => {
  const itemsWithMore = [...initItems, {icon: moreIcon, submenu: []}]
  
  const {theme} = React.useContext(ThemeContext)
  const [themeWidth, setThemeWidth] = React.useState(theme.width) //refining
  React.useEffect(()=>{setThemeWidth(theme.width)},[theme.width, setThemeWidth])

  const [barItems, setBarItems] = React.useState<TyNavObject[]>(itemsWithMore)
  const [isAdjusted, setIsAdjusted] = React.useState<boolean>(false)
  const [reset, setReset] = React.useState<object>({})

  const [subs, setSubs] = React.useState<HTMLUListElement[]>([]) //observed elements
  
  React.useEffect(()=>{
    const els = observed?.map(v=>v.current).filter(v=> (v !== null)) || []
    setSubs(els as HTMLUListElement[])
  },[observed])
 
  useMutationObserver(subs as HTMLElement[],()=>{setReset({})})
  
  React.useEffect(()=>{
    if(isAdjusted){
      setIsAdjusted(false)
      setBarItems(itemsWithMore)
      setReset({})
      return;
    }
    setIsAdjusted(true)

    let subtractWidth = 0
      subtractWidth = subs?.reduce((r:number, el)=>{
        let elWidth = 0
        const rect = el.getBoundingClientRect()
        if(rect) elWidth = rect.width
        return r+=elWidth
      },0)
    const allowedWidth = (theme.width - subtractWidth) * widthPercent / 100
    
    const barWidth = barRef.current?.getBoundingClientRect().width
    
    if (barWidth){
      const lis = barRef.current?.getElementsByTagName('li')
      const allWidth = Array.from(lis)
      .reduce<number>((r,v,n)=>(r+= v.getBoundingClientRect().width),0)
      const gap = (barWidth - allWidth)/(lis.length+1)

      const newBarItems = []
      let nowWidth = gap
      const moreWidth = lis[lis.length-1].getBoundingClientRect().width
      
      let i = 0
      while (i < initItems.length) {
        const liWidth = (lis[i]) ? lis[i].getBoundingClientRect().width : 0 
        if (
          (( liWidth + nowWidth + gap) < allowedWidth) &&
          ((liWidth + nowWidth + moreWidth + (2*gap) <= allowedWidth) || (i >= initItems.length-1))
        ){
          newBarItems.push(initItems[i])
          nowWidth+=liWidth+gap
        } else {
          break;
        }
        i++
      }
      //add more list
      const moreItems = initItems.filter((v,n)=> n>=i)
      if (moreItems.length > 0 ) newBarItems.push({url: '#', icon: moreIcon, submenu: moreItems})
      //set barItems
      setBarItems(newBarItems)
    }
  },[reset, initItems, theme.width, barRef])

  return {barRef, barItems}
}

export default useBarMore