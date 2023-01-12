import Login from './Login.js'

const User = () => {
  
  return (
    <div className='user-container'>
        <ul className='user-items'>
          <li className='user-lang'></li>
          <li className='user-theme'></li>
          <Login/>
        </ul>
    </div>
  );
};


export default User