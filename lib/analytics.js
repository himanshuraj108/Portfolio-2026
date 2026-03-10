import { prisma } from './prisma';

export async function logEvent(event, page = null, meta = null) {
    try {
        await prisma.analytics.create({
            data: {
                event,
                page,
                meta: meta ? JSON.stringify(meta) : null,
            },
        });
    } catch (error) {
        // Silently fail - analytics should never break the app
        console.error('Analytics error:', error);
    }
}

export async function getAnalytics(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const events = await prisma.analytics.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
    });

    return events;
}

export async function getAnalyticsSummary() {
    const [totalViews, cvDownloads, githubClicks, totalMessages, totalSubscribers] =
        await Promise.all([
            prisma.analytics.count({ where: { event: 'page_view' } }),
            prisma.analytics.count({ where: { event: 'cv_download' } }),
            prisma.analytics.count({ where: { event: 'github_click' } }),
            prisma.message.count(),
            prisma.subscriber.count(),
        ]);

    return {
        totalViews,
        cvDownloads,
        githubClicks,
        totalMessages,
        totalSubscribers,
        unreadMessages: await prisma.message.count({ where: { read: false } }),
    };
}
