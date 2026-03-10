import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file, folder = 'portfolio') {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isDocument = file.type === 'application/pdf' || 
                       file.type === 'application/msword' || 
                       file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                       file.name?.endsWith('.pdf') || 
                       file.name?.endsWith('.doc') || 
                       file.name?.endsWith('.docx');

    return new Promise((resolve, reject) => {
        const options = {
            folder,
            resource_type: isDocument ? 'raw' : 'auto',
        };

        if (!isDocument) {
            options.transformation = [{ quality: 'auto', fetch_format: 'auto' }];
        }

        cloudinary.uploader
            .upload_stream(options, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            })
            .end(buffer);
    });
}

export async function deleteFromCloudinary(publicId) {
    return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
