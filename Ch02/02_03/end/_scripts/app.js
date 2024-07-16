'use strict';

const geocodioUrl = 'https://api.geocod.io/v1.7/geocode?q=1109+N+Highland+St%2C+Arlington+VA&fields=zip4&api_key=6685cecc728ce276c6e82c17278888218268186';

const handleErrors = (response) => {
   if (response.ok) return response.json();
   return response.json()
     .then(response => {throw new Error(response.error.message || response.error)})
};
const handleSuccess = (data) => {
  console.log(data)
};

const createRequest = (url) => {
  fetch(url)
    .then((response) => handleErrors(response))
    .then((data) => handleSuccess(data))
    .catch((error) => console.error(error))
};

createRequest(geocodioUrl);