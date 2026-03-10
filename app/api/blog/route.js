import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const posts = await prisma.blog.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(posts);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function POST(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await request.json();
        // Generate slug from title if not provided
        if (!body.slug) {
            body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        const post = await prisma.blog.create({ data: body });
        return NextResponse.json(post, { status: 201 });
    } catch { return NextResponse.json({ error: 'Failed to create' }, { status: 500 }); }
}
