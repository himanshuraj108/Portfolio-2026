import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req, { params }) {
    const { id } = await params;
    try {
        const cert = await prisma.certificate.findUnique({ where: { id } });
        if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(cert);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function PUT(req, { params }) {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await req.json();
        const cert = await prisma.certificate.update({ where: { id }, data: body });
        return NextResponse.json(cert);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        await prisma.certificate.delete({ where: { id } });
        return NextResponse.json({ message: 'Deleted' });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
