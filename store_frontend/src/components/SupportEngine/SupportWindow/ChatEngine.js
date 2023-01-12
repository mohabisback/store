import React, { useEffect, useState } from "react";
import GlobalContext from "../../../contexts/GlobalContext";
import ResizeImage from '../../../utils/ResizeImage.js'
import ZoomImage from '../../../components/ZoomImage.js'

//import { ChatEngineWrapper, Socket, ChatFeed } from 'react-chat-engine'

const ChatEngine = ({setSocketConnected}) => {
  
  const userID = window.localStorage.getItem('socketUserID')
  const [messages, setMessages] = React.useState([]);
  const [fileContent, setFileContent] = React.useState(null)
  const [textContent, setTextContent] = React.useState(""); //content of the message

  const {socket} = React.useContext(GlobalContext)
  const messagesDiv = React.useRef(null)

  useEffect(() => {
    //get old messages from local storage
      setMessages(JSON.parse(window.localStorage.getItem('supportMessages') || "[]"))
      
    //set received messages event
    socket.on("message", (message) => {
      receivedMessage(message);
    })
  }, [socket]);

  useEffect(() => {
    if (messagesDiv) {
      //set auto scroll down
      messagesDiv.current.addEventListener('DOMNodeInserted', event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [messagesDiv])

  function receivedMessage(message) {
    setMessages(messages => {
      const newMessages = [...messages, message]
      window.localStorage.setItem('supportMessages', JSON.stringify(newMessages))
      return  newMessages
    });
  }

  async function sendMessage(e) {
    e.preventDefault();
    const Deploy = (content) => {
      setMessages(messages=>{
        const newMessages = [...messages, {content, to: userID, from: userID}]
        window.localStorage.setItem('supportMessages', JSON.stringify(newMessages))
        return newMessages
      })
      socket.emit("message", {content, to: userID}); //from is automatically sent
    }
    
    let content;
    if (fileContent){
      await ResizeImage(fileContent, (uri)=>{
        console.log(uri)
        content = {type:'file', body: uri, mimeType: fileContent.type, fileName: fileContent.name}
        Deploy(content)
      })
      setFileContent(null);
    } else {
      content = {type: 'text', body: textContent}
      Deploy(content)
    }
    setTextContent("");

  }
  //
  return (
    <div style={{height:'100%'}} >
        <div style={{width: '100%', height: '80%', overflowY:'auto'}} ref={messagesDiv}>
        {messages.map((message, index)=>renderMessage(message, index, userID))}
      </div>
      <form onSubmit={sendMessage}>
        <textarea 
          value={textContent} 
          onChange={(e)=>{setTextContent(e.target.value)}} 
          placeholder="Say something..." 
        />
        <input  type='file'
        onChange={(e)=>{
            setFileContent(e.target.files[0])
            setTextContent(e.target.files[0].name) //show filename in text box
          }}/>
        <button type='submit'>Send</button>
      </form>
    </div>
  )
}

const renderMessage = (message, index, userID) => {
  
  if (message.content?.type === 'file'){
    const blob = new Blob([message.content.body], {type: 'file'})
    return (
      <Image key={index} fileName={message.content.fileName} blob={blob}/>
    )
  }else{
  if (message.from === userID) {
    return (
    <div key={index}>{message.content.body}</div>            
    )
  }  
}
}

const Image = (props) =>{
  const [imageSrc, setImageSrc] = useState('')
  useEffect(()=>{
    const reader = new FileReader();
    reader.readAsDataURL(props.blob);
    reader.onloadend = ()=>{setImageSrc(reader.result)}
  }, [props.blob])
  return (
    <ZoomImage zoom={true} style={{width: '150', height: 'auto'}} src={imageSrc} alt = {props.fileName}/>
  )
}
export default ChatEngine;

const styles = {
    chatEngineWindow: {
        width: '100%',  
        backgroundColor: 'pink',
    }
}
