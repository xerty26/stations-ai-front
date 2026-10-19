const DAY_MS = 24 * 60 * 60 * 1000;

// Last point at least `days` days older than the latest one, or null if the history is shorter
const pointDaysAgo = (points, days) => {
    const limit = new Date(points[points.length - 1].date).getTime() - days * DAY_MS;
    return [...points].reverse().find((point) => new Date(point.date).getTime() <= limit) || null;
};

export const summarizeHistory = (points) => {
    const current = points[points.length - 1];
    const weekAgo = pointDaysAgo(points, 7);
    const monthAgo = pointDaysAgo(points, 30);

    return {
        current,
        change7: weekAgo ? current.avg - weekAgo.avg : null,
        change30: monthAgo ? current.avg - monthAgo.avg : null,
        lowest: points.reduce((best, point) => (point.avg < best.avg ? point : best)),
        highest: points.reduce((best, point) => (point.avg > best.avg ? point : best)),
    };
};

// 0.0123 -> "1,2 cts/L"
export const formatCents = (value) =>
    `${(value * 100).toLocaleString('es-ES', { maximumFractionDigits: 1 })} cts/L`;

// 0.0123 -> "+1,2 cts/L"
export const formatChange = (value) =>
    `${(value * 100).toLocaleString('es-ES', { maximumFractionDigits: 1, signDisplay: 'exceptZero' })} cts/L`;

export const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
