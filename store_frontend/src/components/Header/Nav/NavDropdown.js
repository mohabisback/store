import NavItem from "./NavItem";
const NavDropdown = ({ submenu, dropdown, depthLevel, resetNav, setResetNav}) => {

  depthLevel = depthLevel + 1;
  const dropdownClass = depthLevel > 1 ? " second" : "";
  return (
    <div className={`nav-dropdown${dropdownClass} ${dropdown ? " show" : ""}`}>
       <ul >
       {submenu.map((item, index) => (
        <NavItem item={item} key={index} depthLevel={depthLevel} resetNav={resetNav} setResetNav={setResetNav}/>
       ))}
       <div className={"nav-arrow"}></div>
      </ul>
    </div> 
 );
};

export default NavDropdown;