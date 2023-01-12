import BurgerItem from "./BurgerItem";
const BurgerDropdown = ({ submenu, dropdown, depthLevel, resetBurger, setResetBurger}) => {

  depthLevel = depthLevel + 1;
  const dropdownClass = depthLevel > 1 ? "second" : "";
  return (
    <div className={`burger-dropdown ${dropdownClass} ${dropdown ? "show" : ""}`}>
       <ul >
       {submenu.map((item, index) => (
        <BurgerItem item={item} key={index} depthLevel={depthLevel} resetBurger={resetBurger} setResetBurger={setResetBurger}/>
       ))}
       <div className={"burger-arrow"}></div>
      </ul>
    </div> 
 );
};

export default BurgerDropdown;