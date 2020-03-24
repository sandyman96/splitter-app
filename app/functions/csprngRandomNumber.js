var randomNumber = require("random-number-csprng");

let promise = function(min, max){
  return new Promise( (resolve, reject) => {
  try{
    let randomNo  =  randomNumber(min, max);
    resolve(randomNo);
  }catch(err){
    reject(err);
  }
})
}
;

module.exports = promise;
