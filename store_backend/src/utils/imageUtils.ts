import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = '../store_backend/src/assets/images';
const fullDir = '/full';
const thumbsDir = '/thumbs';

const imagesExtensions: string[] = ['.jpg', '.jpeg', '.png', '.gif'];

export const fileNameDimensions = (name: string, width: string, height: string): string => {
  name = path.parse(name).name;
  return width + 'x' + height + '_' + name + '.jpg';
};

//Check if the image exists, even with different extension
export const checkImageInServer = async (
  name: string,
  width: number = 0,
  height: number = 0,
): Promise<string | null> => {
  let filePath: string;
  if (width && height) {
    //add width and height to name
    name = fileNameDimensions(name, String(width), String(height));
    filePath = path.resolve(path.join(imagesDir, thumbsDir, name));
  } else {
    filePath = path.resolve(path.join(imagesDir, fullDir, name));
  }

  try {
    //if the file found with the right extension, return
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  } catch (err) {}

  //if not found, check for the same name with different extension
  const noExtPath = path.join(path.parse(filePath).dir, path.parse(filePath).name);
  for (const ext of imagesExtensions) {
    try {
      if (fs.existsSync(noExtPath + ext)) {
        return noExtPath + ext;
      }
    } catch (err) {}
  }
  return null;
};

export const cloneThumb = async (pipeline: sharp.Sharp, fileName: string) => {
  const thumbPath: string = path.resolve(path.join(imagesDir, thumbsDir, fileName));
  pipeline.clone().toFile(thumbPath);
};
export const createThumb = async (filePath: string, width: number, height: number): Promise<string | null> => {
  const name = path.parse(filePath).name;
  const newName = fileNameDimensions(name, String(width), String(height));
  const thumbPath: string = path.resolve(path.join(imagesDir, thumbsDir, newName));

  try {
    await sharp(filePath).resize({ width, height }).toFile(thumbPath);
    return thumbPath;
  } catch (error) {
    console.log(error);
    return null;
  }
  return null;
};
