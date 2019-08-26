const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');


// define paths for express config
const publicDir = path.join(__dirname, '../public');
const viewsDir = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

const appName = 'Weather Forecast';
const author = 'Oluwole Olubodun';
const authorAlias = 'Bigdadi';

//setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsDir);
hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(publicDir));

//setup default route
app.get('', (req, res) => {
    res.render('index', {
        title: appName,
        name: author
    });
});

//setup about route
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About ' + appName,
        name: author,
        authorAlias: authorAlias
    });
});

//setup help route
app.get('/help', (req, res) => {
    res.render('help', {
        title: appName + ' - Help',
        message: 'This is a test help message',
        name: author
    });
});

app.get('/api/weather', (req, res) => {
    //console.log(req.query.address);
    if (!req.query.address) {
        return res.send({
            title: appName + ' - missing location',
            name: author,
            message: 'Please provide a location to fetch weather forecast for.'
        });
    }
    getCoords(req.query.address, (error, {
        coords,
        placeName
    } = {}) => {
        if (error) {
            //console.log(error.showStyle(error.info));
            res.send({
                title: appName,
                name: author,
                error: error.info
            });
        } else {
            getWeatherInfo(coords, placeName, (err, {
                info,
                locationData,
                summaryData,
                lowHighData,
                currentConditionData,
                precipChanceData,
                showStyle
            }) => {
                console.log('Getting weather forecast information...');
                if (err) {
                    //console.log(err.showStyle(err.info));
                    res.send({
                        title: appName,
                        name: author,
                        error: err.info
                    });
                } else {
                    //console.log(showStyle(info));
                    res.send({
                        title: appName,
                        name: author,
                        forecastData: {
                            forecast: info,
                            summary: summaryData,
                            lowHigh: lowHighData,
                            condition: currentConditionData,
                            chance: precipChanceData,
                            location: locationData //req.query.address
                        }
                    });
                }
            });
        }
    });
});

app.get('/weather', (req, res) => {
    console.log(req.query.address);
    if (!req.query.address) {
        return res.render('404', {
            title: appName + ' - missing location',
            name: author,
            message: 'Please provide a location to fetch weather forecast for.'
        });
    }
    getCoords(req.query.address, (error, {
        coords,
        placeName
    } = {}) => {
        if (error) {
            //console.log(error.showStyle(error.info));
            return res.render('404', {
                title: appName + ' - missing location',
                name: author,
                message: error.info
            });
        } else {
            getWeatherInfo(coords, placeName, (err, {
                info,
                locationData,
                summaryData,
                lowHighData,
                currentConditionData,
                precipChanceData,
                showStyle
            }) => {
                //console.log('Weather forecast information: ');
                if (err) {
                    console.log(err.showStyle(err.info));
                    res.render('404', {
                        title: appName,
                        name: author,
                        error: err.info
                    });
                } else {
                    //console.log(showStyle(info));
                    res.render('weather', {
                        title: appName,
                        name: author,
                        data: {
                            forecast: info,
                            summary: summaryData,
                            lowHigh: lowHighData,
                            condition: currentConditionData,
                            chance: precipChanceData,
                            location: locationData //req.query.address
                        }
                    });
                }
            });
        }
    });
});


//help specific route
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: appName + ' - Oops...',
        name: author,
        message: 'Help article not found'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: appName + ' - Oops...',
        name: author,
        message: 'Oops, page content appears to have gone walkies...'
    });
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
