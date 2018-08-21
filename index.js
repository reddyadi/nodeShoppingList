const http = require('http');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');

var server = http.createServer(function(request, response){
  console.log(`${request.method} request for ${request.url}`);


if(request.method === "GET"){
  var page;
  if(request.url === "/" || request.url === "/home" || request.url === "/index"){
    fs.readFile('./public/index.html', 'UTF-8', function(error, contents){
      if(error){
        console.log("error, something went wrong");
      } else {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(contents);
      }
    });

  } else if(request.url.match(/.js$/)){
    var jsPath = path.join(__dirname, 'public', request.url);
    var fileStream = fs.createReadStream(jsPath, 'UTF-8');
    response.writeHead(200, {'Content-Type': 'text/javascript'});
    fileStream.pipe(response);

  } else if(request.url.match(/.css$/)){
    var cssPath = path.join(__dirname, 'public', request.url);
    var fileStream = fs.createReadStream(cssPath, 'UTF-8');
    response.writeHead(200, {'Content-Type': 'text/css'});
    fileStream.pipe(response);
  }
} else if(request.method === "POST"){
  if(request.url === '/formSubmit'){
    var body = '';

    request.on('data', function(data){
      body += data;
    })

    request.on('end', function(){
      var formData = qs.parse(body);
      console.log(formData);
    })
  }
}
});

server.listen(3000);

console.log("The server is running on port 3000");
