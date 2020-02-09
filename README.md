# Calculate day length for exoplanets

This library is designed to calculate the length of the day on explanets. 
The library takes in parameters about the exoplanet, with defaults set to earth parameters. 

Formulae based on [https://worldbuilding.stackexchange.com/a/167909/13378](https://worldbuilding.stackexchange.com/a/167909/13378) by Starfish Prime.

## Current simplifying assumptions

These assumptions simplify the math, but make the result incorrect in some scenarios.
Pull requests to fix these welcome.

 - The most recent solstice was winter solstice, which came 349 days into the year. This **will make results wrong**
 - Average solar day length is equal to day length. This [isn't actually true](https://en.wikipedia.org/wiki/Equation_of_time#Equation_of_time) and will throw answers off by a few minutes (roughly 4 minutes for earth).
 - The orbit is roughly circular. Rather than calculating the exact apparent angular size of the sun, it calculates the apparent angular size of the sun at aphelion. 
 - The earth year is exactly 365 days. This will only cause problems when using it as a default.

## Other notes

 - Solar radius is only used to calculate the apparent size of the sun, such that "setting" means the rim of the sun (ie, not the center of the sun) is below the horizon. You can pass 0 for solar radius to pretend it is a point source.
 - Refraction at sunset has a default from the earth. Calculating it is [somewhat involved](https://en.wikipedia.org/wiki/Atmospheric_refraction#Calculating_refraction). You can pass 0 for no atmosphere, assume your exoplanet has an earth-like atmosphere (it probably doesn't, but this isn't that big a factor), or do the calculation yourself.

## License
MIT 

