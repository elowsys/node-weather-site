//console.log('Client-side js file is loaded');
const weatherFrm = document.querySelector('form');
const search = document.querySelector('input');
const errMsg = document.querySelector('#errMsg');
const forecastMsg = document.querySelector('#forecastMsg');

errMsg.textContent = '';
forecastMsg.textContent = '';

//wire events
weatherFrm.addEventListener('submit', (e) => {
    e.preventDefault();
    forecastMsg.textContent = 'Loading...';

    const location = search.value;
    console.log(location);
    const endPoint = 'http://localhost:3000/weather?address=' + location;
    const apiEndPoint = 'http://localhost:3000/api/weather?address=' + location;
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
    window.location.href = endPoint;
});
