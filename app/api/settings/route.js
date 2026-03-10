import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        let settings = await prisma.settings.findFirst();
        if (!settings) {
            settings = await prisma.settings.create({ data: {} });
        }
        return NextResponse.json(settings);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function PUT(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await request.json();
        
        // Remove read-only / auto-generated Prisma fields to prevent MongoDB schema crash
        delete body.id;
        delete body.createdAt;
        delete body.updatedAt;

        let settings = await prisma.settings.findFirst();
        if (!settings) {
            settings = await prisma.settings.create({ data: body });
        } else {
            settings = await prisma.settings.update({ where: { id: settings.id }, data: body });
        }
        return NextResponse.json(settings);
    } catch (err) { 
        console.error("Settings API save error:", err);
        return NextResponse.json({ error: 'Failed', details: err.message }, { status: 500 }); 
    }
}
