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

//setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsDir);
hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(publicDir));

//setup default route
app.get('', (req, res) => {
    res.render('index', {
        title: 'Playground - Weather App',
        name: 'Oluwole Olubodun'
    });
});

//setup about route
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Weather App',
        name: 'Oluwole Olubodun'
    });
});

//setup help route
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Weather App - Online Help',
        message: 'This is a test help message',
        name: 'Oluwole Olubodun'
    });
});


// //localhost
// app.get('', (req, res) => {
//     res.send('Hello world express!!!');
// });

// //localhost/api
// app.get('/api', (req, res) => {
//     res.send('Welcome to api!');
// });

// //localhost/api/prv
// app.get('/api/prv', (req, res) => {
//     res.send('Welcome to api - private read-write path!');
// });

// //localhost/api/pub
// app.get('/api/pub', (req, res) => {
//     res.send('Welcome to api - public read path!');
// });

// app.get('/about', (req, res) => {
//     res.send('<h1>About</h1>');
// });

app.get('/api/weather', (req, res) => {
    console.log(req.query.address);
    if (!req.query.address) {
        return res.send({
            title: 'Weather App - missing address',
            name: 'Oluwole Olubodun',
            message: 'Please provide an address to fetch its weather forecast'
        });
    } //else {
    getCoords(req.query.address, (error, {
        coords,
        placeName
    } = {}) => {
        if (error) {
            console.log(error.showStyle(error.info));
            res.send({
                title: 'Weather Forecast',
                name: 'Oluwole Olubodun',
                error: error.info
            });
        } else {
            getWeatherInfo(coords, placeName, (err, {
                info,
                showStyle
            }) => {
                console.log('Weather forecast information: ');
                if (err) {
                    console.log(err.showStyle(err.info));
                    res.send({
                        title: 'Weather Forecast',
                        name: 'Oluwole Olubodun',
                        error: err.info
                    });
                } else {
                    console.log(showStyle(info));
                    res.send({
                        title: 'Weather Forecast',
                        name: 'Oluwole Olubodun',
                        forecastData: {
                            forecast: info,
                            location: req.query.address
                        }
                    });
                }
            });
        }
    });

    //}
});

app.get('/weather', (req, res) => {
    console.log(req.query.address);
    if (!req.query.address) {
        return res.render('404', {
            title: 'Weather App - missing address',
            name: 'Oluwole Olubodun',
            message: 'Please provide an address to fetch its weather forecast'
        });
    } //else {
    getCoords(req.query.address, (error, {
        coords,
        placeName
    } = {}) => {
        if (error) {
            console.log(error.showStyle(error.info));
            return res.render('404', {
                title: 'Weather App - missing address',
                name: 'Oluwole Olubodun',
                message: error.info
            });
        } else {
            getWeatherInfo(coords, placeName, (err, {
                info,
                showStyle
            }) => {
                console.log('Weather forecast information: ');
                if (err) {
                    console.log(err.showStyle(err.info));
                    res.render('404', {
                        title: 'Weather Forecast',
                        name: 'Oluwole Olubodun',
                        error: err.info
                    });
                } else {
                    console.log(showStyle(info));
                    res.render('weather', {
                        title: 'Weather Forecast',
                        name: 'Oluwole Olubodun',
                        data: {
                            forecast: info,
                            location: req.query.address
                        }
                    });
                }
            });
        }
    });

    //}
});

// app.get('/weather/', (req, res) => {
//     res.render('weather', {
//         title: 'Weather Forecast',
//         name: 'Oluwole Olubodun',
//         data: [{
//             forecast: 'Light rain',
//             location: 'London'
//         }, {
//             forecast: 'Sunny spells',
//             location: 'Frankfurt'
//         }]
//     });
// });


app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'Search term required'
        });
    } //else {
    console.log(req.query);
    res.send({
        products: []
    });
    //}
});

//help specific route
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Weather App - Page not found',
        name: 'Oluwole Olubodun',
        message: 'Help article not found'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Weather App - Page not found',
        name: 'Oluwole Olubodun',
        message: 'Oops, page content appears to have gone walkies...'
    });
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
