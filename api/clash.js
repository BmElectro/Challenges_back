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
      
      return {puuid:summonerPuuid.data.puuid, name:summonerPuuid.data.name}
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
    //await jsonBlob.update(matchId, matchDetails.data.info)
    return matchDetails.data.info
  } catch (error) {
      return error
  }
}
async function getBatchMatchDetails(batch, delay){
  return new Promise((resolve, reject)=>{
    try {
      setTimeout(async ()=>{
        const batchMatchDetailsPromises = batch.map((e) => getSingleMatchDetails(e))
        const batchMatchDetails = await Promise.all(batchMatchDetailsPromises)
    
        resolve(batchMatchDetails) 
      }, delay)

    } catch (error) {
      reject(error) 
    }
  })
    
}
function findMostPlayedChampionForEachPlayer(allPuuidsAndNames, details){
  let mostPlayedChamps = {}
  for (let game of details){
    
  }
}
async function getMatchesDetails(sharedMatchIds){
  try {
    // This part is working, it is commented out because vercel does not allow long function exectutions. 


    // let batchesArray = []
    // for(let i = 0; i < sharedMatchIds.length; i+=10) {
    //   batchesArray.push(sharedMatchIds.slice(i, i+10))
    // }
    // let allmatchDetails = []
    // for (let batch of batchesArray){
    //     const result = await getBatchMatchDetails(batch)
    //     allmatchDetails = [...allmatchDetails, ...result]

    // }

    // console.log(allmatchDetails.length)
    // return allmatchDetails
    const result = await getBatchMatchDetails(sharedMatchIds.slice(0, 10), 1)
    return result
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
      
      const allPuuidsAndNamesPromises = clashTeamMembersSummonerIds.map((e) => getSummonerPuuidBySummonerId(e))
      const allPuuidsAndNames = await Promise.all(allPuuidsAndNamesPromises)
      const allMatchListPromises = allPuuidsAndNames.map((e) => getMatchList(e.puuid))
      console.log('no error yet')
      let allNames = allPuuidsAndNames.map(e=> e = e.name)
      console.log(allNames)

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
      const sharedMatchIds = Object.keys(repeatedMatchIds).filter(e => repeatedMatchIds[e] >= allPuuidsAndNames.length-1)
      const details = await getMatchesDetails(sharedMatchIds)
      // let championFrequency = new Map()
      // for (let game of details){
       
      // }
      console.log(JSON.stringify({details:details, allNames:allNames}))
      res.send(JSON.stringify({details:details, allNames:allNames}))


  } catch (error) {
     res.send('error')
  }
});

module.exports = router;