const express = require("express");
const router = express.Router();
const axios = require('axios').default;
const jsonBlob = require('./jsonBlob')
require('dotenv').config()



async function getSummoner(summonerName){
  try {
      const summoner = await axios.get(`https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`)
      
      return summoner.data
  } catch (error) {
      return error
  }
}
async function getSummonerPuuidBySummonerId(summonerId){
  try {
      const summonerPuuid = await axios.get(`https://eun1.api.riotgames.com/lol/summoner/v4/summoners/${summonerId}?api_key=${apiKey}`)
      
      return summonerPuuid.data.puuid
  } catch (error) {
      return error
  }
}
async function getClashTeam(summonerID){
  try {
      const clashTeam = await axios.get(`https://eun1.api.riotgames.com/lol/clash/v1/players/by-summoner/${summonerID}?api_key=${apiKey}`)
      
      return clashTeam.data
  } catch (error) {
      return error
  }
}
async function getClashTeamMembers(team_Id){
  try {
      const clashTeamMembers = await axios.get(`https://eun1.api.riotgames.com/lol/clash/v1/teams/${team_Id}?api_key=${apiKey}`)
      
      return clashTeamMembers.data
  } catch (error) {
      return error
  }
}

async function getMatchList(puuid){
  try {
      const matchList = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=100&api_key=${apiKey} `)
      
      return matchList.data
  } catch (error) {
      return error
  }
}
async function getSingleMatchDetails(matchId){
  try {
    const matchDetails = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}`)
    await jsonBlob.update(matchId, matchDetails.data.info)
    return matchDetails.data.info
  } catch (error) {
      return error
  }
}
async function getBatchMatchDetails(batch){
  return new Promise((resolve, reject)=>{
    try {
      setTimeout(async ()=>{
        console.log('waiting 5 seconds')
        const batchMatchDetailsPromises = batch.map((e) => getSingleMatchDetails(e))
        const batchMatchDetails = await Promise.all(batchMatchDetailsPromises)
    
        resolve(batchMatchDetails) 
      }, 5000)

    } catch (error) {
      reject(error) 
    }
  })
    
}
async function getMatchesDetails(sharedMatchIds){
  try {
    console.log('allmatcheslength' , sharedMatchIds.length)
    let batchesArray = []
    for(let i = 0; i < sharedMatchIds.length; i+=10) {
      batchesArray.push(sharedMatchIds.slice(i, i+10))
    }
    let allmatchDetails = []
    for (let batch of batchesArray){
        const result = await getBatchMatchDetails(batch)
        allmatchDetails = [...allmatchDetails, ...result]

    }

    console.log(allmatchDetails.length)
    return allmatchDetails
  } catch (error) {
      return error
  }
}

const apiKey = process.env.APIKEY
/**
 * GET Games shared games of this summoners clash team
 *  
 * @return product list | empty.
 */
router.get("/", async (req, res) => {
  try {
      const summonerName = req.query.sumname
      const summoner = await getSummoner(summonerName)
      const [clashTeam] = await getClashTeam(summoner.id)
      const clashTeamMembers = await getClashTeamMembers(clashTeam.teamId)
      let clashTeamMembersSummonerIds = clashTeamMembers.players.map(e => e = e.summonerId)
      
      const allPuuidsPromises = clashTeamMembersSummonerIds.map((e) => getSummonerPuuidBySummonerId(e))
      const allPuuids = await Promise.all(allPuuidsPromises)
      const allMatchListPromises = allPuuids.map((e) => getMatchList(e))
      const allMatchList = await Promise.all(allMatchListPromises)

      let allMatchesArray = []
      let loopCounter = 0
      for (let matchIdsOfPlayer of allMatchList){
        for (let mathchId of matchIdsOfPlayer){
          allMatchesArray.push(mathchId)
        }
      }
      let repeatedMatchIds = {}
      for (let mathchId of allMatchesArray){
        if(Object.keys(repeatedMatchIds).includes(mathchId)){
          repeatedMatchIds[mathchId]++
        }else{
          repeatedMatchIds[mathchId] = 0
        }
      }
      const sharedMatchIds = Object.keys(repeatedMatchIds).filter(e => repeatedMatchIds[e] > 0)
      const details = await getMatchesDetails(sharedMatchIds)
      res.send(JSON.stringify(details))


  } catch (error) {
     res.send('error')
  }
});

module.exports = router;