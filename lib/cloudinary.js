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
        const isPdf = file.type === 'application/pdf' || file.name?.endsWith('.pdf');
        
        const options = {
            folder,
            resource_type: isPdf ? 'image' : (isDocument ? 'raw' : 'auto'),
        };

        if (isDocument) {
            // Keep native filenames for documents so they don't lose their extensions
            let nameWithoutExt = file.name ? file.name.substring(0, file.name.lastIndexOf('.')) : 'document';
            if (!nameWithoutExt) nameWithoutExt = 'document';
            options.public_id = `${nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_')}_${Math.random().toString(36).substring(2, 8)}`;
            
            // Critical: For PDFs, Cloudinary uses 'image' resource_type to allow inline viewing.
            // If we add 'format: "pdf"', it guarantees the extension is kept.
            if (isPdf) {
                options.format = 'pdf';
            }
        } else {
            // Apply compressions only to actual images
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
