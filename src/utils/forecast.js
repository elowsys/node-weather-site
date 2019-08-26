const yargs = require('yargs');
const request = require('request');
const chalk = require('chalk');

const showErr = chalk.bold.bgWhite.red.inverse;
const showInfo = chalk.bold.bgBlack.cyan.inverse;
const showSecondary = chalk.bold.bgWhite.black.inverse;
const showSuccess = chalk.bold.bgBlack.green.inverse;
const showWarning = chalk.bold.bgBlack.yellow.inverse;

getWeatherInfo = (coords, placeName, callback) => {

    let url = `https://api.darksky.net/forecast/64615a525024cd2cd7c31944d9f9cdc2/${coords}?exclude=minutely&units=uk2`;
    console.log(url);
    request({
        url,
        json: true
    }, (err, {
        body
    }) => {
        if (err) {
            callback({
                info: 'Unable to continue: unable to reach darksky weather service',
                showStyle: showErr
            });
        } else if (body.error) {
            callback({
                info: body.error,
                showStyle: showErr
            });
        } else {
            if (!placeName) {
                placeName = `LON: ${body.longitude}, LAT: ${body.latitude}`;
            }
            const tz = body.timezone;
            const currently = body.currently;
            const todayData = body.daily.data[0];
            const locationName = `${placeName} in ${tz}`;
            const lowHigh = `Minimum of ${todayData.apparentTemperatureLow} and a high of ${todayData.apparentTemperatureHigh} celcius`;
            const currentCondition = `It is currently ${currently.temperature}`;
            const precipChance = `There is a ${currently.precipProbability}% chance of rain`;
            var sunrises = new Date(todayData.sunriseTime);
            var sunsets = new Date(todayData.sunsetTime);
            const sunRiseSet = `Sunrise at ${sunrises.toLocaleTimeString(undefined,{hour: '2-digit', minute: '2-digit', second: '2-digit'})} and sunset at ${sunsets.toLocaleTimeString(undefined,{hour: '2-digit', minute: '2-digit', second: '2-digit'})}`;
            const msg = `${placeName} in ${tz}, it's ${todayData.summary} with a minimum of ${todayData.temperatureLow} and a high of ${todayData.temperatureHigh} celcius.  ${currentCondition} degrees out. ${precipChance}`;
            const uvIndex = todayData.uvIndex;
            console.log('today', todayData);
            callback(undefined, {
                info: msg,
                locationData: locationName,
                summaryData: todayData.summary,
                lowHighData: lowHigh,
                currentConditionData: currentCondition,
                precipChanceData: precipChance,
                sunRiseSetData: sunRiseSet,
                uvIndexData: uvIndex,
                showStyle: showInfo
            });
            console.log(sunrises);
            console.log(sunsets);
        }
    });
};

module.exports = getWeatherInfo;
