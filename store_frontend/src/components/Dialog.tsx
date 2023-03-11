import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import {useDialog} from '../contexts/DialogContext';
import { breakpoints } from '../styles/attrs/breakpoints';
import PxDiv from '../styles/Pxs/PxDiv'
import PxButton from '../styles/Pxs/PxButton'
import { TyAttrs } from '../styles/attrs/attrsHandler';
import { PxH3 } from '../styles/Pxs/PxH';

const Dialog = () => {
    const { dialogState, onYes, onNo, onCancel} = useDialog();
    const dialogRef = React.useRef<HTMLDivElement>(null)

    const onClick = (ev:React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
      //click outside the dialog means cancel
      if(dialogRef.current && 
        ev.target instanceof (Node) &&
        !dialogRef.current.contains(ev.target)){
        onCancel()
      }
    }
    const btns =
      [dialogState?.yesText, dialogState?.noText, dialogState?.cancelText]
      .filter(i=>(i && i.length > 0))

      const Component = (!dialogState.show) ? null : (
      <ScOverlay onClick={onClick}>
        <ScDialog
          pxMinWidth={50}
          formBody
          pxLevel={2}
          {...dialogState?.attrs}
          {...dialogState?.bodyAttrs}
          ref={dialogRef}
        >
          <ScHeader
            {...dialogState?.attrs}
            {...dialogState?.headAttrs}
          >{dialogState?.headText && dialogState.headText}</ScHeader>
          <ScBody 
          pxLevel={1}
          > {dialogState?.bodyText && dialogState.bodyText}
          </ScBody>

          <ScFooter pxLevel={1}
          style={{...{display: 'flex'}, 
          ...((btns.length < 2) ? {justifyContent:'center'}:{justifyContent:'flex-end'})}}
          >
            {(dialogState?.yesText || btns.length < 1) && 
              <ScButton pxLevel={0}
                onClick={onYes}
                {...dialogState?.attrs}
                {...dialogState?.yesAttrs}  
              >
                {dialogState.yesText || 'Ok'}
              </ScButton>
            }
            {dialogState?.noText &&
              <ScButton pxLevel={0}
                onClick={onNo}
                {...dialogState?.attrs}
                {...dialogState?.noAttrs}
              >
                {dialogState.noText}
              </ScButton> }
            {dialogState?.cancelText &&
              <ScButton pxLevel={0}
                onClick={onCancel}
                {...dialogState?.attrs}
                {...dialogState.cancelAttrs}
              >
                {dialogState.cancelText}
              </ScButton>            
            }

          </ScFooter>
        </ScDialog>
      </ScOverlay>
    );

    return createPortal(Component, document.getElementById('dialog') as Element);
};
export default Dialog;

const ScOverlay = styled(PxDiv)`
  position: fixed;
  top: 0; left: 0; bottom: 0; right: 0;
  z-index: 1000000;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
`

const ScDialog = styled(PxDiv)`
  z-index: 1000000000000111;
  position: absolute;
  ${breakpoints([
    ['max-width', 75, 'vw']
  ])}
  left:50%; top:50%; transform: translate(-50%, -50%);
`

const ScHeader = styled(PxH3)`
  width:100%;  
`
const ScBody = styled(PxDiv)`

`

const ScFooter = styled(PxDiv)`
  width: 100%;
  display: flex; flex-flow: row nowrap;
  justify-content: flex-end; align-items: center;
`
const ScButton = styled(PxButton).attrs<TyAttrs>(props=>({
pxMarginRight:0.5,
pxMinWidth:4,
}))` //button

`