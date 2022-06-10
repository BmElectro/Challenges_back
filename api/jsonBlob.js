const axios = require('axios').default;

async function update(matchId, matchDetails){
    const currentJsonBlob = await axios.get('https://jsonblob.com/api/jsonBlob/983950733061931008')
    if(!Object.keys(currentJsonBlob.data).includes(matchId)){
        currentJsonBlob.data[matchId] = matchDetails
        await axios.put('https://jsonblob.com/api/jsonBlob/983950733061931008', currentJsonBlob.data)
    }
}
async function get(){
    const currentJsonBlob = await axios.get('https://jsonblob.com/api/jsonBlob/983950733061931008')
    return currentJsonBlob.data
}

async function checkIfMatchIn(matchId){
    const currentJsonBlob = await axios.get('https://jsonblob.com/api/jsonBlob/983950733061931008')
    if(Object.keys(currentJsonBlob.data).includes(matchId)){
      return true
    }else{
        return false
    }
}
async function getSingleMatchFrom(matchId){
    const currentJsonBlob = await axios.get('https://jsonblob.com/api/jsonBlob/983950733061931008')
    if(Object.keys(currentJsonBlob.data).includes(matchId)){
      return currentJsonBlob.data[matchId]
    }else{
        return {}
    }
}

module.exports = {
    update,
    get,
    checkIfMatchIn,
    getSingleMatchFrom,
}