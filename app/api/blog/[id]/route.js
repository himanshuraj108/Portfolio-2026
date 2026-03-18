import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req, { params }) {
    const { id } = await params;
    try {
        // Try by ID first, then by slug
        let post = await prisma.blog.findUnique({ where: { id } }).catch(() => null);
        if (!post) post = await prisma.blog.findUnique({ where: { slug: id } });
        if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        // Increment views
        await prisma.blog.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
        return NextResponse.json(post);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function PUT(req, { params }) {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await req.json();
        // Strip auto-managed fields that Prisma/MongoDB won't accept in update data
        const { id: _id, createdAt, updatedAt, views, ...data } = body;
        const post = await prisma.blog.update({ where: { id }, data });
        return NextResponse.json(post);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        await prisma.blog.delete({ where: { id } });
        return NextResponse.json({ message: 'Deleted' });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
