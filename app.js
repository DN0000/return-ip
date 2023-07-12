const express = require('express');
const dns = require('dns').promises;

const app = express();
const port = 3000;

app.get('/ipaddresses', async (req, res) => {
    const hostname = req.query.hostname;

    if (!hostname) {
        return res.status(400).send('Missing hostname parameter.');
    }

    let ipv4Addresses = [];
    let ipv6Addresses = [];

    try {
        ipv4Addresses = await dns.resolve4(hostname);
    } catch (err) {
        console.warn(`Failed to resolve IPv4 addresses for ${hostname}.`);
    }

    try {
        ipv6Addresses = await dns.resolve6(hostname);
    } catch (err) {
        console.warn(`Failed to resolve IPv6 addresses for ${hostname}.`);
    }

    if (!ipv4Addresses.length && !ipv6Addresses.length) {
        return res.status(404).send(`No IP addresses found for ${hostname}.`);
    }
    
    let allIPs = [...ipv4Addresses, ...ipv6Addresses];
    // Remove duplicates
    allIPs = [...new Set(allIPs)];
    
    res.set('Content-Type', 'text/plain');
    res.send(allIPs.join('\n'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
