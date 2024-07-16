'use strict';

// const geocodioUrl = 'https://api.geocod.io/v1.7/geocode?q=1109+N+Highland+St%2C+Arlington+VA&fields=zip4&api_key=6685cecc728ce276c6e82c17278888218268186';

// const geocodioBaseUrl = 'https://api.geocod.io/v1.7/geocode?q=';
const geocodioBaseUrl = 'https://api.geocod.io/v1.7/geocode';
const geocodioApiKey = '6685cecc728ce276c6e82c17278888218268186'

const npsUrl = 'https://developer.nps.gov/api/v1/parks';
const npsApiKey = 'CNJUTrcuXaoHqVeIxmB8d0GMVLQd0WfCU7zfThQK';
const npsRequestParams = {
  'params': {
    'stateCode': 'CA',
    'api_key': npsApiKey
  }
};

const addressField = document.querySelector('#address');
const cityField = document.querySelector('#city');
const stateField = document.querySelector('#state');
// const $zipField = $('#zip');
const zipField = document.querySelector('#zip');

const parkSection = document.querySelector('#specials');
const parkThumb = document.querySelector('#specials h2 img');
const parkName = document.querySelector('#specials h2 a');
const parkDesc = document.querySelector('#specials p');

// const handleGeocodioErrors = (response) => {
//    if (response.ok) return response.json();
//    return response.json()
//      .then(response => {throw new Error(response.error.message || response.error)})
// };

const handleGeocodioErrors = (error) => {
    if (error.response) {
      console.log(error.response);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error: ', error.message);
    }
    console.log(error.config);
};

const handleParkErrors = (error) => {
    if (error.response) {
      console.log(error.response);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error: ', error.message);
    }
    console.log(error.config);
};

const handleGeocodioSuccess = (data) => {
  // console.log(data)
  // const zip9 = data.data.results[0].fields.zip4.zip9[0];
  // zipField.value = zip9;
  zipField.value = data.zip9;
};

const handleParkSuccess = (data) => {
  console.log(data);
  parkThumb.src = '_images/nps_logo.svg';
  parkName.textContent = data.parkInfo.parkName;
  parkName.href = data.parkInfo.parkHref;
  parkDesc.textContent = data.parkInfo.parkDesc;
  parkSection.classList.remove('hidden');
}

// const createRequest = (url, errors, success) => {
//   fetch(url)
//     .then((response) => errors(response))
//     .then((data) => success(data))
//     .catch((error) => console.error(error))
// };

const zip9Interceptor = axios.interceptors.response.use((data) => {
  if (data.data.results) { // Geocodio response
    const baseZip = data.data.results[0].address_components.zip;
    const plus4 = data.data.results[0].fields.zip4.plus4[0];
    console.log(baseZip + "-" + plus4);
    data.zip9 = baseZip + "-" + plus4;
  } 
  return data;
});

const parkInterceptor = axios.interceptors.response.use((data) => {
  if (data.data.data) { // National Park Service response
    const randNum = Math.floor(Math.random() * (data.data.data.length));
    data.parkInfo = {
      parkName: data.data.data[randNum].fullName,
      parkHref: data.data.data[randNum].url,
      parkDesc: data.data.data[randNum].description
    };
  }
  return data;
});

const createRequest = (url, errors, success, params) => {
  axios.get(url, params)
    // .then((response) => errors(response))
    .then((data) => success(data))
    .catch((error) => errors(error))
}

// let checkCompletion = () => {
//   if (addressField.value !== '' &&
//     cityField.value !== '' &&
//     stateField.value !== '') {
//     const requestUrl = geocodioBaseUrl + 
//       addressField.value + '+' + 
//       cityField.value + '+' + 
//       stateField.value +
//       '&fields=zip4' +
//       '&api_key=' + geocodioApiKey;
//     createRequest(requestUrl, handleGeocodioErrors, handleGeocodioSuccess);
//   }
// }

let checkCompletion = () => {
  if (addressField.value !== '' &&
    cityField.value !== '' &&
    stateField.value !== '') {
    const params = {
      params: {
        'q': addressField.value + '+' + 
          cityField.value + '+' + 
          stateField.value,
        'fields': 'zip4',
        'api_key': geocodioApiKey
      }
    };
    createRequest(geocodioBaseUrl, handleGeocodioErrors, handleGeocodioSuccess, params);
  }
}

// createRequest(geocodioUrl);
window.addEventListener('DOMContentLoaded', () => {
  createRequest(npsUrl, handleParkErrors, handleParkSuccess, npsRequestParams);
});

addressField.addEventListener('blur', checkCompletion);
cityField.addEventListener('blur', checkCompletion);
stateField.addEventListener('blur', checkCompletion);
