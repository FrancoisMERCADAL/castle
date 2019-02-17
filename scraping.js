class Hotel {
  constructor(nom, departement, type, prix, nom_restaurant) {
    this.nom = nom;
    this.departement = departement;
    this.type = type;
    this.prix = prix;
    this.nom_restaurant = nom_restaurant;
  }
}

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
var Hotels = Array(150);
var compteur_hotels = 0;

request('https://www.relaischateaux.com/fr/site-map/etablissements', (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);

    datas = $('.col-2-3');
    for(var compteur = 0; compteur < 50; compteur++){ //parcours des pays
      var country = datas.children('div').eq(compteur);
      var check_pays = country.children('h3').text();

      if(check_pays==='France'){ //arrêt sur la France
        var liste = country.children('.listDiamond');

        for(var compteur2 = 0; compteur2 < 150; compteur2++){ //parcours des hôtels français
          var liste2 = liste.children('li').eq(compteur2);
          var lien = liste2.children('a').eq(0).attr("href");

          request(lien, (error, response, html) => {
            if(!error && response.statusCode == 200) {
              const $2 = cheerio.load(html);
              band_nav = $2('body').children('.jsSecondNav').children('.jsSecondNavMain');

              console.log('Hôtels restaurants');
              if(band_nav.children('li').eq(0).children('a').children('span').text()==='Hôtel' && band_nav.children('li').eq(1).children('a').children('span').text()==='Restaurant') { //retrait des informations sur les hôtels
                var nom = $2('body').children('.ajaxPages').children('#tabProperty').children('.grid').children('.row').children('.col-1-1').children('.hotelTabsHeaderTitle').children('h3').text();
                var departement = $2('body').children('.ajaxPages').children('#tabProperty').children('.grid').children('.row').children('.col-1-1').children('.hotelTabsHeaderTitle').children('h3').children('span').text();
                var prix = $2('body').children('.hotelHeader').children('.innerHotelHeader').children('.priceTag').children('.tag').children('span').eq(0).text();

                lien_restaurant = $2('body').children('.jsSecondNav').children('.jsSecondNavMain').children('li').eq(1).children('a').attr("href");
                request(lien_restaurant, (error, response, html) =>{ //requête pour connaître le nom du restaurant de l'hôtel s'il y en a un
                  if(!error && response.statusCode == 200) {
                    const $3 = cheerio.load(html);
                    var nom_restaurant = 'undefined';
                    //nom_restaurant = $3('body').children('.ajaxPages').children('div').children('div').children('div').children('.col-1-1').children('.hotelTabsHeaderTitle').children('h3').text();
                    nom_restaurant = $3('body').children('#tabRestaurant816').children('.grid').children('div').eq(0).children('div').eq(0).children('div').eq(0).children('h3').text();
                    console.log(compteur2 + ') ' + nom_restaurant);
                  }
                })
                //Hotels[compteur_hotels] = new Hotel(nom, departement, 'Hotel/Restaurant', prix, nom_restaurant);
                //console.log(compteur_hotels + ')class ' + Hotels[compteur_hotels].nom + ' ' + Hotels[compteur_hotels].departement + ' ' + Hotels[compteur_hotels].type + ' ' + Hotels[compteur_hotels].prix + ' ' + Hotels[compteur_hotels].nom_restaurant);
                compteur_hotels++;
              }
            }
          })
        }
      }
    }
  };
});
