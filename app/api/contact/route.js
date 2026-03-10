import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendContactEmail } from '@/lib/nodemailer';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
        }

        // Save to DB
        await prisma.message.create({ data: { name, email, subject, message } });

        // Send email notification
        try {
            await sendContactEmail({ name, email, subject, message });
        } catch (emailError) {
            console.error('Email send failed:', emailError);
            // Don't fail the request if email fails
        }

        return NextResponse.json({ message: 'Message sent successfully!' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = 20;
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const total = await prisma.message.count();
        return NextResponse.json({ messages, total });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
