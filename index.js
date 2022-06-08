const express = require("express");
const app = express();
const cors = require('cors')

require('dotenv').config()

app.use(cors())

app.use(express.json({ extended: false }));
const axios = require('axios').default;
//const clash = require("./api/clash");



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

//app.use("/clash", clash);

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
        chall.challengeText = challengeNameString.localizedNames.en_US.description
        challengesWithNames.push(chall)
    } 
    challenges.challenges = challengesWithNames
    
    
    res.send(JSON.stringify(challenges))
})
// "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summonerr_name}?api_key={APiKeys}" summ PUID
// "https://eun1.api.riotgames.com/lol/clash/v1/players/by-summoner/{summoner_Id}?api_key={APiKeys}"   get team
// "https://eun1.api.riotgames.com/lol/clash/v1/teams/{team_Id}?api_key={APiKeys}" get the rest of the team 
//  https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=100&api_key={apikey}    get match list
// https://europe.api.riotgames.com/lol/match/v5/matches/{match_ID}?api_key={apikey}   get single match info





app.listen(process.env.PORT || port)