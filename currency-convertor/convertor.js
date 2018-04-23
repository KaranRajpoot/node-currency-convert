var axios = require("axios");

var CustomError = function (code,msg,info) {
  return {code:code,message:msg,info:info};
}

var getCountries = function (currencyCode) {
return axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`).then(function (response) {
  return response.data.map(function (country) {
    return country.name;
  });
}).catch(function (e) {
  throw new CustomError(101,`could not find countries list for ${currencyCode}`,'');
});
};

var getExchangeRate = function (from,to) {
return axios.get(`http://data.fixer.io/api/latest?access_key=f0d5ae1234d6ddae13a965abdc81c491&format=1&base=${from}`).then(function (response) {
  return response.data.rates[to];
}).catch(function (e) {
  throw new CustomError(101,`could not find exchange rate for ${from}`,'');
});

};
var getExchangeRateAlt = async function (from,to) {
  try {
var response = await axios.get(`http://data.fixer.io/api/latest?access_key=f0d5ae1234d6ddae13a965abdc81c491&format=1&base=${from}`);
 var rate =  response.data.rates[to];
 if(rate){
   return rate;
 }else {
   throw new Error(`Unable to get exchange rate for ${from} and ${to}`);
 }
}catch(e){
  throw new Error(`Unable to get exchange rate for ${from} and ${to}`);
}
};
var getCountriesAlt = async function (currencyCode) {
try {
 var response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
 return response.data.map(function (country) {
  return country.name;
});
}
catch(e){
  throw new Error(`Unable to get country that used ${currencyCode}`);
}
};
var convertCurrency = function (from,to,amount) {
return  getCountries(to).then(function (countries) {
  return  getExchangeRate(from,to).then(function (rate) {
      return `${amount} ${from} worth of ${rate*amount} ${to} used in ${countries}`;
    });
  });

};
var convertCurrencyAlt = async function (from,to,amount) {
  var countries = await getCountriesAlt(to);
  var rates = await getExchangeRateAlt(from,to);
  return `${amount} ${from} worth of ${rates*amount} ${to} used in ${countries}`;
};
// convertCurrencyAlt("EUR","USD",100).then(function (status) {
//   console.log(status);
// }).catch(function (e) {
//   console.log(e.message);
// });
convertCurrency("EUR","INR",100).then(function (status) {
  console.log(status);
}).catch(function (e) {
  console.log(e.code + "  "+ e.message);
});
