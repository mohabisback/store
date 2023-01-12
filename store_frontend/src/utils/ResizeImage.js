import Resizer from 'react-image-file-resizer'

const maxWidth = 500;
const maxHeight = 500;
const compressFormat = "JPEG";
const quality = 100;
const rotation = 0;
//const callback = (uri) => { console.log(uri);this.setState({ newImage: uri });},
const outputType = "file";
const minWidth = 50;
const minHeight = 50;

const ResizeImage = async (file, callback) => {
  Resizer.imageFileResizer(
    file, // Is the file of the image which will resized.
    maxWidth, // Is the maxWidth of the resized new image.
    maxHeight, // Is the maxHeight of the resized new image.
    compressFormat, // Is the compressFormat of the resized new image.
    quality, // Is the quality of the resized new image.
    rotation, // Is the degree of clockwise rotation to apply to uploaded image.
    callback, // Is the callBack function of the resized new image URI.
    outputType, // Is the output type of the resized new image.
    minWidth, // Is the minWidth of the resized new image.
    minHeight // Is the minHeight of the resized new image.
  );
}

export default ResizeImage;