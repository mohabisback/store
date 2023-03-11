import React from 'react';
import BurgerItem from './BurgerItem';
import { FaAngleDoubleDown } from 'react-icons/fa';
import useDrop from '../../../hooks/useDrop';
import PxDiv from '../../../styles/Pxs/PxDiv'
type Props = {
  scale: number
}
const Burger = ({scale}:Props) => {
  const [resetBurger, setResetBurger] = React.useState({});

  const{elRef, isDropped, setIsDropped } = useDrop(resetBurger)

  return (
    <> 
      <PxDiv
        pxScale={scale} pxFontScale={scale}
        className={`burger-icon${isDropped ? ' checked' : ''}`}
        onClick={() => {
          setIsDropped((state) => !state);
        }}
      >
        <div className={`burger-icon-1${isDropped ? ' checked' : ''}`}></div>
        <div className={`burger-icon-2${isDropped ? ' checked' : ''}`}></div>
        <div className={`burger-icon-3${isDropped ? ' checked' : ''}`}></div>
      </PxDiv> 

      <div
        ref={elRef}
        className={`burger-container${isDropped ? ' checked' : ''}`}
      >

      </div>
    </>
  );
};

export default Burger;
