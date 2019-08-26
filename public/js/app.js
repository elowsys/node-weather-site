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
    //console.log(location);
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
                    forecastMsg.textContent = data.forecastData.summary;
                    forecastMsg.innerHTML = `<p class="text-muted"><strong>Location: </strong>${data.forecastData.location}</p>
                    <p class="text-muted"><strong>Summary: </strong>${data.forecastData.summary}</p >
                    <p class="text-muted"><strong>Low/High: </strong>${data.forecastData.lowHigh}</p>
                    <p class=text-muted"><strong>Currently: </strong>${data.forecastData.condition}</p>
                    <p class="text-muted"><strong>Rain: </strong>${data.forecastData.chance}</p>
                    <p class="text-muted"><strong>UV Index: </strong>${data.forecastData.uvIndex}</p>`;
                    errMsg.textContent = "";
                }
            });
        });
    //uncomment to redirect to weather route
    //window.location.href = endPoint;
});
