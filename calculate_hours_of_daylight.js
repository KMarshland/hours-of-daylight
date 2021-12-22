/*
 * Helpers for calculating hours of daylight on an arbitrary planet
 * Code by Kai Marshland; equations from https://worldbuilding.stackexchange.com/a/167909/13378 by Starfish Prime
 * MIT Licence
 */

/**
 * Calculates the true anomaly for a given day
 *
 * @param {Number} orbitDay     - days since perihelion (closest approach to the sun), starting from 0. 35 on 2020-02-08 for earth
 * @param {Number} daysPerYear  - how many days it takes your planet to circle the sun. 365 for earth
 * @param {Number} eccentricity - eccentricity of the orbit. 0.0167 for earth
 * @return {Number} true anomaly IN RADIANS
 */
function calculateTrueAnomaly(orbitDay, daysPerYear, eccentricity) {
    // mean anomaly in radians. https://en.wikipedia.org/wiki/Mean_anomaly#Definition
    const M = 2 * Math.PI * orbitDay/daysPerYear;
    const e = eccentricity;

    // https://en.wikipedia.org/wiki/True_anomaly#From_the_mean_anomaly
    return M + (2*e - 0.25*(e**3))*Math.sin(M) + 5/4*(e**2)*Math.sin(2*M) + 13/12*(e**3)*Math.sin(3*M);
}

/**
 * Calculates the angular velocity given the true anomaly and orbital characteristics
 *
 * @param {Number} trueAnomaly      - true anomaly for the day, in radians
 * @param {Number} semiMajorAxis    - distance from the planet to the sun at its furthest point in meters. 149.60×10^6 km for earth
 * @param {Number} eccentricity     - eccentricity of the orbit. 0.0167 for earth
 * @param {Number} massOfSun        - mass of the sun, in kg. 1.989 x 10^30 kg for Sol
 * @param {Number} gravitationalConstant - 6.67408 x 10^-11 m^3/(kg*s^2) under current laws of physics
 * @return {Number} angular velocity in radians per second
 */
function calculateAngularVelocity(trueAnomaly, semiMajorAxis, eccentricity, massOfSun, gravitationalConstant=6.67408e-11) {
    const v = trueAnomaly;
    const a = semiMajorAxis;
    const e = eccentricity;
    const G = gravitationalConstant;
    const M = massOfSun;

    const h = Math.sqrt(G*M*a*(1 - (e**2)));

    const r = (a*(1 - (e**2)))/(1 + e*Math.cos(v));

    return h/(r**2);
}

/**
 * Calculates the mean solar angular velocity in radians per second
 *
 * @param {Number} secondsPerDay - number of seconds in a day. 24*60*60 (ish) on earth
 * @return {number}
 */
function calculateSolarMeanAngularVelocity(secondsPerDay) {
    return 2*Math.PI/secondsPerDay;
}

/**
 * Calculates the length of the path of the sun across the sky
 *
 * @param {Number} trueAnomaly   - true anomaly for the day, in radians
 * @param {Number} latitude      - latitude in degrees of the point you care about
 * @param {Number} daysPerYear   - how many days it takes your planet to circle the sun. 365 for earth
 * @param {Number} eccentricity  - eccentricity of the orbit. 0.0167 for earth
 * @param {Number} axialTilt     - how much the planet is tilted, in degrees. -23.44 for earth
 * @param {Number} semiMajorAxis - distance from the planet to the sun at its furthest point in meters. 149.60×10^6 km for earth
 * @param {Number} solarRadius   - radius of the sun in meters. 695500 kilometers for the sun
 * @param {Number} refractionAtSunset   - how much atmospheric refraction distends the sun at sunset, in degrees. 0.3 degrees on earth
 * @param {Boolean} debug        - whether or not to print partial results
 * @return {Number}
 */
