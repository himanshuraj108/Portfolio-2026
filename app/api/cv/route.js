import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const settings = await prisma.settings.findFirst();
        if (!settings?.cvUrl) return NextResponse.json({ error: 'CV not found' }, { status: 404 });
        return NextResponse.json({ cvUrl: settings.cvUrl });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function PUT(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { cvUrl } = await request.json();
        let settings = await prisma.settings.findFirst();
        if (!settings) {
            settings = await prisma.settings.create({ data: { cvUrl } });
        } else {
            settings = await prisma.settings.update({ where: { id: settings.id }, data: { cvUrl } });
        }
        return NextResponse.json({ cvUrl: settings.cvUrl });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
