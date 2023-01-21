import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import CartItemsContext from '../../../globals/contexts/CartItemsContext';
import styled from 'styled-components';

const Cart = () => {
  const { cartItemsCount } = React.useContext(CartItemsContext);

  return (
    <ScContainer className='cart-container'>
      <FontAwesomeIcon
        icon={'cart-shopping'}
        size='2x'
      />
      <ScCartCount className='cart-count'>{cartItemsCount}</ScCartCount>
    </ScContainer>
  );
};
const ScContainer = styled.div`
  position: relative;
  display: block;
  height: auto;
`;
const ScCartCount = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  font-size: 11px;
  border-radius: 50%;
  background: #d60b28;
  width: 16px;
  height: 16px;
  line-height: 16px;
  display: block;
  text-align: center;
  color: white;
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
`;

export default Cart;
