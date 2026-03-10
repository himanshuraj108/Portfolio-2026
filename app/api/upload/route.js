import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { auth } from '@/lib/auth';

export async function POST(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const folder = formData.get('folder') || 'portfolio';

        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

        const result = await uploadToCloudinary(file, folder);
        return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
    } catch (error) {
        return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
    }
}
