/* eslint-disable no-console */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-underscore-dangle */
import Player from './models/players.model';
import Game from './models/games.model';
import Mission from './models/missions.model';
import Announcement from './models/announcements.model';

// TODO: Every docstrings

// Live storage for non-essential data keys are gameid
const storedGames = {};

// Structure live storage objects
function LiveGame(gameId) {
  this.id = gameId || null; // Primary key
  this.players = {};
  this.announcements = {};
}

function LivePlayer(name) {
  this.id = null;
  this.name = name || null; // Primary key
  this.connected = false;
  this.socket = null;
  this.missions = {};
}

function LiveMission(description) {
  this.id = null; // Primary key
  this.description = description;
  this.achieved = false;
  this.started = false;
}

function LiveAnnounce(message) {
  this.id = null;
  this.message = message;
  this.date = null;
}

// Populate the storedGames with already in database games and players
Game.find()
  .then((games) => {
    // loop thru games
    games.forEach((game) => {
      // find players list of each game
      Player.find({ gameId: game.id })
        .then((players) => {
          // create a LiveGame in ram
          const lGame = new LiveGame(game.id);
          storedGames[lGame.id] = lGame;

          players.forEach((player) => {
            const lPlayer = new LivePlayer(player.name);
            lPlayer.id = player._id;
            storedGames[lGame.id].players[lPlayer.name] = lPlayer;
          });
        });
    });
  })
  .catch((err) => { console.log(err); });

const initSocketIO = (server) => {
  // eslint-disable-next-line global-require
  const Sio = require('socket.io');
  const io = new Sio(server);
  io.set('origins', '*:*');

  io.on('connection', (socket) => {
    // Global socket vars
    let sGameId = 0;
    let sPlayerName;
    let isGameMaster = false;

    // v2 of socket vars
    let sGame = null;
    let sPlayer = null;

    console.log('Connection established with client : ', socket.id);

    socket.on('createGame', (roomId) => {
      // storing vars
      sGameId = roomId;
      isGameMaster = true;

      if (!storedGames.hasOwnProperty(roomId)) {
        sGame = storedGames[roomId];
        console.log('Game id is free, creation allowed');

        // adding it to the db
        const dbGame = new Game({ id: sGameId });
        dbGame.save();
        const lGame = new LiveGame(sGameId);
        storedGames[sGameId] = lGame;

        socket.join(sGameId);
      } else {
        console.log('Game id is already used, just connecting the Game Master to it');
        socket.join(sGameId);
      }
    });

    // ************************************ TEST ID **************************************
    // *Working but players undefined errors
    socket.on('testId', (roomId) => {
      console.log('testID request');
      Game.find({ id: roomId })
        .then((games) => {
          if (games.length === 0) {
            socket.emit('incorrectId');
          } else {
            socket.emit('correctId');
          }
        })
        .catch((err) => {
          socket.emit('error', 'Database Timeout');
          console.log(err);
        });
    });

    // ************************************** ANNOUNCEMENT **********************************

    socket.on('announcement', (message) => {
      console.log('Annoucement');
      // check if it is a gameMaster
      if (isGameMaster) {
        io.to(`${sGameId}player`).emit('announcement', message);
        // Save in db
        const dbAnn = new Announcement({ description: message });
        const lAnn = new LiveAnnounce(message);
        lAnn.date = dbAnn.date;
        sGame.announcements[dbAnn._id] = lAnn;
        dbAnn.save()
          .catch((err) => { console.log(err); });
      } else {
        socket.emit('error', 'You are not a gameMaster');
      }
    });

    // ************************************** MISSIONS ***************************************

    // TODO: send updateMission(missionList)
    /**
     * newMission create a mission in the mission list of the a player
     * @param {*} mission - An object with at least description and playerName
     * @param {boolean} state - False if not started instantly, true otherwise
     */
    socket.on('newMission', (mission, state) => {
      if (isGameMaster) {
        if (sGame.hasOwnProperty(mission.playerName)) {
          const mPlayer = sGame.players[mission.playerName];
          const dbMission = new Mission({
            description: mission.description,
            playerId: mPlayer.id,
          });

          const lMission = new LiveMission(mission.description);
          lMission.started = state;
          lMission.id = dbMission._id;
          mPlayer.missions[lMission.id] = lMission;

          // Loop thru missions to only show started ones to player
          const missionList = {};
          mPlayer.missions.forEach((m) => {
            if (m.started) {
              missionList[m.id] = m;
            }
          });
          mPlayer.socket.emit('updateMission', missionList);
          dbMission.save()
            .catch((err) => { console.log(err); });
        } else {
          socket.emit('error', 'There is no player with this name.');
        }
      } else {
        socket.emit('error', 'You are not a gameMaster.');
      }
    });

    socket.on('missionCompleted', () => {
      // TODO
    });

    // ***************************************** GAME *******************************************

    socket.on('connectGame', (roomId, playerName) => {
      // dynamically store connection information in the server
      sGameId = roomId;
      sPlayerName = playerName;

      // test if the game exist
      if (storedGames.hasOwnProperty(sGameId)) {
        sGame = storedGames[roomId];

        // Add the player to the right socket.io group
        socket.join(`${sGameId}player`);

        // Check if the player does not already exist in the database
        if (!sGame.players.hasOwnProperty(sPlayerName)) {
          console.log(`Player not in database. Adding it with game id ${sGameId}`);

          // Add it to db and live memory
          const dbPlayer = new Player({ gameId: sGameId, name: sPlayerName });
          const lPlayer = new LivePlayer(sPlayerName);
          lPlayer.id = dbPlayer._id;
          lPlayer.socket = socket;
          dbPlayer.save()
            .then(() => {
              // Then we get every players from the game and send it to the game master
              io.to(sGameId).emit('playerConnected', sGame.players);
              sGame.players[lPlayer.name] = lPlayer;
              sPlayer = sGame.players[lPlayer.name];
            });
        } else {
          sPlayer = sGame.players[sPlayerName];
          sPlayer.socket = socket;
          sPlayer.connected = true;
          io.to(sGameId).emit('playerConnected', sGame.players);
        }
      } else {
        // if the game id does not exist
        io.to(`${sGameId}player`).emit('error', 'Game id is not correct');
        console.log('Incorrect gameId provided by the player');
      }
    });

    /**
     * Function which is automaticaly ran when a socket disconnect
     */
    socket.on('disconnect', () => {
      // handle 2 different cases : player or gameMaster
      if (sPlayer != null && sGame != null) {
        try {
          sPlayer.connected = false;
          io.to(sGameId).emit('playerDisconnected', sGame.players);
        } catch (error) {
          console.log(error);
        }
      } else {
        // rien a faire
      }
    });
  });
};

export default initSocketIO;