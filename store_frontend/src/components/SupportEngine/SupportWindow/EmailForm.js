//Dependencies
import React, { useState } from "react"

//Local Dependencies
import GlobalContext from "../../../contexts/GlobalContext"
//Styles
import { styles } from "../styles"

//import { LoadingOutlined } from '@ant-design/icons'

import Avatar from '../Avatar'

const EmailForm = ({setSocketConnected}) => {    
  //Global Variables
  const {socket} = React.useContext(GlobalContext)

  //Local Variables  
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  
  React.useEffect(()=>{
  },[])

    function handleSubmit(event) {
        event.preventDefault();
        console.log(socket.auth)
        socket.auth = {userName, email, userID: null}
        console.log(socket.auth)
        socket.connect()
        setSocketConnected(true)

    }

    return (
        <div 
            style={{
                ...styles.emailFormWindow,
            }}
        >
            <div style={{ height: '0px' }}>
                <div style={styles.stripe} />
            </div>

            <div style={{ position: 'absolute', height: '100%', width: '100%', textAlign: 'center' }}>
                <Avatar 
                    style={{ 
                        position: 'relative',
                        left: 'calc(50% - 44px)',
                        top: '10%',
                    }}
                />

                <div style={styles.topText}>
                    Welcome to my <br /> support 👋
                </div>

                <form 
                    onSubmit={e => handleSubmit(e)}
                    style={{ position: 'relative', width: '100%', top: '19.75%' }}
                >
                <label>Enter your name: <input 
                    type='text'
                    required
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    style={styles.emailInput}
                /></label>
                <label>Enter your email: <input 
                    type='email'
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={styles.emailInput}
                /></label>
                <button
                  type='submit' 
                  onClick={e => handleSubmit(e)}              
                >Start Chat</button>
                </form>
            </div>
        </div>
    )
}

export default EmailForm;