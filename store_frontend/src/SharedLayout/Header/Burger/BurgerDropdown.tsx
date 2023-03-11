
import { TyNavObject } from '../NavItem';
import BurgerItem from './BurgerItem';

type Props = {
  submenu: TyNavObject[],
  isDropped: boolean,
  depthLevel: number,
  resetBurger: object,
  setResetBurger: Function
}
const BurgerDropdown = ({submenu, isDropped, depthLevel, resetBurger, setResetBurger }:Props) => {
  depthLevel = depthLevel + 1;
  const dropdownClass = depthLevel > 1 ? 'second' : '';
  return (
    <div className={`burger-dropdown ${dropdownClass} ${isDropped ? 'show' : ''}`}>
      <ul>
        {submenu.map((i:TyNavObject, n:number) => (
          <BurgerItem
            item={i}
            key={n}
            depthLevel={depthLevel}
            resetBurger={resetBurger}
            setResetBurger={setResetBurger}
          />
        ))}
        <div className={'burger-arrow'}></div>
      </ul>
    </div>
  );
};

export default BurgerDropdown;
