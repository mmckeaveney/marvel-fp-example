const Marvel = require('./marvel');

const superheroes = process.argv.slice(2); // Get every argument passed after the first 2

const main = (heroNames) => Marvel.getCommonComicStories(heroNames); 

main(superheroes);

