const express = require('express');
const router = express.Router();
const _bluebird = require('bluebird');
const extractDomain = require('extract-domain');

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

function getProjectsInria(page = null){
    return new _bluebird2.default(function (resolve, reject) {
        request(`https://www.inria.fr/fr/recherche?search_text=appel+%C3%A0+projet&end_date=&start_date=&sort_by=created`, function (error, response, page) {
            if (error) {
                return reject(error);
            }

            let $ = _cheerio2.default.load(page);
            let appels = [];
            try {
                $("div.view-content > div.views-row").each((i,elem) => {
                    const getType = ()=>{
                        let type = "";
                        $(elem).find('div.tag-container').children('div.field__items').each((i,elem) =>{
                            type += $(elem).text().replace(/(\r\n|\n|\r)/gm, "")+",";
                        });
                        return type.slice(0,-1);
                    };
                    let image = "https://www.inria.fr" + $(elem).find("img.img-responsive").attr('src');
                    let title  = $(elem).find("div.subcontent>h3>span").text();
                    let type = getType();
                    let expirency = $(elem).find("time").text();
                    let infos = "";
                    let full = "https://www.inria.fr" + $(elem).find("a").attr("href");

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

function getProjectsAnr(page = null){
    return new _bluebird2.default(function (resolve, reject) {
        request(`https://www.onera.fr/fr/projets-anr-onera`, function (error, response, page) {
            if (error) {
                return reject(error);
            }

            let $ = _cheerio2.default.load(page);
            let appels = [];
            try {
                $("div.content>div.test").each((i,elem) => {

                    const getType = ()=>{
                        let type = "";
                        $(elem).find('div.type').children('span').each((i,elem) =>{
                            type += $(elem).text()+",";
                        });
                        return type.slice(0,-1);
                    };
                    let image = $(elem).find("img.img-responsive").attr('src');
                    let title  = $(elem).find("div.content>div.subcontent>h3>span").text();
                    let type = getType();
                    let expirency = $(elem).find("time").text();
                    let infos = $(elem).find("div.field_item").text();
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

function getProjectSingle(url){
    return new _bluebird2.default(function (resolve, reject) {
        request(url, function (error, response, page) {
            if (error) {
                return reject(error);
            }

            let $ = _cheerio2.default.load(page);
            let appels = [];
            try {
                //console.log($("div.flex").find('div.half').eq(1).find('ul').eq(2).find('li').eq(0).text());
                    const getSecteurs = ()=>{
                        let type = "";
                        $("div.flex").find('div.half').eq(1).find('ul').eq(2).find('li').each((i,elem) =>{
                            type += $(elem).text()+",";
                        });
                        return type.slice(0,-1);
                    };
                    const getType = () => {
                      let type = "";
                        $("div.flex").find('div.half').eq(1).find('ul').eq(1).find('li').each((i,elem) =>{
                            type += $(elem).text()+",";
                        });
                        return type.slice(0,-1);
                    };
                    const getEmetteur = () => {
                        let type = "";
                        $("div.flex").find('div.half').eq(1).find('ul').eq(0).find('li').each((i,elem) =>{
                        type += $(elem).text()+",";
                        });
                        return type.slice(0,-1);
                    };
                    let image = $("div.flex").find('div.half').eq(0).find('img').attr('src');
                    let title  = $("div.wrapper").find("h1").eq(0).text();
                    let secteurs = getSecteurs();
                    let type = getType();
                    let expirency = $("div.flex").find('div.half').eq(1).find('h2').eq(3).text();
                    const getContent = ()=>{
                        let content ="";
                        $("div.wrapper").find("p").each((i,elem)=>{
                           content += $(elem).html()+",";
                        });
                        return content.slice(0,-1);
                    };
                    let infos = getContent();
                    let full = url;
                    let emetteur = getEmetteur();

                    let appel = {
                        image,
                        title,
                        emetteur,
                        secteurs,
                        type,
                        expirency,
                        infos,
                        full
                    }
                    appels.push(appel);

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

    Promise.all([getProjects(),getProjectsInria()]).then(result => {
        let appels = [];
        result.forEach( values => {
            values.appels.forEach(data =>{
                appels.push(data)
            })
        });
        res.render('appels.ejs',{appels: appels});
    })

});

router.get('/:url',function (req,res,next){

    let url = decodeURIComponent(req.params.url);
    switch (extractDomain(url)){
        case "appelaprojets.org":
            getProjectSingle(url).then( result => {
                console.log(result);
            })
            break;
        default:
            res.render('appel.ejs',{data: "Domain do not exist"});
    }
    res.render('appel.ejs');
})

module.exports = router;
