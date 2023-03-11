//to be completed 

import React, { createContext, useReducer } from 'react';
import DS from '../services/axios/DS';
import {TyCell} from '@backend/schemas'

export type TyTable = {
  name:string,
  schema:TyCell[], //row of cells schema
  values:any[],
}

type State = {
  tables: TyTable[],
  addTable: Function,
  editTable: Function,
  deleteTable: Function,
}

type Action = {
  type: string,
  payload: TyTable
}

const getLocalStorage = ():TyTable[] =>{
  const local: string|null = window.localStorage.getItem('tables')
  return local ? (JSON.parse(local) as TyTable[]) : []
}

export const initialState:State = {
  tables: getLocalStorage(),
  addTable:()=>{},
  editTable:()=>{},
  deleteTable:()=>{},
};

const TablesContext = createContext(initialState);

export const TablesReducer = (state:State, action:Action) => {
  const { type, payload } = action;
  let newState:State;
  switch (type) {
    case 'ADD_TABLE':
      newState = {
        ...state,
        tables: [...state.tables, payload as TyTable,]
      }
      break;
    case 'EDIT_TABLE':
      let editTable = state.tables.find(v=>v.name===payload.name)
      if (editTable){
        editTable = {...editTable, ...{payload}}
      }
      newState = {...state}
      break;
    case 'DELETE_TABLE':
      let tables = state.tables.filter(v=>v.name!==payload.name)
      newState = {...state, tables}
      break;
    default:
      newState = state;
      break;
    }
    return newState;
};

export const ExternalTablesReducer = {
  isReady: false,
  //state: null,
  getState: () => {
    console.error('ExternalTablesReducer is NOT ready');
  },
  dispatch: (action:Action) => {
    console.error('ExternalTablesReducer is NOT ready');
  },
};

//The global telegram for the engineers
export const TablesProvider = ({ children }:{children:React.ReactNode}) => {
  //connecting cables with reducer(engineers downstairs)
  const [state, dispatch] = useReducer(TablesReducer, initialState);

  const stateRef = React.useRef(initialState);
  React.useEffect(() => {
    stateRef.current = state;
    //ExternalTablesReducer.state = state
  }, [state]);
  if (!ExternalTablesReducer.isReady) {
    ExternalTablesReducer.isReady = true;
    //ExternalTablesReducer.state = state
    ExternalTablesReducer.getState = () => ({ ...stateRef.current });
    ExternalTablesReducer.dispatch = (params) => dispatch(params);
    Object.freeze(ExternalTablesReducer);
  }

  const providedValue:State = {
    tables: state.tables,
    addTable: (table:TyTable) => {dispatch({ type: 'ADD_TABLE', payload:table });},
    editTable: (table:TyTable) => {dispatch({ type: 'EDIT_TABLE', payload:table });},
    deleteTable: (table:TyTable) => {dispatch({ type: 'DELETE_TABLE', payload:table });},
  };

  //initial requests
  React.useEffect(()=>{
    state.tables.forEach(v=>{
        DS.getMany(v.name)
    })
  },[])

  //connecting cables with the captain
  return <TablesContext.Provider value={providedValue}>{children}</TablesContext.Provider>;
};

export default TablesContext;
