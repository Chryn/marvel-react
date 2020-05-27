"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
var crypto_1 = __importDefault(require("crypto"));
var cors = require('cors');
var bodyParser = require('body-parser');
var PUBLIC_KEY = "9ad2092af9895aa5b4ad500696fe213f";
var PRIVATE_KEY = "698c73b910f7d3533b0c9697548f57568de519fd";
var app = express_1.default();
app.use(cors());
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var port = 9000;
var URL = "https://gateway.marvel.com/v1/public/characters";
app.get('/', function (req, res) {
    res.send('The sedulous hyena ate the antelope!');
});
var CHAR_PER_PAGE = 20;
app.post('/marvel', urlencodedParser, function (req, res) {
    var offset = (Number(req.query.page) - 1) * CHAR_PER_PAGE;
    var ts = new Date().getTime();
    var hash = crypto_1.default.createHash('md5').update(ts + PRIVATE_KEY + PUBLIC_KEY).digest('hex');
    var url = 'https://gateway.marvel.com/v1/public/characters?offset=' + offset.toString() + '&apikey=' + PUBLIC_KEY;
    url += "&ts=" + ts + "&hash=" + hash;
    axios_1.default({
        method: 'GET',
        url: url,
    }).then(function (response) {
        var total = response.data.data.total;
        var totalPages = Math.ceil(total / CHAR_PER_PAGE);
        var characters = [];
        response.data.data.results.map(function (item) {
            var character = {
                pictureUrl: item.thumbnail.path + "." + item.thumbnail.extension,
                name: item.name
            };
            characters.push(character);
        });
        res.send({ characters: characters, totalPages: totalPages });
    }, function (error) {
        console.log(error);
    });
});
app.listen(port, function (err) {
    if (err) {
        return console.error(err);
    }
    return console.log("server is listening on " + port);
});
//# sourceMappingURL=app.js.map