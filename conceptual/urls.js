const fs = require('fs');
const http = require('http');
const https = require('https');
const url = require('url');

if (process.argv.length < 3) {
    console.log('Usage: node urls.js FILENAME');
    process.exit(1);
}

const FILENAME = process.argv[2];

fs.readFile(FILENAME, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file ${FILENAME}:`, err);
        return;
    }

    const urls = data.split('\n').filter(Boolean); // Split by lines and filter out empty lines

    urls.forEach(fetchAndSave);
});

function fetchAndSave(targetUrl) {
    const parsedUrl = url.parse(targetUrl);
    const requester = parsedUrl.protocol === 'https:' ? https : http;

    requester.get(targetUrl, (res) => {
        let html = '';

        res.on('data', (chunk) => {
            html += chunk;
        });

        res.on('end', () => {
            fs.writeFile(parsedUrl.hostname, html, (err) => {
                if (err) {
                    console.error(`Error writing to file ${parsedUrl.hostname}:`, err);
                } else {
                    console.log(`Saved content of ${targetUrl} to ${parsedUrl.hostname}`);
                }
            });
        });
    }).on('error', (err) => {
        console.error(`Error fetching ${targetUrl}:`, err);
    });
}
