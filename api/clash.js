const express = require("express");
const router = express.Router();
const axios = require('axios').default;
require('dotenv').config()



async function getSummoner(summonerName){
  try {
      const summoner = await axios.get(`https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`)
      
      return summoner.data
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
      const clashTeam = await getClashTeam(summoner)
      const clashTeamMembers = await getClashTeamMembers(clashTeam)
      let sharedMatchesArray = []
      for (let member of clashTeamMembers){
        // need to find puuid of memeber for getMatchList() function 
        const matches = await getMatchList(puuid)
        
        // use a similiar function to check if match id repeats between all members
        function isUnique(arr) {
          const isAllUniqueItems = input.every((value, index, arr) => {
            return arr.indexOf(value) === index; //check if any duplicate value is in other index
          });
        
          return isAllUniqueItems;
        }

      }

  } catch (error) {
  
  }
});

module.exports = router;