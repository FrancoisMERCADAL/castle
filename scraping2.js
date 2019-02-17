const request = require('request');
const cheerio = require('cheerio');
const files = require('File');
var jsonfile = require('jsonfile');
const fs = require('fs');
let noms_restaurants = Array(626).fill('no name');
var compteur = 0;

async function Michelin(noms_restaurants){
    for(var page = 1; page < 36; page++) { //parcours de chaque page
      if(page==1) {
         await request('https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin?indirect=278', (error, response, html) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            var liste_restaux = $('body').children('.l-page').children('.l-content-wrapper').children('div').eq(2).children('div').eq(0).children('div').eq(1).children('div').eq(1).children('#panels-content-main-leftwrapper').children('div').eq(1).children('div').children('div').children('ul'); //retrait de la liste des restaurants
            for(var nb = 0; nb < 18; nb++){ // parcours de la liste
              noms_restaurants[compteur] = liste_restaux.children('li').eq(nb).children('div').children('a').children('div').eq(1).children('div').eq(0).children('div').eq(1).text();
              console.log(compteur + ')' + noms_restaurants[compteur]);
              compteur++;
            }
          }
        });
      }
      else {
         await request('https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-'+ page.toString(10) + '?indirect=278', (error, response, html) => { //idem que précédment mais avec modification du l'URL
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            var liste_restaux = $('body').children('.l-page').children('.l-content-wrapper').children('div').eq(2).children('div').eq(0).children('div').eq(1).children('div').eq(1).children('#panels-content-main-leftwrapper').children('div').eq(1).children('div').children('div').children('ul');
            for(var nb = 0; nb < 18; nb++){
              noms_restaurants[compteur] = liste_restaux.children('li').eq(nb).children('div').children('a').children('div').eq(1).children('div').eq(0).children('div').eq(1).text();
              console.log(compteur + ')' + noms_restaurants[compteur]);
              compteur++;
            }
          }
        });
      }
    }
    return noms_restaurants;
};

async function main(noms_restaurants){ //inscription dans un fichier
  noms_restaurants = await Michelin(noms_restaurants);
  var json = JSON.stringify(noms_restaurants);
fs.writeFile('myjsonfile.json', json, 'utf8', function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("File saved successfully!");
});
}

main();
