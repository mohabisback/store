import LoginItem from './LoginItem.js';

const UserBar = () => {
  return (
    <div className='user-container'>
      <ul className='user-items'>
        <li className='user-lang'></li>
        <li className='user-theme'></li>
        <LoginItem
          itemClass={'nav-item'}
          dropdownItemClass={'nav-dropdown-item'}
          linkClass={'nav-link'}
          firstItemArrow={'angles-down'}
          dropdownClass={'nav-dropdown'}
        />
      </ul>
    </div>
  );
};

export default UserBar;
