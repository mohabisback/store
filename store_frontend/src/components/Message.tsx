import React, { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import MessageContext from '../contexts/MessageContext'
import PxDiv from '../styles/Pxs/PxDiv'

let isHovered = false;
let timeout:NodeJS.Timeout;
const Message = () => {
  const {messageState, hideMessage} = React.useContext(MessageContext)
  const messageRef = React.useRef<HTMLDivElement>(null)

  const [hoverChanged, setHoverChanged] = React.useState({})
  const onHover = ()=>{isHovered=true; setHoverChanged({})}  
  const onNotHover = ()=>{isHovered=false; setHoverChanged({})}  

  //listeners
  React.useEffect(()=>{
    const me = messageRef?.current
    if(me){
      me?.addEventListener('mouseenter', onHover)
      me?.addEventListener('mouseleave', onNotHover)
    }
    return ()=>{
      me?.removeEventListener('mouseenter', onHover)
      me?.removeEventListener('mouseleave', onNotHover)
    }
  },[messageState.show, messageRef?.current])

  React.useEffect(() => {
    timeout = setTimeout(()=>{
      if(!isHovered) hideMessage();
    }, messageState.delay);
  }, [hoverChanged, messageState.show]); //isHovered only, to avoid repeating

  const Component = (!messageState?.show) ? null : (<>
    <ScMessage
      pxLevel={2}
      ref={messageRef}
    >
      {messageState.customJSX ? messageState.customJSX :
      <>
        <ScHeader
          pxLevel={1}
          pxMarginBottom={0.5}
          head
          {...messageState?.attrs}
          {...messageState?.headAttrs}
        >{messageState?.headText && messageState.headText}</ScHeader>
        <ScBody
          pxLevel={1}
          formBody
          {...messageState?.attrs}
          {...messageState?.bodyAttrs}
        > {messageState?.bodyText && messageState.bodyText}
        </ScBody>
      </>}
    </ScMessage>
  </>);

    return createPortal(Component, document.getElementById('message') as Element);

};
export default Message;

const ScMessage = styled(PxDiv)`
  position: fixed;
  bottom: 2%; right:2%;
  max-width: 80%; max-height: 50%;
  width: fit-content;
  padding: 10px;
`
const ScHeader = styled(PxDiv)`
  width: 100%;
`
const ScBody = styled(PxDiv)`
`
