const Task = require('data.task');
const Marvel = require('./marvel');
const R = require('ramda');
const { List } = require('immutable-ext');

// Task to represent the side effect of arguments passed to script.
const argv = new Task((reject, resolve) => resolve(process.argv));
const superheroes = argv.map(args => args.slice(2)); // Get every argument passed after the first 2

/**
 * Semigroup to represent the intersection of comic book series. 
 * [a] -> [a]
 */   
const Intersection = (arr) => 
({
    arr,
    concat: ({arr: arr2}) => 
        Intersection(arr.filter(arrElement => arr2.some((arr2Element) => arrElement.id == arr2Element.id)))
});

/**
 * Gets the comic book series that a hero is involved in.
 * String a -> [b]
 */
const comicsSeries = (name) => 
    Marvel.findHeroData(name)
    .map(hero => hero.id)
    .chain(Marvel.comicsSeriesWithHero)
    .map(comics => 
        comics.map(({ id, title, description }) => 
            ({ id, title, description })
        ));
        
/**
 * Folds both of the arrays of comic books. Returns the intersection of the 2D array.
 */
const comicsSeriesIntersection = (comicsSeries) =>  comicsSeries.foldMap(Intersection).arr;

const main = (heroNames) => 
    List(heroNames)
    .traverse(Task.of, comicsSeries)
    .map(comicsSeriesIntersection);

// Runs the application and either prints out the result or an error.
superheroes
    .chain(main)
    .fork(console.error, console.log);

