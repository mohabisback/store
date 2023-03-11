import React from 'react';
import CartItemsContext from '../../contexts/CartItemsContext';
import styled,{css} from 'styled-components';
import { MdShoppingCart } from 'react-icons/md';
import PxDiv from '../../styles/Pxs/PxDiv'
import PxIcon from '../../styles/Pxs/PxIcon'
import PxBar from '../../styles/Pxs/PxBar'
import PxNavLink from '../../styles/Pxs/PxBarLink'
import { FaShoppingCart } from 'react-icons/fa';

type Props = {
  scale:number
}
const Cart = ({scale}:Props) => {
  const { cartItemsCount } = React.useContext(CartItemsContext);

  return (
    <PxBar className='cart-container'
      pxLevel={1}
      pxScale={scale} pxFontScale={scale}
    >
      <li>
        <PxNavLink to='/cart'
          pxScale={scale}pxFontScale={scale}
        >
          <ScIcon as={FaShoppingCart} />
          
          <ScCartCount
            pxScale={scale} pxFontScale={scale} pxPadding={0}
          >{cartItemsCount}</ScCartCount>
        </PxNavLink>
      </li>
    </PxBar>
  );
};
const ScIcon = styled(PxIcon)`
${({theme})=>{
const x = theme.fontSize * 2
return css`
font-size:${x}px;
height:${x}px;
`}}
`
const ScCartCount = styled(PxDiv)`
  position: absolute;
  display: flex; flex-flow: row nowrap;
  justify-content: center; align-items:flex-start;
  top: 0; bottom: 0;
  left: 0; right: 0;
  z-index: 2;
  ${({theme})=>theme.style.head}
  background: transparent;
`;

export default Cart;
