import NavItem from './NavItem';

const NavDropdown = ({ submenu, dropdown, depthLevel, resetDropdowns, setResetDropdowns }) => {
  //set the class for this dropdown
  const dropdownClass = depthLevel > 0 ? ' second' : '';

  //increase the depth level for the following items
  depthLevel += 1;
  return (
    <div className={`nav-dropdown${dropdownClass} ${dropdown ? ' show' : ''}`}>
      <ul>
        {submenu.map((i, n) => (
          <NavItem
            key={n}
            item={i}
            depthLevel={depthLevel}
            resetDropdowns={resetDropdowns}
            setResetDropdowns={setResetDropdowns}
          />
        ))}
        <div className={'nav-arrow'}></div>
      </ul>
    </div>
  );
};

export default NavDropdown;
