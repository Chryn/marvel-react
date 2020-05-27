import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
var cors = require('cors')
var bodyParser = require('body-parser')
const PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const PRIVATE_KEY = "YOUR_PRIVATE_KEY";

const app = express();
app.use(cors())
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const port = 9000;
const URL = "https://gateway.marvel.com/v1/public/characters"
app.get('/', (req, res) => {
  res.send('The sedulous hyena ate the antelope!');
});

const CHAR_PER_PAGE = 20


app.post('/marvel', urlencodedParser, (req, res) => {

  const offset = (Number(req.query.page) - 1) * CHAR_PER_PAGE
  let ts = new Date().getTime();
  let hash: any = crypto.createHash('md5').update(ts + PRIVATE_KEY + PUBLIC_KEY).digest('hex');
  let url = 'https://gateway.marvel.com/v1/public/characters?offset=' + offset.toString() + '&apikey='+ PUBLIC_KEY
  url += "&ts="+ts+"&hash="+hash;
  axios({
    method: 'GET',
    url: url,
  }).then((response) => {
    let total = response.data.data.total
    let totalPages = Math.ceil(total / CHAR_PER_PAGE)
    let characters: any = [];
    response.data.data.results.map((item:any) => {
      let character = {
        pictureUrl : item.thumbnail.path + "." + item.thumbnail.extension,
        name : item.name

      }
      characters.push(character)
    })
    res.send({characters, totalPages})
  }, (error) => {
    console.log(error);
  });
});


app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});