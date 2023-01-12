import Nav from './Nav/Nav';
import Burger from './Burger/Burger'
import User from './User/User.js'
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="header-container">
        <Link to="/" className="logo-container">
          <h3 className="logo">Brand<span>Name</span></h3>
        </Link>
        <Nav />
        <User />
        <Burger />
      </div> 
    </header>
  );
};

export default Header;