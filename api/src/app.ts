import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
const cors = require('cors')
const bodyParser = require('body-parser')
const PUBLIC_KEY = "9ad2092af9895aa5b4ad500696fe213f";
const PRIVATE_KEY = "698c73b910f7d3533b0c9697548f57568de519fd";

const app = express();
app.use(cors())
const jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
const  urlencodedParser = bodyParser.urlencoded({ extended: false })
const port = 9000;
const URL = "https://gateway.marvel.com/v1/public/characters"
app.get('/', (req, res) => {
  res.send('The sedulous hyena ate the antelope!');
});

const CHAR_PER_PAGE = 20


 app.post('/marvel', urlencodedParser, async (req, res) => {

  const offset = (Number(req.query.page) - 1) * CHAR_PER_PAGE
  const ts = new Date().getTime();
  const hash: any = crypto.createHash('md5').update(ts + PRIVATE_KEY + PUBLIC_KEY).digest('hex');
  let url = 'https://gateway.marvel.com/v1/public/characters?offset=' + offset.toString() + '&apikey='+ PUBLIC_KEY
  url += "&ts="+ts+"&hash="+hash;
  try {
  const response = await axios({
    method: 'GET',
    url: url,
  })
  const total = response.data.data.total
  const totalPages = Math.ceil(total / CHAR_PER_PAGE)
  const characters = response.data.data.results.map((item:any) => {
    return {
      pictureUrl: item.thumbnail.path + "." + item.thumbnail.extension,
      name: item.name
    }
  })
  res.send({characters, totalPages})
}catch(error) {
  console.log("error: " + error)
}
});


app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});