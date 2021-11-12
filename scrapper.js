const axios = require("axios");
const cheerio = require("cheerio");
var https = require("https");
var fs = require("fs");
const url = "https://www.transatjacquesvabre.org/en/ranking-history";
const dataFolder = "./data/";

const extractLinks = ($) => [
  ...new Set(
    $("#main ul li a") // Select links
      .map((_, a) => $(a).attr("href")) // Extract the href (url) from each link
      .toArray() // Convert cheerio object to array
  ),
];

const cleanUpLinks = (links) => {
  const cleanLinks = [];
  links.map((link) => {
    cleanLinks.push(link.split("/")[2]);
  });

  return cleanLinks;
};

const downloadFiles = (links) => {
  links.map((link) => {
    var request = https.get(
      "https://www.transatjacquesvabre.org/rankings/" + link,
      function (response) {
        if (response.statusCode === 200) {
          var file = fs.createWriteStream("./data/" + link);
          response.pipe(file);
        }
        // Add timeout.
        request.setTimeout(12000, function () {
          request.abort();
        });
      }
    );
  });
};

axios.get(url).then(({ data }) => {
  const $ = cheerio.load(data); // Initialize cheerio
  const links = extractLinks($);

  const officalLinks = cleanUpLinks(links);

  const files = [];
  fs.readdirSync(dataFolder).forEach((file) => {
    files.push(file);
  });

  let missingLinks = officalLinks.filter((x) => !files.includes(x));

  downloadFiles(missingLinks);
});
