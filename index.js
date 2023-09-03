var express = require('express');
var cors = require('cors');
require('dotenv').config()

const multer = require('multer');
const unlink = require('node:fs').unlink; 

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const upload = multer({ dest: 'uploads/'});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res, next) => {
  try {
    const upfile = req.file;
    const name = upfile.originalname, type = upfile.mimetype, size = upfile.size;
    res.status(200).json({name, type, size});
    next(); 
    unlink('uploads/'+upfile.filename, (err) => {
      if(err)
        return console.error(err);
      console.log("Successfully analysed and deleted");
    });
  } catch(err) {
    console.error(err);
    res.status(400).json({error: err});
  }
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
