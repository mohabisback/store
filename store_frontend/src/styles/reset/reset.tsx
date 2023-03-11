import { createGlobalStyle } from 'styled-components'
import scaling from '../attrs/scaling'
import {TyTheme} from '../../contexts/ThemeContext'

export default createGlobalStyle`
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  vertical-align: baseline;
  box-sizing: border-box;
}
ol, ul {
    list-style: none;
}
blockquote, q {
    quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
    content: '';
    content: none;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}


body {
  line-height: 1;
  width: 100%;
  height: 100%;
  direction: ltr;
  ${({theme}:{theme:TyTheme})=>theme.style.body}
}

`