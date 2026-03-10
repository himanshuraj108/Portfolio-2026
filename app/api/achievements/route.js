import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Generic CRUD factory for simple models
async function getAll(model) {
    return prisma[model].findMany({ orderBy: { createdAt: 'desc' } });
}

// Achievements
export async function GET() {
    try {
        const data = await getAll('achievement');
        return NextResponse.json(data);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
export async function POST(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await request.json();
        const item = await prisma.achievement.create({ data: body });
        return NextResponse.json(item, { status: 201 });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
