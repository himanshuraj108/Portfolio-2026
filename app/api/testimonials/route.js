import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const items = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json(items);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function POST(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await request.json();
        const item = await prisma.testimonial.create({ data: body });
        return NextResponse.json(item, { status: 201 });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function PUT(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await request.json();
        const item = await prisma.testimonial.update({ where: { id: body.id }, data: body });
        return NextResponse.json(item);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function DELETE(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id } = await request.json();
        await prisma.testimonial.delete({ where: { id } });
        return NextResponse.json({ message: 'Deleted' });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
