import styled,{css} from 'styled-components'
import attrsHandler, {TyAttrs} from '../attrs/attrsHandler'

export const PxTable = styled.table.attrs<TyAttrs>(props=>({...props,
  //first attrs modifying

}))<TyAttrs>`${attrsHandler} //first attrsHandling

${({theme})=>css`
  tr:nth-child(even) {
    ${theme.style.body}
    background-color: ${theme.dark === 'dark' ? 
    theme.color.colors[0]: theme.color.colors[5]};
  }
  tr:nth-child(odd) {
    ${theme.style.body}
    background-color: ${theme.dark === 'dark' ? 
    theme.color.colors[1]: theme.color.colors[4]};
  }
`}

`
export const PxTr = styled.tr.attrs<TyAttrs>(props=>({...props,
  //first attrs modifying
  pxLevel: 1,
}))<TyAttrs>`${attrsHandler} //first attrsHandling
  *:first-child:not(:last-child){
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  *:not(:first-child):not(:last-child){
    border-radius: 0px;
  }
  *:last-child:not(:first-child) {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
`
export const PxTh = styled.th.attrs<TyAttrs>(props=>({...props,
  pxLevel: 1,
  pxMargin:1,
}))<TyAttrs>`${attrsHandler} //first attrsHandling

justify-content: center; align-items: center; align-content: center;
white-space: normal;
text-align: center;
`
export const PxTd = styled.td.attrs<TyAttrs>(props=>({...props,
  pxLevel:1,
}))<TyAttrs>`${attrsHandler} //first attrsHandling

justify-content: center; align-items: center; align-content: center;
white-space: normal;
text-align: center;

`

