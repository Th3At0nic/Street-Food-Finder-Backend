/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import config from '../config';

// Cloudinary configuration
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Multer: store files in memory (RAM)
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per file
    files: 10,
  },
});

// Function to upload a buffer to Cloudinary
export const sendImageToCloudinary = async (
  fileBuffer: Buffer,
  fileName: string,
): Promise<any> => {
  try {
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ public_id: fileName }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(fileBuffer);
    });

    return uploadResult;
  } catch (error) {
    console.log('Cloudinary upload error:', error);
    throw error;
  }
};

//this code will not use any local folder to first keep the images and then upload and then delete, which doesn't work in vercel deploy
//so gotta use memoryStorage instead diskStorage, this will work on both deployment and localhost
