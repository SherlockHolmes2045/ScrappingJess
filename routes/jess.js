const express = require('express');
const router = express.Router();
const _bluebird = require('bluebird');

const _bluebird2 = _interopRequireDefault(_bluebird);

const _cheerio = require('cheerio');

const _cheerio2 = _interopRequireDefault(_cheerio);

const _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let request = require('request');


request = request.defaults({
    timeout: 20000,
    gzip: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


function getProjects(page = null){
    return new _bluebird2.default(function (resolve, reject) {
        request(`http://www.appelaprojets.org/appelprojet`, function (error, response, page) {
            if (error) {
                return reject(error);
            }

            let $ = _cheerio2.default.load(page);
            let appels = [];
            try {
                $("div.content-projets > div.projet").each((i,elem) => {

                    const getType = ()=>{
                        let type = "";
                        $(elem).find('div.type').children('span').each((i,elem) =>{
                            type += $(elem).text()+",";
                        });
                        return type.slice(0,-1);
                    };
                    let image = $(elem).find("div.content>figure>img").attr('src');
                    let title  = $(elem).find("div.content>h3").text();
                    let type = getType();
                    let expirency = $(elem).find("strong.date").text();
                    let infos = $(elem).find("div.infos>em").text();
                    let full = $(elem).find("div.content>a").attr("href");

                    let appel = {
                        image,
                        title,
                        type,
                        expirency,
                        infos,
                        full
                    }

                    appels.push(appel);
                })
            } catch (error) {
                return reject(error);
            }

            return resolve(_extends({
                appels
            }));
        });
    });
}
router.get('/', function(req, res, next) {

    getProjects().then(result => {
        res.json({
            appels: result
        });
    })

});

module.exports = router;
