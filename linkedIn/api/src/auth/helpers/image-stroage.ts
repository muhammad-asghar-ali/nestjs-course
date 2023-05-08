import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import * as fs from 'fs';
import * as path from 'path';
import mime from 'mime-types';

const validFileExt = ['png', 'jpg', 'jpeg', 'gif'];
const validMime = ['image/png', 'image/jpeg'];

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
const validMimeTypes: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

export const saveImageToStorage = {
  storage: diskStorage({
    destination: './images',
    filename: (req, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};

export const isFileExtensionSafe = async (
  fullFilePath: string,
): Promise<boolean> => {
  const fileExtension = path.extname(fullFilePath).substring(1); // Get file extension from full file path
  const mimeType = mime.lookup(fullFilePath);

  if (!fileExtension || !mimeType) {
    return false; // If file extension or MIME type are not found, file is not safe
  }

  const isFileTypeLegit = validFileExt.includes(fileExtension);
  const isMimeTypeLegit = validMime.includes(mimeType);
  const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
  return isFileLegit;
};

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (err) {
    console.error(err);
  }
};
