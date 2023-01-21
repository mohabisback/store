import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useDialog } from '../contexts/DialogContext';

const Dialog = () => {
    const { onOk, onCancel, dialogState } = useDialog();
    const dialogRef = React.useRef()
    const portalElement = document.getElementById('portal');

    const handleClick = (e) => {
      //click outside the dialog means cancel
      if(dialogRef.current && !dialogRef.current.contains(e.target)){
        onCancel()
      }
    }

    const component = dialogState.show ? (
      <ScOverlay className="portal-overlay" onClick={handleClick}>
        <ScDialog className="dialog" ref={dialogRef}>
          <p>{dialogState?.text && dialogState.text}</p>
          <ScFooter className="confirm-dialog__footer">
            {dialogState?.okText &&
              <ScBtn className="btn" onClick={onOk}>
                {dialogState.okText}
              </ScBtn> }
            {dialogState?.cancelText &&
              <ScBtn className="btn" onClick={onCancel}>
                {dialogState.cancelText}
              </ScBtn>            
            }

          </ScFooter>
        </ScDialog>
      </ScOverlay>
    ) : null;

    return createPortal(component, portalElement);
};
export default Dialog;

const ScOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`
const ScDialog = styled.div`
  z-index: 1000000000000111;
  padding: 16px;
  background-color: white;
  width: 400px;
  position: absolute;
  top: 200px;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
`
const ScFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top:20px;
`
const ScBtn = styled.button`
  outline: none;
  padding:6px 10px;
  border:1px solid #000;
  margin: 0 10px;
  cursor: pointer;
`