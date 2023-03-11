import React, {useState, useRef, useEffect, DependencyList} from 'react'
import { createPortal } from 'react-dom'
import ReactCrop, {
  centerCrop, makeAspectCrop, //helper functions
  Crop, PixelCrop, //types
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import styled from 'styled-components'
import { useCropper } from '../contexts/CropperContext'
import ThemeContext from '../contexts/ThemeContext'
import PxDiv from '../styles/Pxs/PxDiv'

// helper function to make and center a % aspect crop
function centerAspectCrop( width:number, height:number, aspect:number,) {
  return centerCrop(
    makeAspectCrop({unit: '%', width: 90,}, aspect, width, height),
    width, height)
}

export default function Cropper() {
  const {theme} = React.useContext(ThemeContext)
  const {cropperState, onFileCreation, onNameChange, onOk, onCancel} = useCropper();

  const [crop, setCrop] = useState<Crop>() //state of the crop
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [zoom, setZoom] = useState(100)
  const [rotate, setRotate] = useState(0)
  const [resize, setResize] = useState(100)
  const [aspect, setAspect] = useState(cropperState.aspect)
  const divRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const img2Ref = useRef<HTMLImageElement>(null)
  const [imgDim, setImgDim] = React.useState<{width:number, height:number}>({width:100, height:100})
  const [img2Dim, setImg2Dim] = React.useState<{width:number, height:number}>({width:100, height:100})

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const {naturalWidth, naturalHeight} = e.currentTarget
    setImgDim({width:naturalWidth, height: naturalHeight})
    if (divRef.current){
      const {width, height} = divRef.current.getBoundingClientRect()
      if (naturalWidth > width || naturalHeight > height){
        const zm = Math.min(width/naturalWidth, height/naturalHeight)
        setZoom(Math.floor(zm * 100))
      }
    }
    
    if (cropperState.aspect) { //center & aspect the crop
      const {width, height} = e.currentTarget
      setCrop(centerAspectCrop(width, height, cropperState.aspect))
    }
    setImgDim({width: naturalWidth, height:naturalHeight}) 
  }

  function onImage2Load(e: React.SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight, width, height } = e.currentTarget
    setImg2Dim({width: naturalWidth, height:naturalHeight})
    if (naturalWidth > width || naturalHeight > height){
      e.currentTarget.style.objectFit = 'contain'
    } else {
      e.currentTarget.style.objectFit = 'none'
    }
  }

  useDebounceEffect(
    async () => {
      if (completedCrop?.width && completedCrop?.height &&
        imgRef.current && canvasRef.current) {
        await canvasPreview(imgRef.current, canvasRef.current,
          completedCrop, zoom, resize, rotate)

        canvasRef.current.toBlob(blob=>{
          if(blob) {
            const file = new File([blob], (cropperState.fileName || 'newImage')+'.png' , { type: "image/png" })
            onFileCreation(file)
            if (img2Ref.current) {
              img2Ref.current.src = URL.createObjectURL(file)
            }
          }})
      }
    }, 100, [completedCrop, zoom, resize, rotate],
  )
  
  const Component = (!cropperState.show) ? null : (
    <ScOverlay
    style={{display:'flex', flexFlow:'column nowrap',}}
    >
      <div className="crop-controls"
        style={{display:'flex', flexFlow:'column nowrap',}}
      >
        <label>Name: <input
          type='text'
          value={cropperState.fileName || 'newImage'}
          onChange={(ev)=>{onNameChange(ev.target.value)}}
        /></label>
        <label>Zoom: <input
          type="number" step="5"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        /></label>
        <label>Resize: <input
          type="number" step="5"
          value={resize}
          onChange={(e) => setResize(Number(e.target.value))}
        /></label>
        <label>Rotate: <input
          type="number" step='5'
          value={rotate}
          onChange={(e)=> setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))}
        /></label>
        <label>Aspect: <input
          type="number"
          value={aspect}
          onChange={(e)=> {setAspect((e.target.value === '') ? undefined : Number(e.target.value))}}
        /></label>

        <label>Original dimensions: {imgDim.width.toString()}x{imgDim.height.toString()}</label>
        <label>New dimensions:{img2Dim.width.toString()}x{img2Dim.height.toString()}</label>
        <label>New size: {(cropperState.file ? cropperState.file.size : 0)/1024}kb</label>
        <button onClick={onOk}>Accept Crop</button>
        <button onClick={onCancel}>Cancel Crop</button>
      </div>
      <div className="crop-pics">
      {!!cropperState.imgSrc && (
        <ReactCrop
          crop={crop}
          onChange={(c, percentCrop) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          //A callback which happens after a resize, drag, or nudge. Passes the current crop state object.
          //percentCrop is the crop as a percentage. A typical use case for it would be to save it so that the user's crop can be restored regardless of the size of the image (for example saving it on desktop, and then using it on a mobile where the image is smaller).
          aspect={cropperState.aspect}
          minWidth={10} //number of pixels
          minHeight={10}//number of pixels
          //maxWidth={1000}//number of pixels
          //maxHeight={1000}//number of pixels
          keepSelection={true}//no effect on click outside
          disabled={false}//user cant resize or draw crop
          locked={false}//user can only drag the crop
          className={''}
          style={{width: 'fit-content', height: 'fit-content'}}
          //onDragStart?: (e: PointerEvent) => void
          //onDragEnd?: (e: PointerEvent) => void
          //renderSelectionAddon?: (state: ReactCropState) => React.ReactNode
          ruleOfThirds={true}
          circularCrop={false}
        >
          <div
            ref={divRef}
            style={{width: '500px', height: '500px'}}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={cropperState.imgSrc}
              style={{
                transformOrigin: 'left top',
                transform: `scale(${zoom/100}) rotate(${rotate}deg)`,
                objectFit: 'none', objectPosition: '0 0',
                width: `${imgDim.width.toString()}px`,
                height: `${imgDim.height.toString()}px`,
              }}
              onLoad={onImageLoad}
            />
          </div>
        </ReactCrop>
      )}
      {!!completedCrop && (
        <canvas
          ref={canvasRef}
          style={{ display: 'none',}}
        />
      )}
      {!!completedCrop && (
        <img alt='preview'
        ref={img2Ref}
        style={{
          width: '500px', height: '500px',
          border:'1px solid black'
        }}
        onLoad={onImage2Load}
        />
      )}
      </div>
    </ScOverlay>
  )
  return createPortal(Component, document.getElementById('cropper') as Element);
}
const ScOverlay = styled(PxDiv)`
  position: fixed;
  top: 0; left: 0; bottom: 0; right: 0;
  z-index: 1000000;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
`
export async function canvasPreview(image: HTMLImageElement,
  canvas: HTMLCanvasElement, crop: PixelCrop, zoom=100, resize=100, rotate=0) {
    
  zoom /= 100
  resize /= 100
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No 2d context')
  canvas.width = crop.width / zoom * resize
  canvas.height = crop.height / zoom * resize
  ctx.imageSmoothingQuality = 'high'

  ctx.save()
  ctx.translate(-crop.x / zoom * resize, -crop.y / zoom * resize)//crop origin to canvas origin (0,0)
  ctx.translate(image.naturalWidth / 2, image.naturalHeight / 2)// origin to center of the original position
  ctx.rotate(rotate * Math.PI / 180)//Rotate around the origin
  ctx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2) //move back
  ctx.scale(resize, resize)
  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight,
    0, 0, image.naturalWidth, image.naturalHeight,)
  ctx.restore()
}

export function useDebounceEffect(fn:()=>void, delay:number, deps:DependencyList) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined, deps as [])
    }, delay)

    return () => { clearTimeout(t) }
  }, deps)
}