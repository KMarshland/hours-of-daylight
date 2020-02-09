# Calculate day length for exoplanets

This library is designed to calculate the length of the day on explanets. 
The library takes in parameters about the exoplanet, with defaults set to earth parameters. 

Formulae based on [https://worldbuilding.stackexchange.com/a/167909/13378](https://worldbuilding.stackexchange.com/a/167909/13378) by Starfish Prime.

## Current simplifying assumptions

These assumptions simplify the math, but make the result incorrect in some scenarios.
Pull requests to fix these welcome.

 - The day length is precisely 24 hours. This will not hold true on most exoplanets and **will make results wrong**
 - The most recent solstice was winter solstice, which came 349 days into the year. This **will make results wrong**
 - The angular size of the sun is the same as that from Sol to Earth. This may throw answers off by a few minutes
 - The earth year is exactly 365 days. This will only cause problems when using it as a default.

## License
MIT 

