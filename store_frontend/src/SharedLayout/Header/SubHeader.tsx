import React from 'react';
import styled from 'styled-components'
import NavBar from './NavBar'
import CategoriesContext from '../../contexts/CategoriesContext';
import { TyNavObject } from './NavItem';
import { FaAngleDoubleRight, FaEdit, FaInfoCircle, FaUserNinja } from 'react-icons/fa';
import PxIcon from '../../styles/Pxs/PxIcon';
import { MdAddTask, MdAdminPanelSettings, MdCategory, MdMedicalServices, MdPersonAddDisabled, MdSchema } from 'react-icons/md';

const SubHeader = () => {
  const adminBarRef = React.useRef<HTMLUListElement>(null)
  const categoriesBarRef = React.useRef<HTMLUListElement>(null)

  const {categories} = React.useContext(CategoriesContext)

  return (
    <ScSubHeader style={{zIndex:1}}>
      <NavBar
        barRef={adminBarRef} 
        items={adminItems}
        width={35} //percent of the remaining after observeRefs
        //observeRefs={[adminBarRef]}
        scale={1}
        roles={['owner', 'admin', 'editor', 'service','user']}
        moreIcon={<PxIcon as={FaAngleDoubleRight}/>}
      />
      <NavBar
        barRef={categoriesBarRef}
        items={categories}
        width={100} //percent of the remaining after observeRefs
        observeRefs={[adminBarRef]}
        scale={1}
        //roles={['owner', 'admin', 'editor', 'service','user']}
        moreIcon={<PxIcon as={FaAngleDoubleRight}/>}
      />
    </ScSubHeader>
  )
}
export default SubHeader

const ScSubHeader = styled.div`
  padding: 2px;
  width: 100%;
  display: flex; flex-direction: row;
  justify-content: flex-start; align-items: center;
`
const adminItems:TyNavObject[]=[
  {title:'About', icon:<PxIcon as={FaInfoCircle}/>, to:'/about'},
  {title:'Admin',  icon:<PxIcon as={MdAdminPanelSettings}/>, roles:['owner','admin'], submenu:[
    {title:'Schemas', icon:<PxIcon as={MdSchema}/>, to:'/admin/schemas'},
    {title:'Roles', icon:<PxIcon as={FaUserNinja}/>, to:'/admin/roles'},
  ]},
  {title:'Editor',  icon:<PxIcon as={FaEdit}/>, roles:['owner','admin','editor'], submenu:[
    {title:'Add Product', icon:<PxIcon as={MdAddTask}/>, to:'/editor/add-product'},
    {title:'Categories', icon:<PxIcon as={MdCategory}/>, to:'/editor/categories'},
  ]},
  {title:'Service',  icon:<PxIcon as={MdMedicalServices}/>, roles:['owner','admin','service'], submenu:[
    {title:'Chat', icon:<PxIcon as={MdAddTask}/>, to:'/service/customer-chat'},
  ]},
]