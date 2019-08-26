const yargs = require('yargs');
const request = require('request');
const chalk = require('chalk');

const showErr = chalk.bold.bgWhite.red.inverse;
const showInfo = chalk.bold.bgBlack.cyan.inverse;
const showSecondary = chalk.bold.bgWhite.black.inverse;
const showSuccess = chalk.bold.bgBlack.green.inverse;
const showWarning = chalk.bold.bgBlack.yellow.inverse;

const mapboxToken = 'pk.eyJ1Ijoid29sZXhpZSIsImEiOiJjano1YWUwMWQwOXdqM2Z0NGl0Ym11amNiIn0.d4s9dAiXBoeX2QrlSOO5xw';

//get the coordinates from location
getCoords = (locationName, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationName)}.json?access_token=${mapboxToken}`;
    request({
        url,
        json: true
    }, (err, {
        body
    }) => {
        //check for errors
        if (err) {
            callback({
                info: 'Network connection error - failed to reach mapbox service',
                showStyle: showErr
            });
        } else if (body.error) {
            callback({
                info: body.error,
                showStyle: showErr
            });
        } else if (!body.features) {
            callback({
                info: 'Location name not supplied',
                showStyle: showWarning
            });
        } else if (!body.features[0]) {
            callback({
                info: 'Unable to find location',
                showStyle: showWarning
            });
        } else {
            const coordinates = body.features[0].geometry.coordinates;
            const coords = [coordinates[0], coordinates[1]];
            const placeName = body.features[0].place_name;
            console.log('coordinates: ', coordinates);
            callback(undefined, {
                coords,
                placeName,
                showStyle: showInfo
            });
        }
    });
};

module.exports = getCoords;
