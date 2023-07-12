const express = require('express');
const dns = require('dns').promises;

const app = express();
const port = 3000;

app.get('/ipaddresses', async (req, res) => {
    const hostname = req.query.hostname;

    if (!hostname) {
        return res.status(400).send('Missing hostname parameter.');
    }

    try {
        let ipv4Addresses = await dns.resolve4(hostname);
        let ipv6Addresses = await dns.resolve6(hostname);
        
        let allIPs = [...ipv4Addresses, ...ipv6Addresses];
        // Remove duplicates
        allIPs = [...new Set(allIPs)];
        
        res.set('Content-Type', 'text/plain');
        res.send(allIPs.join('\n'));
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to resolve IP addresses.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
