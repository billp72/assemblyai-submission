const http = require('http');
const fs = require('fs');

const hostname = process.env.host || 'https://fierce-everglades-96194-97a0bfd171b5.herokuapp.com/';
const port = process.env.PORT;
const home = fs.readFileSync('index.html')
const mod = fs.readFileSync('bundle.js/main.js')
const focuspage = fs.readFileSync('focuspage.html')
//const contact = fs.readFileSync('./contact.html')*/
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
    else if(url == '/bundle.js/main.js'){
        res.setHeader('Content-Type', 'text/javascript');
        res.write(mod);
        res.end();
    }
    /*else if(url == '/contact'){
        res.end(contact);
    }*/
    else{
        res.statusCode = 404;
        res.end("<h1>404 not found</h1>");
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});