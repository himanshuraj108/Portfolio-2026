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

        if (isDocument) {
            // Cloudinary's upload_stream strips extensions for raw files unless explicitly provided via public_id
            let ext = 'pdf';
            let baseName = 'document';
            if (file.name && file.name.includes('.')) {
                ext = file.name.split('.').pop();
                baseName = file.name.substring(0, file.name.lastIndexOf('.'));
            }
            const safeBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
            const randomStr = Math.random().toString(36).substring(2, 8);
            options.public_id = `${safeBaseName}_${randomStr}.${ext}`;
        } else {
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
