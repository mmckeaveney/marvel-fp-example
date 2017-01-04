const crypto = require('crypto');
const request = require('request');
const  { 
    MARVEL_PRIVATE_KEY, 
    MARVEL_API_KEY 
} = require('../keys');

const MARVEL_BASE_URL = "https://gateway.marvel.com:443/v1/public"

// Marvel authentication code
const stringToHash = (strToHash) => crypto.createHash('md5').update(strToHash).digest('hex');
const buildMarvelHash = (ts) => ts + MARVEL_PRIVATE_KEY + MARVEL_API_KEY; 
const buildFullHashString = (ts) => stringToHash(buildMarvelHash(ts));   
const fullMarvelAuth = (ts) =>`ts=${ts}&hash=${buildFullHashString(ts)}&apikey=${MARVEL_API_KEY}`;

const allComicStories = [];
const commonComicStories = [];
let numberOfHeroRequests = 0;
let numHeroes = 0;

const getCommonComicStories = (heroNames) => {
    numHeroes = heroNames.length;
    heroNames.forEach((heroName) => {
       findHeroData(heroName); 
    }) 
}

const isDuplicate = (story) => {
    let count = 0;
    allComicStories.forEach((el, index) => {
        allComicStories[index].id === story.id && count++; 
    });
    return count > 1 ? true : false;
}

/**
 * Gets the data for a hero by name from the Marvel API
 */
const findHeroData = (name) => 
    request(`${MARVEL_BASE_URL}/characters?name=${name}&orderBy=name&limit=1&${fullMarvelAuth(Date.now)}`,
        (error, response, body) => {
        try {
            if (!error && body) {
                comicsSeriesWithHero(JSON.parse(body).data.results[0].id);
            } else {
                console.error(error);
            }
        } catch (e) {
            console.error(e);
        }
    });

/**
 * Gets the list of comic book series with the hero in it.
 */
const comicsSeriesWithHero = (heroId) => 
    request(`${MARVEL_BASE_URL}/characters/${heroId}/series?${fullMarvelAuth(Date.now)}&limit=100`,
        (error, response, body) => {
        try {
            if (!error && body) {
                JSON.parse(body).data.results.forEach(({ id, title, description }) => 
                    allComicStories.push({ id, title, description }));
                    numberOfHeroRequests++;
                    if (numberOfHeroRequests == numHeroes) {
                        findIntersection();
                    }
            } else {
                console.error(error);
            }
        } catch (e) {
            console.error(e);
        }
    }); 

const findIntersection = () => {
    allComicStories.forEach((comicStory) => {
        if (isDuplicate(comicStory) && commonComicStories.indexOf(comicStory) === -1) {
            commonComicStories.push(comicStory);
        }
    });
    console.log(commonComicStories);
}

module.exports = {
    getCommonComicStories,
    findHeroData,
    comicsSeriesWithHero
};