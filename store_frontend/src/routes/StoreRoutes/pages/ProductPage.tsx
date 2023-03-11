import React from 'react';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { product } = useParams(); 
  
  return <div>Product -{product}- Page</div>;
};

export default ProductPage;
