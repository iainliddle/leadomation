export default async function handler(req: any, res: any) {
    const response = await fetch(`${process.env.VITE_APP_URL}/api/execute-sequences`, {
        method: 'POST',
        headers: { 'x-cron-secret': process.env.CRON_SECRET || '' }
    });
    const data = await response.json();
    return res.status(200).json(data);
}
