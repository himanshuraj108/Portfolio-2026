import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSubscribeConfirmation } from '@/lib/nodemailer';

export async function POST(request) {
    try {
        const { email } = await request.json();
        if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

        // Check if already subscribed
        const existing = await prisma.subscriber.findUnique({ where: { email } });
        if (existing) return NextResponse.json({ error: 'Already subscribed' }, { status: 409 });

        await prisma.subscriber.create({ data: { email } });

        // Send confirmation
        try {
            await sendSubscribeConfirmation(email);
        } catch (e) { console.error('Confirmation email failed:', e); }

        return NextResponse.json({ message: 'Subscribed successfully!' });
    } catch { return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 }); }
}

export async function GET() {
    try {
        const subscribers = await prisma.subscriber.findMany({ orderBy: { subscribedAt: 'desc' } });
        return NextResponse.json(subscribers);
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        await prisma.subscriber.delete({ where: { id } });
        return NextResponse.json({ message: 'Removed' });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
