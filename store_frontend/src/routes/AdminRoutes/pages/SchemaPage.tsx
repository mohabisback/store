import React from 'react';
import { useParams } from 'react-router-dom';
import {TyCell} from '@backend/schemas'
import TablesContext from '../../../contexts/TablesContext';
import Table from '../../../components/Table';

//row schema of schemas table
const rowSchema:TyCell[] = [
  {name:'name', type:'text', required:true, noRepeat:true, seeRole:'admin', editRole:'admin'},
  {name:'type', type:'text', required:true, noRepeat:false, seeRole:'admin', editRole:'admin'},
  {name:'required', type:'boolean', required:true, noRepeat:false, seeRole:'admin', editRole:'admin'},
  {name:'noRepeat', type:'boolean', required:true, noRepeat:false, seeRole:'admin', editRole:'admin'},
  {name:'seeRole', type:'text', required:true, noRepeat:false, seeRole:'admin', editRole:'admin'},
  {name:'editRole', type:'text', required:true, noRepeat:false, seeRole:'admin', editRole:'admin'},
]
//schema are values
const values:TyCell[] = [
  {name:'id', type:'number', required:false, noRepeat:true, seeRole:'editor', editRole:'none'},
  {name:'title', type:'text', required:true, noRepeat:true, seeRole:'', editRole:'editor'},
  {name:'forbidden', type:'boolean', required:false, noRepeat:false, seeRole:'editor', editRole:'editor'},
  {name:'hidden', type:'boolean', required:false, noRepeat:false, seeRole:'editor', editRole:'editor'},
]
const SchemasPage = ()=>{
  const {id} = useParams();

  const {tables} = React.useContext(TablesContext)

  return (
    <Table
      name={'categories_schema'}
      title={'Categories Schema'}
      rowSchema={rowSchema}
      values={values}
    ></Table>
  )
}

export default SchemasPage;
