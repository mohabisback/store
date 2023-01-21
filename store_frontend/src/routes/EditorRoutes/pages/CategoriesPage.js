import React from 'react';
import CategoriesContext from '../../../globals/contexts/CategoriesContext';
import CategoriesDS from '../../../services/axios/CategoriesDS';
import { useDialog } from '../../../globals/contexts/DialogContext';

const CategoriesPage = () => {

  const {categories} = React.useContext(CategoriesContext)

  return (
    <>
      <h1>Categories</h1>
      <StateCategoryRow/>
      {categories.map((i,n)=> <ContextCategoryRow key={n} renderState={i}/>)}
      
    </>
  )
};

//uncontrolled category row, for display or delete
const ContextCategoryRow = ({renderState}) =>{
  const [edit, setEdit] = React.useState(false)
  const {dialog} = useDialog()
  const editCategory=(e)=>{
    setEdit(true)
  }
  const deleteCategory=async(e)=>{
      const response = await dialog(`Sure you want to delete "${renderState.title}" category?`, 'Yes, delete', 'No, cancel');
      if (response) {
        CategoriesDS.deleteOne(renderState.title)    
        .then((result)=>{
        }).catch((err)=>{
        })
      } else {
      }
  }
  
  return (edit ?
    <StateCategoryRow initialState={renderState} setMeOn={setEdit} />
    :
    <form >
      <CategoryInputs values={renderState} onChange={null}/>
      <>
      <button
        className='form-ok-button'
        name='ok-button'
        type='button'
        onClick={editCategory}
        //submit is handled in the form
      >
        Edit
      </button>
      <button
        className='form-delete-button'
        name='delete-button'
        type='button'
        onClick={deleteCategory}
        //submit is handled in the form
      >
        Delete
      </button>
      </>
    </form>
  )
}

//controlled category row, for add or edit
const StateCategoryRow = ({initialState, setMeOn}) =>{
  const editOrNot = initialState ? true : false
  const [values, setValues] = React.useState(initialState)
  function onChange(e) {
      const { name, value, type, checked } = e.target;
      setValues((values) => ({ ...values, [name]: (type === 'checkbox') ? checked : value }));
  }
  function addCategory(e) {
    CategoriesDS.addOne(values)
      .then((result)=>{
        //categories are handled in setContexts
        setValues(undefined)
      })
      .catch((err)=>{
      })
  }
  function updateCategory(e) {
    
    CategoriesDS.update(initialState.title, values)
      .then((result)=>{
        //categories are handled in setContexts
        setMeOn(false)
      })
      .catch((err)=>{
      })
  }
  function cancelEdit(e) {
    setMeOn(false)
  }
  return (
    <form>
      <CategoryInputs values={values} onChange={onChange}/>
      {editOrNot &&
      <>
        <button
          className='form-ok-button'
          name='ok-button'
          type='button'
          onClick={updateCategory}
          //submit is handled in the form
        > Ok
        </button>
        <button
          className='form-cancel-button'
          name='ok-button'
          type='button'
          onClick={cancelEdit}
          //submit is handled in the form
        >Cancel
        </button>
      </>
      }
      {editOrNot ||
      <>
        <button
          className='form-add-button'
          name='add-button'
          type='button'
          onClick={addCategory}
          //submit is handled in the form
        > Add
        </button>
      </>
      }
    </form>
  )
}

const CategoryInputs = ({values, onChange}) => {
  const readonly = onChange ? false : true;

  return (<>
    <input
      className='form-text'
      type='text'
      placeholder='add new...'
      name='title'
      value={(values && values.title) ? values.title : ''}
      onChange={onChange}
      readOnly={readonly}
      required
    />    
    <input
      className='form-checkbox'
      type='checkbox'
      name='forbidden'
      onChange={onChange}
      readOnly={readonly}
      checked={(values && values.forbidden) ? values.forbidden : false}
    />
    <input
      className='form-checkbox'
      type='checkbox'
      name='hidden'
      onChange={onChange}
      readOnly={readonly}
      checked={(values && values.hidden) ? values.hidden : false}
    />
  </>)
}


export default CategoriesPage;
