import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { auth } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const folder = formData.get('folder') || 'portfolio';

        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

        const isPdf = file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf');

        if (isPdf) {
            // Save PDFs to local storage
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            // Clean filename to prevent issues
            const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
            const uniqueName = `${Date.now()}-${safeName}`;
            const filepath = path.join(uploadDir, uniqueName);
            
            fs.writeFileSync(filepath, buffer);
            
            return NextResponse.json({ url: `/uploads/${uniqueName}`, publicId: `local-${uniqueName}` });
        }

        const result = await uploadToCloudinary(file, folder);
        return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
    } catch (error) {
        return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
    }
}
