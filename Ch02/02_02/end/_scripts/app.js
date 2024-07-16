'use strict';

const geocodioUrl = 'https://api.geocod.io/v1.7/geocode?q=1109+N+Highland+St%2C+Arlington+VA&fields=zip4&api_key=6685cecc728ce276c6e82c17278888218268186';

const createRequest = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => console.log(data));
};

createRequest(geocodioUrl);