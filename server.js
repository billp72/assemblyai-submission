const http = require('http');
const fs = require('fs');
require('dotenv').config();

const port = process.env.PORT;
const home = fs.readFileSync('index.html')
const mod1 = fs.readFileSync('bundle/bundle1.bundle.js')
const mod2 = fs.readFileSync('bundle/bundle2.bundle.js')
const focuspage = fs.readFileSync('focuspage.html')

const server = http.createServer((req, res)=>{
    url = req.url;
    path = req.url.split('?')[0]
    res.statusCode = 200;
    if(url == '/'){
        res.setHeader('Content-Type', 'text/html');
        res.end(home);
    }
    else if(path == '/focuspage'){
        res.setHeader('Content-Type', 'text/html');
        res.end(focuspage);
    }
    else if(url == '/bundle/bundle1.bundle.js'){
        res.setHeader('Content-Type', 'text/javascript');
        res.write(mod1);
        res.end();
    }
    else if(url == '/bundle/bundle2.bundle.js'){
        res.setHeader('Content-Type', 'text/javascript');
        res.write(mod2);
        res.end();
    }
    else{
        res.statusCode = 404;
        res.end("<h1>404 not found</h1>");
    }
});

server.listen(port, () => {
    console.log(`Server running at ${port}`);
});