function calculateAngularSolarPathLength(trueAnomaly, latitude, {daysPerYear, lastSolsticeDay, eccentricity, axialTilt, semiMajorAxis, solarRadius, refractionAtSunset}, debug=true) {
    const theta = axialTilt * Math.PI/180; // axial tilt in radians
    const phi = latitude * Math.PI/180; // latitude in radians

    const solsticeAnomaly = calculateTrueAnomaly(lastSolsticeDay, daysPerYear, eccentricity);
    if (debug) {
        console.log(`Solstice anomaly is ${(solsticeAnomaly*180/Math.PI).toFixed(2)} degrees`)
    }

    // https://en.wikipedia.org/wiki/Position_of_the_Sun#Calculations
    const solarDeclination = theta * Math.cos(trueAnomaly - solsticeAnomaly);
    if (debug) {
        console.log(`Solar declination is ${(solarDeclination*180/Math.PI).toFixed(2)} degrees`)
    }

    // if we were assuming the sun were a point source, we would have const pm_cos_omega_0 = -Math.tan(phi)*Math.tan(solarDeclination);
    // instead, use https://en.wikipedia.org/wiki/Sunrise_equation#Generalized_equation
    const solarDiscCenter = -2*Math.asin(solarRadius/semiMajorAxis) - refractionAtSunset*Math.PI/180;
    if (debug) {
        console.log(`Solar disc center is ${(solarDiscCenter*180/Math.PI).toFixed(2)} degrees`)
    }

    const pm_cos_omega_0 = (Math.sin(solarDiscCenter) - Math.sin(phi) * Math.sin(solarDeclination))/(Math.cos(phi) * Math.cos(solarDeclination));

    return 2 * Math.acos(pm_cos_omega_0);
}

/**
 * Returns the length of the day for a given latitude and orbital parameters in hours
 *
 * @param {Number} orbitDay         - days since perihelion (closest approach to the sun), starting from 0. 35 on 2020-02-08 for earth
 * @param {Number} daysPerYear      - how many days it takes your planet to circle the sun. 365 for earth
 * @param {Number} eccentricity     - eccentricity of the orbit. 0.0167 for earth
 * @param {Number} semiMajorAxis    - distance from the planet to the sun at its furthest point in meters. 149.60×10^6 km for earth
 * @param {Number} massOfSun        - mass of the sun, in kg. 1.989 x 10^30 kg for Sol
 * @param {Number} axialTilt        - how much the planet is tilted, in degrees. -23.44 for earth
 * @param {Number} latitude         - latitude in degrees of the point you care about
 * @param {Number} secondsPerDay    - number of seconds in a day. 24*60*60 (ish) on earth
 * @param {Number} solarRadius      - radius of the sun in meters. 695500 kilometers for the sun
 * @param {Number} refractionAtSunset   - how much atmospheric refraction distends the sun at sunset, in degrees. 0.3 degrees on earth
 * @param {Number} lastSolsticeDay  - day of the most recent solstice. Without orbital eccentricities
 * @param {Boolean} debug           - whether or not to print partial results
 * @return {Number}
 */
function calculateHoursOfDaylight({ orbitDay, latitude, lastSolsticeDay=349, secondsPerDay=24*60*60, daysPerYear=365.259, eccentricity=0.0167, semiMajorAxis= 1496e8, massOfSun=1.989e30, axialTilt=-23.44, solarRadius=696.34e6, refractionAtSunset=0.3 }={}, debug=false) {
    const v = calculateTrueAnomaly(orbitDay, daysPerYear, eccentricity);

    if (debug) {
        console.log(`True anomaly is ${(v * 180 / Math.PI).toFixed(2)} degrees`);
    }

    const r = calculateAngularVelocity(v, semiMajorAxis, eccentricity, massOfSun);
    if (debug) {
        console.log(`Angular velocity is ${(10e4 * r * 180 / Math.PI).toFixed(2)} x 10^-5 degrees per second`);
    }

    const angularSolarPathLength = calculateAngularSolarPathLength(v, latitude, {
        daysPerYear, eccentricity, axialTilt, semiMajorAxis, solarRadius, refractionAtSunset, lastSolsticeDay
    }, debug);
    if (debug) {
        console.log(`Angular solar path length is ${(angularSolarPathLength * 180 / Math.PI).toFixed(2)} degrees`);
    }

    const dayLength = angularSolarPathLength/calculateSolarMeanAngularVelocity(secondsPerDay);
    if (debug) {
        console.log(`Day length length is ${Math.round(dayLength)} seconds`);
    }

    return dayLength/60/60;
}

module.exports = calculateHoursOfDaylight;
