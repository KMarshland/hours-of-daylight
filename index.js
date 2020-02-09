const calculateHoursOfDaylight = require('./calculate_hours_of_daylight');

calculateHoursOfDaylight({ orbitDay: 36, latitude: 37.7749 }, true);
console.log('Truth is 38100 seconds');
