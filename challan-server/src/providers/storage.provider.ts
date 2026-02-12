import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export class StorageProvider {
    async uploadFile(buffer: Buffer, folder: string): Promise<{ url: string; publicId: string}> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: folder, resource_type: "auto" },
                (error, result) => {
                    if(error) return reject(error);
                    if(result) resolve({ url: result.secure_url, publicId: result.public_id });
                }
            );
            Readable.from(buffer).pipe(uploadStream);
        });
    }


    async deleteFile(publicId: string): Promise<void> {
        try {
            if(publicId) await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error("Failed to delete file from cloud:", error);
            
        }
    }
}
