import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const certificates = await prisma.certificate.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json(certificates);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await request.json();
        const cert = await prisma.certificate.create({ data: body });
        return NextResponse.json(cert, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
    }
}
