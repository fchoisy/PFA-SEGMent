var http = require('http'); // To launch server
var formidable = require('formidable'); // Library to upload file
var fs = require('fs'); // Library to move uploaded file

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      console.log(oldpath);
      var newpath = '../frontend/upload/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('File uploaded and moved!');
        res.end();
      });
 });
}
// else {
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
//   res.write('<input type="file" name="filetoupload"><br>');
//   res.write('<input type="submit">');
//   res.write('</form>');
//   return res.end();
// }
}).listen(8080);
