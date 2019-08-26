//console.log('Client-side js file is loaded');
const weatherFrm = document.querySelector('form');
const search = document.querySelector('input');
const errMsg = document.querySelector('#errMsg');
const forecastMsg = document.querySelector('#forecastMsg');

//const host = process.env.HOST || 'http://localhost:3000';

errMsg.textContent = '';
forecastMsg.textContent = '';

//wire events
weatherFrm.addEventListener('submit', (e) => {
    e.preventDefault();
    forecastMsg.textContent = 'Loading...';

    const location = search.value;
    console.log(location);
    const endPoint = '/weather?address=' + location;
    const apiEndPoint = '/api/weather?address=' + location;
    fetch(apiEndPoint)
        .then((response) => {
            response.json().then(data => {
                console.log(data);
                if (data.error) {
                    console.log('Error', data.error);
                    errMsg.textContent = data.error;
                    forecastMsg.textContent = "";
                } else if (data.message) {
                    console.log('Error', data.message);
                    errMsg.textContent = data.message;
                    forecastMsg.textContent = "";
                } else {
                    console.log(data.forecastData);
                    forecastMsg.textContent = data.forecastData.forecast;
                    errMsg.textContent = "";
                }
            });
        });
    //uncomment to redirect to weather route
    //window.location.href = endPoint;
});
