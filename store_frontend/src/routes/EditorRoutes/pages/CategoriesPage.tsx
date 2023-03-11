import React from 'react';
import {TyCell} from '@backend/schemas'
import CategoriesContext from '../../../contexts/CategoriesContext';
import Table from '../../../components/Table';
import schemas from '../schemas'
const {categories: categoriesSchema} = schemas

const CategoriesPage = ()=>{
  const {categories} = React.useContext(CategoriesContext)
  return (
    <Table
      name={'categories'}
      title={'Categories'}
      rowSchema={categoriesSchema}
      values={categories}
    ></Table>
  )
}


export default CategoriesPage;