export default async function handler(req, res) {
    // CORS headers for security
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query } = req.query;
    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const targetUrl = `https://anonymouslookup.site/api.php?type=all&query=${encodeURIComponent(query.trim())}`;

        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                // Forward cookies if present
                ...(req.headers.cookie ? { 'Cookie': req.headers.cookie } : {})
            }
        });

        const data = await response.json();

        // Return the response
        res.status(200).json(data);
    } catch (error) {
        console.error('API Proxy Error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch from upstream API',
            error: error.message
        });
    }
}