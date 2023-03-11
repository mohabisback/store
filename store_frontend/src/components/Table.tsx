import React from 'react';
import {TyCell} from '@backend/schemas'
import TablesContext from '../contexts/TablesContext';
import DS from '../services/axios/DS';
import {useDialog, EnDialogResponse } from '../contexts/DialogContext';
import MessageContext from '../contexts/MessageContext';
import { PxH3, PxH4 } from '../styles/Pxs/PxH';
import { PxTable, PxTh, PxTr, PxTd } from '../styles/Pxs/PxTable';
import PxButton from '../styles/Pxs/PxButton';
import PxInput from '../styles/Pxs/PxInput';
import AuthorizeFn from '../utils/AuthorizeFn';
import { useNavigate } from 'react-router-dom';
import { isFocusable } from '@testing-library/user-event/dist/utils';
  
type TableProps = {name:string, title:string, rowSchema:TyCell[], values:any[], link?:string}
const Table = ({name, title, rowSchema, values, link}:TableProps) => {
  const seenSchema = rowSchema.filter(v=>AuthorizeFn(v.seeRole))
  const heads = seenSchema.map(v=>v.name)

  return (
    <div style={{width: '100%', overflowX:'scroll', scrollBehavior:'smooth'}}>
      <PxTable>
        <PxTr>
          <PxTh colSpan={2}><PxH3>{title}</PxH3></PxTh>
          {heads.map(v=>(
            <PxTh><PxH4>{v}</PxH4></PxTh>
          ))}
        </PxTr>
        <ChangeableRow schema={seenSchema} tableName={name}/>
        {values.map((i,n)=>(
        <ReadOnlyRow key={n}
          renderState={i}
          schema={seenSchema}
          tableName={name}
          link={link}
        />
        ))}
      </PxTable>
    </div>
  )
};

//uncontrolled category row, for display or delete
type ReadOnlyProps = {renderState:{id:number}, schema:TyCell[], tableName:string, link?:string}
const ReadOnlyRow = ({renderState, schema, tableName, link}:ReadOnlyProps) =>{
  const navigate = useNavigate();
  if(link) link = link.endsWith('/') ? link : (link+'/')

  const [edit, setEdit] = React.useState(false)
  const {dialog} = useDialog()
  const {message} = React.useContext(MessageContext);
  const onEdit=()=>{
    setEdit(true)
  }
  const onDelete=async()=>{
      const response = await dialog({
        bodyText:`Sure you want to delete this row?`,
        headText:'Are you sure', attrs: {color:'red'},
        yesText:'Delete', cancelText:'Cancel', cancelAttrs: {primary: true},
      });
      if (response ===EnDialogResponse.yes && renderState?.id) {
        DS.deleteOne(tableName, renderState.id as number, renderState)
          .then((result)=>{ message(result.data.message || 'Succeeded', 'Succeeded', {color:'teal'})})
          .catch((err)=>{ message(err.message || 'Failed', 'Failed', {color: 'red'})})
      }
  }
  return (edit ?
    <ChangeableRow initialState={renderState} setMeOn={setEdit} schema={schema} tableName={tableName}/>
    :
    <PxTr>
      <PxTd>
        <PxButton onClick={onDelete} color={'red'}>Delete</PxButton>
      </PxTd>
      <PxTd>
        <PxButton onClick={onEdit}>Edit</PxButton>
      </PxTd>
      <Inputs schema={schema} values={renderState} onChange={undefined}/>
      {link && <PxTd>
        <PxButton color={'yellow'}
        onClick={()=>{navigate(link + renderState.id.toString());}}
        >Details</PxButton>
      </PxTd>}
    </PxTr>
  )
}

//controlled category row, for add or edit
type Props = {initialState?:{id?:number}, setMeOn?: Function, schema:TyCell[], tableName:string}
const ChangeableRow = ({initialState, setMeOn, schema, tableName}:Props) =>{
  const {message} = React.useContext(MessageContext);

  const emptyState = React.useCallback(():{id?:number} => {
    const state = {}
    //@ts-ignore
    schema.forEach(v=>{state[v.name] = (v.type==='boolean') ? false : ''})
    return state
  },[schema])

  const [values, setValues] = React.useState(initialState ? initialState : emptyState())
  function onChange(ev:React.ChangeEvent<HTMLInputElement>) {
      const { name, value, type, checked } = ev.target;
      setValues((values) => ({ ...values, [name]: (type === 'checkbox') ? checked : value }));
  }
  function onAdd() {
    DS.addOne(tableName, values)
    .then((result)=>{ 
      setValues(emptyState())
      message(result.data.message || 'Succeeded', 'Succeeded', {color:'teal'})})
    .catch((err)=>{
      message(err.response?.data?.message || err.message || 'Failed', 'Failed', {color: 'red'})
    }) 
  }
  function onUpdate() {
    if(initialState && initialState.id ){
      DS.update(tableName, initialState.id, values)
      .then((result)=>{
        setMeOn && setMeOn(false)
        message(result.data.message || 'Succeeded', 'Succeeded', {color:'teal'})})
      .catch((err)=>{ message(err.response?.data?.message || err.message || 'Failed', 'Failed', {color: 'red'})})
    }
  }
  function onCancelEdit() {
    setMeOn && setMeOn(false)
  }
  return (
    <PxTr>
      <>
      {initialState &&
      <>
        <PxTd>
          <PxButton onClick={onUpdate}>Update</PxButton>
        </PxTd>
        <PxTd>
          <PxButton onClick={onCancelEdit}>Cancel</PxButton>
        </PxTd>
      </>
      }
      {initialState ||
      <>
        <PxTd colSpan={2}>
        <PxButton onClick={onAdd} style={{width:'100%'}} color={'teal'}>Add</PxButton>
        </PxTd>
      </>
      }
      <Inputs values={values} onChange={onChange} schema={schema}/>
    </>
    </PxTr>
  )
}

type InputsProps = {values:object,
  onChange:React.ChangeEventHandler<HTMLInputElement>|undefined,
  schema:TyCell[]}
const Inputs = ({values, onChange, schema}:InputsProps) => {
  
  return (<>{schema.map(v=>{
    //@ts-ignore
    const value:any|undefined = values[v.name]
    const valueObj = (!value) ? {} : (v.type === 'boolean') ? {checked:value}:{value}

    return (
      <PxTd>
        <PxInput
          name={v.name}
          type={v.type === 'boolean' ? 'checkbox' : v.type}
          required={v.required}
          disabled={!AuthorizeFn(v.editRole)}
          onChange={onChange}
          {...(v.required ? {onLoad:onChange}: {})}
          readOnly={onChange? false:true}
          {...valueObj}
        />
      </PxTd>
    )})}</>)
}

export default Table