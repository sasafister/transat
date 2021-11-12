// var scraperjs = require("scraperjs");
// scraperjs.StaticScraper.create(
//   "https://www.transatjacquesvabre.org/en/ranking-history/"
// )
//   .scrape(function ($) {
//     return $("")
//       .map(function () {
//         return $(this).attr("href");
//       })
//       .get();
//   })
//   .then(function (news) {
//     console.log(news);
//   });

var scraperjs = require("scraperjs");

// In other environments:
const cheerio = require("cheerio");

const $ = cheerio.load('<ul id="fruits">...</ul>');
