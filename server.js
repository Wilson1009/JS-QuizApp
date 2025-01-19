const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url'); // Include the URL module

const port = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let filePath = path.join(__dirname, parsedUrl.pathname === '/' ? 'homePage.html' : parsedUrl.pathname);
    
    // Extract the file extension
    const ext = String(path.extname(filePath)).toLowerCase();

    // MIME types
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
    };

    // Default to octet-stream if MIME type is unknown
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Check if the file path doesn't have an extension
    if (!ext) filePath += '.html';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if (error.code === 'ENOENT') { // No such file or directory
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('Page not found');
            } else { // Some other server error
                res.writeHead(500);
                res.end('Internal Server Error: ' + error.code);
            }
        } else {
            // Serve the file with the correct MIME type
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
