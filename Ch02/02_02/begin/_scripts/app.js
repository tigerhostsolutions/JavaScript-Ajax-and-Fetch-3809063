'use strict';

/*Used for testing*/
// const geocodioUrl = 'https://api.geocod.io/v1.7/geocode?q=1109+N+Highland+St%2C+Arlington+VA&fields=zip4&api_key=';

const geocodioBaseUrl = 'https://api.geocod.io/v1.7/geocode';
const geocodioApiKey = '65893a866692679386a596456a9368678966378';

// const npsUrl = 'https://developer.nps.gov/api/v1/parks?stateCode=CA&api_key=9M3wbsysJZPbujpJTpYc3ZQIxz6wYGiTGDRaY0IE';
const npsUrl = 'https://developer.nps.gov/api/v1/parks';
const npsApiKey = '9M3wbsysJZPbujpJTpYc3ZQIxz6wYGiTGDRaY0IE';
const npsRequestParams = {
  'params': {
    'stateCode': 'CA',
    'api_key': npsApiKey
  }
};

const addressField = document.querySelector('#address');
const cityField = document.querySelector('#city');
const stateField = document.querySelector('#state');
// const $zipField = $('#zip'); //jQuery example
const zipField = document.querySelector('#zip');

const parkThumb = document.querySelector('#specials h2 img');
const parkSection = document.querySelector('#specials');
const parkName = document.querySelector('#specials h2 a');
const parkDesc = document.querySelector('#specials p');

// const handleGeocodioErrors = (response) => {
//     if (response.ok) return response.json();
//     return response.json()
//         .then(response => {
//             throw new Error(response.error.message || response.error)
//         })
// };

const handleGeocodioErrors = (error) => {
    if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
};

const handleParkErrors = (error) => {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log('Error', error.message);
  }
  console.log(error.config);
};

const handleGeocodioSuccess = (data) => {
    // console.log(data);
    // const zip9 = data.data.results[0].fields.zip4.zip9[0];
    // console.log(zip9)
    // zipField.value = zip9;
    zipField.value = data.zip9;
};

const handleParkSuccess = (data) => {
  console.log(data);
  parkThumb.src = '_images/nps_logo.svg';
  parkName.textContent =data.parkInfo.parkName;
  parkName.href = data.parkInfo.parkHref;
  parkDesc.textContent = data.parkInfo.parkDesc;
  parkSection.classList.remove('hidden');
}

// const createRequest = (url, errors, success) => {
//     fetch(url)
//         .then((response) => errors(response))
//         .then((data) => success(data))
//         .catch((error) => console.error(error))
// };

const zip9Interceptor = axios.interceptors.response.use((data) => {
  if(data.data.results) {
    const baseZip = data.data.results[0].address_components.zip;
    const plus4 = data.data.results[0].fields.zip4.plus4[0];
    console.log(baseZip + '_' + plus4);
    data.zip9 = baseZip + '_' + plus4;
  }
  return data;
});

const parkInterceptor = axios.interceptors.response.use((data) => {
  if(data.data.data) {
    const randNum = Math.floor(Math.random() * (data.data.data.length));
    data.parkInfo = {
      parkName: data. data.data[randNum].fullName,
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
        .catch((error) => console.error(error))
};

// let checkCompletion = () => {
//   if(addressField.value !== '' &&
//     cityField.value !== '' &&
//     stateField.value !== '') {
//         const requestUrl = geocodioBaseUrl + 
//         addressField.value +  '+' +
//         cityField.value + '+' +
//         stateField.value + '+' +
//         '&fields=zip4' + 
//         '&api_key=' +
//         geocodioApiKey;
//         createRequest(requestUrl, handleGeocodioErrors, handleGeocodioSuccess);
//     }
// };

let checkCompletion = () => {
  if(addressField.value !== '' &&
    cityField.value !== '' &&
    stateField.value !== '') {
    const params =  {
      params: {
        'q': addressField.value +  '+' +
            cityField.value + '+' +
            stateField.value,
        'fields' : 'zip4',
        'api_key': geocodioApiKey
      }
    }  
    createRequest(geocodioBaseUrl, handleGeocodioErrors, handleGeocodioSuccess, params);
  }
};

/* Used for testing*/
// createRequest(geocodioUrl);

window.addEventListener('DOMContentLoaded', () => {
  createRequest(npsUrl, handleParkErrors, handleParkSuccess, npsRequestParams);
})

addressField.addEventListener('blur', checkCompletion);
cityField.addEventListener('blur', checkCompletion);
stateField.addEventListener('blur', checkCompletion);
