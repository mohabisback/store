import React from 'react';
import { FaSearch } from 'react-icons/fa';
import PxBar from '../../../styles/Pxs/PxBar'
import PxInput from '../../../styles/Pxs/PxInput'
import PxButton from '../../../styles/Pxs/PxButton'

type Props = {
  scale:number
}
const SearchBar = ({scale}:Props) => {

  return (
      <PxBar 
        pxScale={scale} pxFontScale={scale} 
        style={{flex:'auto'}}>
          <li>
        <PxButton
        pxScale={scale} pxFontScale={scale}>
          <FaSearch/>
        </PxButton>
        </li>
        <li style={{flex:'auto'}}>
        <PxInput style={{width:'100%'}}
        pxScale={scale} pxFontScale={scale}>

        </PxInput>
        </li>
        <li>
        <PxButton
        pxScale={scale} pxFontScale={scale}>
        All
        </PxButton>
        </li>
      </PxBar>
  );
};

export default SearchBar;
