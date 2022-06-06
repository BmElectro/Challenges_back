const express = require("express");
const app = express();
const cors = require('cors')

require('dotenv').config()

app.use(cors())

app.use(express.json({ extended: false }));
const axios = require('axios').default;




const port = 8080
const apiKey = process.env.APIKEY

async function getSummoner(summonerName){
    try {
        const summoner = await axios.get(`https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`)
        console.log(summoner)
        return summoner.data
    } catch (error) {
        return error
    }
}
async function getChallengesIds(){
    try {
        const challengesIds = await axios.get(`https://eun1.api.riotgames.com/lol/challenges/v1/challenges/config?api_key=${apiKey}`)
        
        return challengesIds.data
    } catch (error) {
        return error
    }
}
async function getChallenges(summoner){
    try {
        const challengesIds = await axios.get(`https://eun1.api.riotgames.com/lol/challenges/v1/player-data/${summoner.puuid}?api_key=${apiKey}`)
        
        return challengesIds.data
    } catch (error) {
        return error
    }
}
function convertTime(unix_timestamp){

    let date = new Date(unix_timestamp);
   
    let hours = date.getHours();
    
    let minutes = date.getMinutes();
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    let seconds = date.getSeconds();
   
    let formattedTime = hours + ':' + minutes + ':' + seconds;


}



app.get("/", function (req, res) {
    res.send('bla bla bla')
})
app.get("/getchallenges", async function (req, res) {

    const summonerName = req.query.sumname

    const ids = await getChallengesIds()
    const summoner = await getSummoner(summonerName)
    const challenges = await getChallenges(summoner)
    

        ///el => el.challengeId = ids[el.challengeId].localizedNames.en_US
    let challengesWithNames = []
    for (chall of challenges.challenges){
        const [challengeNameString] = ids.filter(e => e.id == chall.challengeId)

        //console.log(challengeNameString.localizedNames.en_US)
        chall.challengeId = challengeNameString.localizedNames.en_US.name
        challengesWithNames.push(chall)
    } 
    challenges.challenges = challengesWithNames
    
    
    res.send(JSON.stringify(challenges))
})

// app.get("/api/getName", function (req, res) {
//     res.send(JSON.stringify(my.localizedNames.en_US))
// })







app.listen(process.env.PORT || port)