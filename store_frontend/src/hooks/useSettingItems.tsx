import React from 'react'
import ThemeContext from "../contexts/ThemeContext"
import themeColors from '../styles/themes/themeColors'
import { TyNavObject } from "../SharedLayout/Header/NavItem"
import { TyAttrs } from '../styles/attrs/attrsHandler'
import { themeConstructors } from '../styles/themes/themeStyles/default'
import PxIcon from '../styles/Pxs/PxIcon'
import { FaSun, FaMoon, FaRegObjectUngroup, FaObjectGroup } from 'react-icons/fa'
import { MdBorderStyle, MdFormatColorFill, MdFormatSize, MdPhotoSizeSelectLarge, MdStyle } from 'react-icons/md'

const useSettingItems = () => {
  const {theme, setThemeColor, setThemeSize, setFontFactor, setThemeStyle,
    setThemeRadius, setThemeDark, setThemeGroup} = React.useContext(ThemeContext)

  let colorsItems:TyNavObject[] = themeColors.map((color, n) => (
    { title: color.name,
      onClick: ()=>{setThemeColor(color.name)},
      attrs: {color:color.name},
    }
  ))
  let sizeItems:TyNavObject[] = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(v=>(
    { title: v.toString(),
      onClick: ()=>{setThemeSize(v)},
      attrs: {pxScale:v},
    }
  ))
  let fontItems:TyNavObject[] = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(v=>(
    { title: 'Abc',
      onClick: ()=>{setFontFactor(v)},
      attrs: {pxFontScale:v},
    }
  ))
  const radiusArr:[number,string][] = [[0,'square'], [5,'fine'], [10,'more'], [20,'curve'], [30,'round'],[50,'circle']]
  let radiusItems:TyNavObject[] = radiusArr.map(v=>(
    { title: v[1],
      onClick: ()=>{setThemeRadius(v[0])},
      attrs: {style:{height: `4vh`, borderRadius:`${(v[0]*4/100).toString()}vh`}} as TyAttrs,
    }
  ))
  let styleItems:TyNavObject[] = themeConstructors.map(v=>(
    { title: v.name,
      onClick: ()=>{setThemeStyle(v.name)},
    }
  ))
  const createItems = React.useCallback(()=>{
    return [
      { title: (theme.dark === 'dark')?'Light':'Dark',
        icon: (theme.dark === 'dark')?<PxIcon as={FaSun}/>:<PxIcon as={FaMoon}/>,
        onClick: ()=>{setThemeDark((theme.dark === 'dark')?'light':'dark')},
        attrs: (theme.dark === 'dark')?{light: true}:{dark: true},
      },
      { title:'Color', icon: <PxIcon as={MdFormatColorFill}/>, submenu:colorsItems},
      { title:'Size', icon: <PxIcon as={MdPhotoSizeSelectLarge}/>, submenu:sizeItems},
      { title:'Font', icon: <PxIcon as={MdFormatSize}/>, submenu:fontItems},
      { title:'Corner', icon: <PxIcon as={MdBorderStyle}/>, submenu:radiusItems},
      { title: (theme.group === 'group')?'Ungroup':'Group',
        icon: (theme.group === 'group')?<PxIcon as={FaRegObjectUngroup}/>:<PxIcon as={FaObjectGroup}/>,
        onClick: ()=>{setThemeGroup((theme.group === 'group')?'ungroup':'group')},
        attrs: (theme.group === 'group')?{pxGroup: true}:{pxGroup: false},
      },
      { title:'Style', icon: <PxIcon as={MdStyle}/>, submenu:styleItems},    
    ]
  },[])
  const [settingItems, setSettingItems] = React.useState<TyNavObject[]>(createItems())
  React.useEffect(()=>{
    setSettingItems(createItems())
  },[theme.dark, theme.group])
  return {settingItems}
}
export default useSettingItems