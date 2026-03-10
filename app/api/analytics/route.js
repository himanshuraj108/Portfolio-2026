import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logEvent, getAnalytics, getAnalyticsSummary } from '@/lib/analytics';
import { auth } from '@/lib/auth';

export async function POST(request) {
    try {
        const { event, page, meta } = await request.json();
        await logEvent(event, page, meta);
        return NextResponse.json({ ok: true });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function GET(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        if (type === 'summary') {
            const summary = await getAnalyticsSummary();
            return NextResponse.json(summary);
        }
        const days = parseInt(searchParams.get('days') || '30');
        const events = await getAnalytics(days);
        return NextResponse.json(events);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
