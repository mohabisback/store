import NavBar from './NavBar/NavBar';
import Burger from './Burger/Burger';
import UserBar from './UserBar/UserBar.js';
import { Link } from 'react-router-dom';
import Cart from './Cart/Cart';

const Header = () => {
  return (
    <header>
      <div className='header-container'>
        <Link
          to='/'
          className='logo-container'
        >
          <h3 className='logo'>
            Brand<span>Name</span>
          </h3>
        </Link>
        <NavBar />
        <UserBar />
        <Cart />
        <Burger />
      </div>
    </header>
  );
};

export default Header;
