import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const skills = await prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] });
        return NextResponse.json(skills);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function POST(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await request.json();
        const item = await prisma.skill.create({ data: body });
        return NextResponse.json(item, { status: 201 });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function PUT(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await request.json();
        const item = await prisma.skill.update({ where: { id: body.id }, data: body });
        return NextResponse.json(item);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function DELETE(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id } = await request.json();
        await prisma.skill.delete({ where: { id } });
        return NextResponse.json({ message: 'Deleted' });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
