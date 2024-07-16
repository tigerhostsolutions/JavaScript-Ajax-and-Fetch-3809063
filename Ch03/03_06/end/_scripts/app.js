'use strict';

// const geocodioUrl = 'https://api.geocod.io/v1.7/geocode?q=1109+N+Highland+St%2C+Arlington+VA&fields=zip4&api_key=6685cecc728ce276c6e82c17278888218268186';

const geocodioBaseUrl = 'https://api.geocod.io/v1.7/geocode?q=';
const geocodioApiKey = '6685cecc728ce276c6e82c17278888218268186'

const npsUrl = 'https://developer.nps.gov/api/v1/parks?stateCode=CA&api_key=CNJUTrcuXaoHqVeIxmB8d0GMVLQd0WfCU7zfThQK';

const addressField = document.querySelector('#address');
const cityField = document.querySelector('#city');
const stateField = document.querySelector('#state');
// const $zipField = $('#zip');
const zipField = document.querySelector('#zip');

const handleGeocodioErrors = (response) => {
   if (response.ok) return response.json();
   return response.json()
     .then(response => {throw new Error(response.error.message || response.error)})
};

const handleParkErrors = (response) => {
   if (response.ok) return response.json();
   return response.json()
     .then(response => {throw new Error(response.error.message || response.error)})
};

const handleGeocodioSuccess = (data) => {
  // console.log(data)
  const zip9 = data.results[0].fields.zip4.zip9[0];
  // console.log(zip9);
  zipField.value = zip9;
};

const handleParkSuccess = (data) => {
  console.log(data);
}

const createRequest = (url, errors, success) => {
  fetch(url)
    .then((response) => errors(response))
    .then((data) => success(data))
    .catch((error) => console.error(error))
};

let checkCompletion = () => {
  if (addressField.value !== '' &&
    cityField.value !== '' &&
    stateField.value !== '') {
    const requestUrl = geocodioBaseUrl + 
      addressField.value + '+' + 
      cityField.value + '+' + 
      stateField.value +
      '&fields=zip4' +
      '&api_key=' + geocodioApiKey;
    createRequest(requestUrl, handleGeocodioErrors, handleGeocodioSuccess);
  }
}

// createRequest(geocodioUrl);
createRequest(npsUrl, handleParkErrors, handleParkSuccess);

addressField.addEventListener('blur', checkCompletion);
cityField.addEventListener('blur', checkCompletion);
stateField.addEventListener('blur', checkCompletion);
