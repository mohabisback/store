import React from 'react';
import {TyCell} from '@backend/schemas'
import TablesContext from '../../../contexts/TablesContext';
import CategoriesContext from '../../../contexts/CategoriesContext';
import Table from '../../../components/Table';

//row schema of schemas table
const rowSchema:TyCell[] = [
  {name:'id', type:'number', required:false, noRepeat:true, seeRole:'editor', editRole:'none'},
  {name:'title', type:'text', required:true, noRepeat:true, seeRole:'', editRole:'editor'},
  {name:'forbidden', type:'boolean', required:false, noRepeat:false, seeRole:'editor', editRole:'editor'},
  {name:'hidden', type:'boolean', required:false, noRepeat:false, seeRole:'editor', editRole:'editor'},
]

const SchemasPage = ()=>{
  const {tables} = React.useContext(TablesContext)

  return (
    <></>
  )
}

export default SchemasPage;
