const Either = require('data.either');
const Task = require('data.task');
const request = require('request');
const crypto = require('crypto');
const R = require('ramda');
const  { 
    MARVEL_PRIVATE_KEY, 
    MARVEL_API_KEY 
} = require('../keys');

const MARVEL_BASE_URL = "https://gateway.marvel.com:443/v1/public"

// Marvel authentication code
const stringToHash = (strToHash) => crypto.createHash('md5').update(strToHash).digest('hex');
const buildMarvelHash = (ts) => ts + MARVEL_PRIVATE_KEY + MARVEL_API_KEY; 
const buildFullHashString = R.compose(stringToHash, buildMarvelHash);   
const fullMarvelAuth = (ts) =>`ts=${ts}&hash=${buildFullHashString(ts)}&apikey=${MARVEL_API_KEY}`;

// Simple Http Call wrapping the result in a Task
const httpGet = (url) =>
    new Task((reject, resolve) => 
        request(url, (error, response, body) => error ? reject(error) : resolve(body)));

// Pure JSON parser which returns an Either instead of an error
const parse = Either.try(JSON.parse);

// Function that will try to parse JSON and convert the resulting either into another Task
const getJSON = (url) => 
    httpGet(url)
    .map(parse)
    .chain(eitherToTask);

/**
 * Gets the head of an array and wraps it in an Either
 * [a] -> Either a
 */
const first = (arr) => Either.fromNullable(arr[0]);

/**
 * Converts an Either to a Task.
 * Either a -> Task a
 */
const eitherToTask = (either) => either.fold(Task.rejected, Task.of);

/**
 * Gets the data for a hero by name from the Marvel API
 * String -> Task | Either  
 */
const findHeroData = (name) => 
    getJSON(`${MARVEL_BASE_URL}/characters?name=${name}&orderBy=name&limit=1&${fullMarvelAuth(Date.now)}`)
    .map(R.path(['data', 'results']))
    .map(first)
    .chain(eitherToTask);

/**
 * Gets the list of comic book series with the hero in it.
 * String -> [Object]
 */
const comicsSeriesWithHero = (heroId) => 
    getJSON(`${MARVEL_BASE_URL}/characters/${heroId}/series?${fullMarvelAuth(Date.now)}&limit=100`)
    .map((result) => result.data.results);

module.exports = {
    findHeroData,
    comicsSeriesWithHero
};