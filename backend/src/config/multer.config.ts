import { memoryStorage } from 'multer';
import { Request } from 'express';

export const multerConfig = {
  storage: memoryStorage(),
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
};

export const multerMemoryConfig = {
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
};
