import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json(messages);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function PUT(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id, read } = await request.json();
        const msg = await prisma.message.update({ where: { id }, data: { read } });
        return NextResponse.json(msg);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function DELETE(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id } = await request.json();
        await prisma.message.delete({ where: { id } });
        return NextResponse.json({ message: 'Deleted' });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
