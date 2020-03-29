const express = require('express');

const app = express();
const dirFns = require('./server/dir.js');
const path = require('path');

//set static path to serve static files
app.use(express.static("datadir"));
app.use("/public", express.static("public"));

function render(content) {
  return `
  <html>
    <head>
      <script src="/public/scripts.js"></script>
    </head>
    <body>
    ` + content + `
    </body>
  </html>
  `
}

function mkLink(location) {
  return `navigate(\"` + Buffer.from(location).toString('base64') + `\")`
}

function mkButton(location, title) {
  return "<button onClick="+mkLink(location)+">" + title + "</button>"
}

app.get('/', function (req, res) {
  const loc = Buffer.from(req.query.loc || "", 'base64').toString()
  if (dirFns.isDir(loc)) {
    res.send(render("dirs:<br>" + dirFns.readDir(loc)
      .map((text) => mkButton(path.join(loc, text), text)).join("<br>")));
    return
  }
  if (dirFns.isFile(loc)) {
    res.send(`
<video width="612" controls>
  <source src="` + loc + `">
  Your browser does not support HTML5 video.
</video>
`)
    return
  }
  res.send("404");
})

const server = app.listen(27019, function () {
   const host = server.address().address
   const port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})

