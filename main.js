import fetch from 'node-fetch';
import cors from 'cors'
import express from 'express'


let app = express()


app.use(cors())
app.use(express.json());


const port = 8080
const host = '127.0.0.1'

try {
    
    const apiKey = process.env.APIKEY

    const challengesIdsUrl = `https://eun1.api.riotgames.com/lol/challenges/v1/challenges/config?api_key=${apiKey}` 
    const challengesIdsTemp = await fetch(challengesIdsUrl);
    const challengesIds = await challengesIdsTemp.json();

    const urlSummoner = `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/KenrouHolo?api_key=${apiKey}`
    const summonerTemp = await fetch(urlSummoner);
    const summoner = await summonerTemp.json();



    const challengesUrl = `https://eun1.api.riotgames.com/lol/challenges/v1/player-data/${summoner.puuid}?api_key=${apiKey}`
    const challengesTemp = await fetch(challengesUrl);
    const challenges = await challengesTemp.json();


    const [my] = challengesIds.filter(e => e.id == 502003)

} catch (error) {
    console.log('err')
}





app.get("/", function (req, res) {
    res.send('bla bla bla')
})
app.get("/getName", function (req, res) {
    res.send(JSON.stringify(my.localizedNames.en_US))
})




app.listen(process.env.PORT || port)