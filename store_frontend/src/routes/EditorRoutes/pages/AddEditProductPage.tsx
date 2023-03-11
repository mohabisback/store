import React from 'react';
import styled from 'styled-components'
import MessageContext from '../../../contexts/MessageContext';
import TooltipContext from '../../../contexts/TooltipContext';
import ThemeContext from '../../../contexts/ThemeContext';
import SignedUserContext from '../../../contexts/SignedUserContext';
import DS from '../../../services/axios/DS';
import PxButton from '../../../styles/Pxs/PxButton';
import PxDiv from '../../../styles/Pxs/PxDiv';
import PxForm from '../../../styles/Pxs/PxForm';
import PxInput from '../../../styles/Pxs/PxInput';
import PxLabel from '../../../styles/Pxs/PxLabel';
import AuthorizeFn from '../../../utils/AuthorizeFn';
import schemas from '../schemas'
import PxIcon from '../../../styles/Pxs/PxIcon';
import { MdDelete, MdImageAspectRatio } from 'react-icons/md';
import { FaArrowLeft, FaCheckCircle, FaFirstOrder } from 'react-icons/fa';
import UploadDS from '../../../services/axios/uploadDS';
import { useCropper } from '../../../contexts/CropperContext';
const {products: productsSchema} = schemas
const tableName = 'products'
const imagesUrl = (url:string):string =>{
  url = url.replace('@backend', 'http://localhost:5000/files')
  return url
}
type Props = {initialState?:{id?:number}}
const AddEditProductPage = ({initialState}:Props) => {
  const {theme} = React.useContext(ThemeContext)
  const { signedUser } = React.useContext(SignedUserContext);
  const {message} = React.useContext(MessageContext)
  const {tooltip} = React.useContext(TooltipContext)
  const {cropper} = useCropper()

  const schema = productsSchema.filter(v=>AuthorizeFn(v.seeRole))
  
  const emptyState = React.useCallback(():{id?:number} => {
    const state = {}
    //@ts-ignore
    schema.forEach(v=>{state[v.name] = (v.type==='boolean') ? false : ''})
    return {...state}
  },[schema]) 
  
  const [values, setValues] = React.useState(initialState ? initialState : emptyState())
  function onChange(ev:React.ChangeEvent<HTMLInputElement>) {
      const { name, value, type, checked } = ev.target;
      console.log('onChange')
      setValues((values) => ({ ...values, [name]: (type === 'checkbox') ? checked : value }));
  }
  
  const onAddUpdate = (ev:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const {name} = ev.target as HTMLButtonElement;
    //check required, return if one missing
    for (let v of schema.filter(v=>v.required === true)){
      if ((v.type === 'image' && images[parseInt(v.name.substring(5))]) ||
      //@ts-ignore
      (values[v.name] && values[v.name] !== '') ){
      } else {
        message(`${v.name} is a required field.`, `Missing Fields.`)
        return;
      }
    }
    //check all images are uploaded
    if (images.findIndex(v=>typeof v !== 'string') < 0) {
      if (name === 'add'){addNow(values)}else{updateNow(values)}
      return;
    }
    //upload images
    images.forEach((img,n)=>{
      if (typeof img !== 'string'){
        const image:File = img as File //image object for typescript shit
        const formData = new FormData()
        //append & rename
        const uploadingName = image.size.toString()+'_'+image.lastModified.toString()+'_'+image.name
        formData.append('file', image as File, uploadingName)
        UploadDS.uploadToMongo(formData, uploadingName)
        .then(response=>{
          if (response.data.message) console.log(response.data.message);message(response.data.message)
          if (response.data.url) { //upload succeeded with url
            setImages(images=>{
              images.splice(n,1,response.data.url) //set the new src={url}
              if (images.findIndex(v=>typeof v !== 'string') > -1){ //check if it was not last one
                message('image'+n.toString()+' uploaded')
              } else { // it was last one
                message('all images uploaded, adding product...')  
                setValues(values=>{
                  //@ts-ignore
                  images.forEach((image,n)=>{values['image'+n] = image})
                  //values must be used from here, or it will shit
                  if (name === 'add'){addNow(values)}else{updateNow(values)}
                  return values
                })
              }
              return images
            })           
          }
        }).catch(err=>{
          message(err?.response?.data?.message || err.message || 'Failed','Failed',{color:'red'})
        })
      }
    })
  }
  const addNow = (values:{id?:number}) => {
    DS.addOne(tableName, values)
    .then((result)=>{ 
      message(result.data.message || 'Succeeded', 'Succeeded', {color:'teal'})
      setValues(emptyState())
      setImages([])
    })
    .catch((err)=>{
      message(err.response?.data?.message || err.message || 'Failed', 'Failed', {color: 'red'})
    })
  }

  function updateNow(values:{id?:number}) {
    if(initialState && initialState.id){
      DS.update(tableName, initialState.id, values)
      .then((result)=>{
        //setMeOn && setMeOn(false)
        message(result.data.message || 'Succeeded', 'Succeeded', {color:'teal'})})
      .catch((err)=>{ message(err.response?.data?.message || err.message || 'Failed', 'Failed', {color: 'red'})})
    }
  }
  function onCancelEdit() {
    //setMeOn && setMeOn(false)
  }

  const setInitImages = React.useCallback(():(File|string)[] => {
    let myImages:(File|string)[] = []
    schema.forEach(v=>{
      //@ts-ignore
      if(v.type === 'image' && values[v.name] && values[v.name].length > 0){
        //@ts-ignore
        myImages = [...myImages, values[v.name]]
      }
    })
    return myImages
  },[schema, values])

  const [images, setImages] = React.useState<(File|string)[]>(setInitImages())
  const [drag, setDrag] = React.useState(false)
  const [maxImages] = React.useState(schema.filter(v=>v.type==='image').length)
  const filesInputRef = React.useRef<HTMLInputElement|null>(null)
  
  const onAddImages = React.useCallback((inputFiles:FileList|null)=>{
    if (inputFiles){ //if opening input returned with files
      console.log('inputFiles')
      Array.from(inputFiles).forEach((file,n)=>{ //for each file returned
        console.log('file:',n)
        //if not already exists, add to files state
        if(!file.type.startsWith('image/')){
          console.log('is image')
          message('One or more file is not an image.')
        } else {
          setImages(images=>{
            if (images.findIndex(f=>(
                typeof f !== 'string' && file.name === f.name && file.size === f.size)||
                (typeof f === 'string' && f.includes(file.name) &&
                f.includes(file.size.toString()) &&
                f.includes(file.lastModified.toString())
              )) >= 0){
              console.log('One or more files is already added.')
              message('One or more files is already added.')
              return images
            } else if (images.length >= maxImages){
              console.log(`You can't add more`)
              message(`You cant add more than ${maxImages} images, delete first.`)
              return images
            } else {
              console.log('adding image')
              return [...images, file] //new array to re-render
            }
          })
        }
      })
    } 
  },[])
  return (
    <ScForm pxLevel ={2} pxGap={1}
      {...(drag ? {style:{backgroundColor:'gray'}}:{})}
      onDragEnter={(ev)=>{ev.preventDefault(); setDrag(true)}}
      onDragOver={(ev)=>{ev.preventDefault(); setDrag(true)}}
      onDragExit={(ev)=>{ev.preventDefault(); setDrag(false)}}
      onDragLeave={(ev)=>{ev.preventDefault(); setDrag(false)}}
      onDrop={(ev)=>{ev.preventDefault(); setDrag(false); onAddImages(ev.dataTransfer.files)}}
    >
      <input
        ref={filesInputRef}
        style={{display:'none'}}
        type='file'
        accept='image/*'
        multiple
        onChange={(ev)=>{ onAddImages(ev.target.files)}}
      />
      <>
      {schema.map(v=>{
        let labelStyle:{} = {width:'100%'}
        let inputStyle:{} = {flex:'auto'}
        if (v.type === 'boolean' || v.type === 'number'){
          labelStyle = {...labelStyle, width:'48%'}
          inputStyle = {...inputStyle, minWidth:(theme.fontSize*5).toString()+'px'}
        } else if (v.type === 'textarea'){
          inputStyle = {...inputStyle, minWidth:(theme.width*0.8).toString()+'px',
          height: '20vh', overflowY: 'auto', whiteSpace: 'pre'}
        } else {
          inputStyle = {...inputStyle, minWidth:Math.min(theme.fontSize*20, theme.width*0.8).toString()+'px'}
        }
        const imgNum = parseInt(v.name.substring(5))
        const imgSrc = !images[imgNum] ? '': (typeof images[imgNum] === 'string' ?
              imagesUrl(images[imgNum] as string) : URL.createObjectURL(images[imgNum] as File))
              
        if (v.type === 'image'){
          return (
            <PxDiv style={{position: 'relative', width:'100px', height:'100px'}}
            onClick={()=>{
              console.log('image clicked')
              if(filesInputRef.current && imgNum >= images.length)filesInputRef.current.click()
            }}
            >
            <img
              alt={v.name}
              crossOrigin="anonymous"
              style={{width:'100%', height:'100%'}}
              src={imgSrc}
              onMouseOver={(ev)=>{
                if(imgSrc === '') return;
                tooltip(ev, 'click to crop or resize this image')
              }}
              onClick={(ev)=>{
                if(imgSrc === '') return;
                ev.preventDefault(); ev.stopPropagation();
                if(filesInputRef.current) filesInputRef.current.files = null
                cropper(imgSrc, 1).then(file=>{
                  if(file) setImages(files=>{files.splice(imgNum, 1, file); return [...files]})
                })
              }}
            />
            {images[imgNum] && <>
              <PxIcon as={MdDelete}
                style={{position:'absolute', right:'0', top:'0', color:'red'}}
                onMouseOver={(ev)=>{tooltip(ev, 'delete this image')}}
                
                onClick={(ev)=>{
                  ev.preventDefault(); ev.stopPropagation();
                  if(filesInputRef.current) filesInputRef.current.files = null
                  setImages(files=>{files.splice(imgNum, 1); return files})
                }}
              />
              <PxIcon as={imgNum > 0 ? FaArrowLeft: FaFirstOrder} 
                style={{position:'absolute', right:'0', bottom:'0', color:'green'}}
                onMouseOver={(ev)=>{tooltip(ev, imgNum > 0 ? 'set as Main image':'main image')}}
                onClick={(ev)=>{
                  ev.preventDefault(); ev.stopPropagation();
                  if(imgNum>0) setImages(files=>[...files.splice(imgNum, 1),...files])
                }}
              />
              {images[imgNum] && typeof images[imgNum] === 'string' &&
                <PxIcon as={FaCheckCircle} 
                style={{position:'absolute', left:'0', bottom:'0', color:'green'}}
                onMouseOver={(ev)=>{tooltip(ev, 'already uploaded image')}}
              />}
            </>} 
            </PxDiv>
          )
        } else {
          return (
            <ScLabel pxLevel={1} style={labelStyle}>
              <span>{v.name}{v.required ? '*':''}{': '}</span>
              <ScInput 
                as={v.type==='textarea' ? 'textarea':'input'}
                style={inputStyle}
                name={v.name}
                type={v.type === 'boolean' ? 'checkbox' : v.type}
                required={v.required}
                disabled={!AuthorizeFn(v.editRole)}
                onChange={onChange}
                //@ts-ignore
                value={values[v.name]}
                //@ts-ignore
                checked={values[v.name]}
              />
          </ScLabel>
        )}}
        
        )}

      <ScFooter>
        <>
        {initialState &&
        <>
          <PxButton name={'update'} onClick={onAddUpdate}>Update</PxButton>
          <PxButton onClick={onCancelEdit}>Cancel</PxButton>
        </>
        }
        {initialState ||
          <PxButton name={'add'} onClick={onAddUpdate} color={'teal'}>Add</PxButton>
        }
        </>
      </ScFooter>
      </>
    </ScForm>
  )
};

export default AddEditProductPage;
const ScForm = styled(PxForm)`
display:flex; flex-flow: row wrap;
justify-content: space-between; align-content: flex-start;
`
const ScLabel = styled(PxLabel)`
  display:flex; flex-flow:row wrap;
  justify-content: flex-start; align-items: center;
`
const ScInput = styled(PxInput)`
  min-width: ${({theme})=>(`${theme.fontSize*5}px`)};
`
const ScFooter = styled(PxDiv)`
  width: 100%;
  display:flex; flex-flow: row nowrap; row-gap: 1%;
  justify-content: flex-end; align-items: center;
  
`