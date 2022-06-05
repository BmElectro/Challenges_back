const express = require("express");
const app = express();
//const product = require("./api/product");


app.use(express.json({ extended: false }));
const axios = require('axios').default;




const port = 8080
const host = '127.0.0.1'
const apiKey = process.env.APIKEY
try {
    async function getSummoner(){
    // const urlSummoner = ``
    // const summonerTemp = await fetch(urlSummoner);
    // const summoner = await summonerTemp.json();
    try {
        const summoner = await axios.get(`https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/KenrouHolo?api_key=${apiKey}`)
        console.log(summoner)
        return summoner
    } catch (error) {
        return 'err'
    }

    }
    async function getChallengesIds(){

        try {
            const challengesIds = await axios.get(`https://eun1.api.riotgames.com/lol/challenges/v1/challenges/config?api_key=${apiKey}`)
            console.log(challengesIds)
            return challengesIds
        } catch (error) {
            return 'err'
        }
    }
    async function getChallenges(summoner){

        try {
            const challengesIds = await axios.get(`https://eun1.api.riotgames.com/lol/challenges/v1/player-data/${summoner.puuid}?api_key=${apiKey}`)
            console.log(challengesIds)
            return challengesIds
        } catch (error) {
            return 'err'
        }
    }
    // 
    // console.log(apiKey)
    // const challengesIdsUrl = `https://eun1.api.riotgames.com/lol/challenges/v1/challenges/config?api_key=${apiKey}` 
    // const challengesIdsTemp = await fetch(challengesIdsUrl);
    // const challengesIds = await challengesIdsTemp.json();

   



    // const challengesUrl = `https://eun1.api.riotgames.com/lol/challenges/v1/player-data/${summoner.puuid}?api_key=${apiKey}`
    // const challengesTemp = await fetch(challengesUrl);
    // const challenges = await challengesTemp.json();


    // const [my] = challengesIds.filter(e => e.id == 502003)

    //app.use("/api/product", product);
    app.get("/", function (req, res) {
        res.send('bla bla bla')
    })
    app.get("/getname", async function (req, res) {
        const ids = await getChallengesIds()
        const summoner = await getSummoner()
        const challenges = await getChallenges(summoner)

        res.send(JSON.stringify(challenges))
    })
    
    // app.get("/api/getName", function (req, res) {
    //     res.send(JSON.stringify(my.localizedNames.en_US))
    // })
    

} catch (error) {
    console.log('err')
}







app.listen(process.env.PORT || port)