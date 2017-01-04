# marvel-fp-example
Interactions with the Marvel comics API using only pure functional constructs. You can pass in several superheroes as command line arguments, and the app will show you all the marvel comic book series that they appear together in.

This little example shows the power of using pure functional programming constructs instead vs mutable and imperative logic. Both of these applications do exactly the same thing, however the code could not be more different.

Run the application by doing the following - 

## Setup
- Get your API keys from - https://developer.marvel.com/
- Once you have your keys, add them to a file called keys.js in the root of the directory. It is important they are named correctly. Here's a template - 
```
const MARVEL_PRIVATE_KEY = "yourPrivateKeyHere";
const MARVEL_API_KEY = "yourPublicKeyHere";

module.exports = {
    MARVEL_PRIVATE_KEY,
    MARVEL_API_KEY
};
```
- cd into the app you want to use - (imperative, functional)
- perform an 
``` npm/yarn install ```

## Running
eg. ``` node index.js Hulk Spider-Man Deadpool ```


## Output
```
[ { id: 16450,
    title: 'A+X (2012 - Present)',
    description: 'Get ready for action-packed stories featuring team-ups from your favorite Marvel heroes every month! First, a story where Wolverine and Hulk come together, and then Captain America and Cable meet up! But will each partner\'s combined strength be enough?' },
  { id: 454,
    title: 'Amazing Spider-Man (1999 - 2013)',
    description: 'Looking for the one superhero comic you just have to read? You\'ve found it! <i>Amazing Spider-Man</i> is the cornerstone of the Marvel Universe. This is where you\'ll find all the big-time action, major storylines and iconic Spider-Man magic you\'d come to expect from the Wall-Crawler.' },
  { id: 13205,
    title: 'Amazing Spider-Man Annual (2011)',
    description: null },
  { id: 1945,
    title: 'Avengers: The Initiative (2007 - 2010)',
    description: null } ]
```

Author: Martin McKeaveney
