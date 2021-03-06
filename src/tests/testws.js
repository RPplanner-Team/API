/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable global-require */
/* eslint-disable no-undef */

import { expect } from 'chai';
import app from '../app';

const Websocket = require('ws');
const fs = require('fs');

// simple test test
describe('Simple String Test', () => {
  it('should return number of charachters in a string', () => {
    expect('Hello world!'.length).equal(12);
  });
});

describe('websocket complete game creation and connection testing', () => {
  let ws; let serverws;
  let server;
  const PORT = process.env.PORT || 1337;

  let gameId;
  let token;
  let token2;
  let gmToken;

  before((done) => {
    // start the server
    server = app.listen(PORT, () => {
      ws = new Websocket(`ws://localhost:${PORT}`);
      ws.on('open', () => {
        serverws = new Websocket(`ws://localhost:${PORT}`);
        serverws.on('open', () => {
          done();
        });
      });
    });
  });

  after((done) => {
    ws.close();
    serverws.close();
    server.close();
    done();
  });

  describe('Receive a ping response', () => {
    it('should get a pong response to ping', (done) => {
      const content = {
        type: 'ping',
        status: 'ok',
        data: {},
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).equal('pong');
        expect(data.status).equal('ok');
        done();
      });
    });
  });

  describe('handle the getHomePage Request', () => {
    it('should return the templates', (done) => {
      const content = {
        type: 'getTemplatesPage',
        status: 'ok',
        token: null,
        data: {},
      };

      serverws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('getTemplatesPage');
        expect(data.status).to.equal('ok');
        expect(data.data).to.have.key('templates');
        expect(data.data.templates).to.be.an('array');
        expect(data.data.templates[0]).to.have.keys(['name', 'description', 'summary']);
        expect(data.data.templates[0].name).to.be.a('string');
        done();
      });
    });
  });

  describe('handle correctly the game creation', () => {
    it('should answer the creation message for a gameCreation request', (done) => {
      const content = {
        type: 'createGame',
        status: 'ok',
        token: null,
        data: {
          templateName: 'LeParrain',
          duration: 3600,
        },
      };
      serverws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).equal('createGame');
        expect(data.status).equal('ok');

        gameId = data.data.gameId;
        gmToken = data.data.token;

        done();
      });
    });
  });

  describe('handle correctly testId', () => {
    it('should respond ok status', (done) => {
      const content = {
        type: 'testId',
        status: 'ok',
        token: null,
        data: {
          id: gameId,
        },
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).equal('testId');
        expect(data.status).equal('ok');
        done();
      });
    });

    it('should respond error status', (done) => {
      const content = {
        type: 'testId',
        status: 'ok',
        token: null,
        data: {
          id: 999999,
        },
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).equal('testId');
        expect(data.status).equal('error');
        done();
      });
    });
  });

  describe('handle corectly the player connection', () => {
    it('should respond correctly', (done) => {
      const content = {
        type: 'connectGame',
        status: 'ok',
        token: null,
        data: {
          gameId,
          username: 'toto',
          password: 'encrypted',
        },
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('connectGame');
        expect(data.status).to.equal('ok');
        expect(data.data).to.have.keys(['token', 'roles']);
        expect(data.data.roles).to.be.an('array');
        expect(data.data.roles[0]).to.have.keys(['name', 'summary', 'image']);

        token = data.data.token;

        done();
      });
    });

    it('should set the role pref correctly', (done) => {
      const content = {
        type: 'setRole',
        status: 'ok',
        token,
        data: {
          roleName: 'Vito Falcaninio',
        },
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('setRole');
        expect(data.status).to.equal('ok');
        done();
      });
    });

    it('should send update to gameMaster', (done) => {
      const content = {
        type: 'setRole',
        status: 'ok',
        token,
        data: {
          roleName: 'Vito Falcaninio',
        },
      };
      ws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('updatePlayers');
        expect(data.status).to.equal('ok');
        expect(data.data).to.have.key('players');
        done();
      });
    });
  });

  describe('test setFirstPlayerRole', () => {
    it('should set the player role and respond ok', (done) => {
      const content = {
        type: 'setPlayerRole',
        status: 'ok',
        token: gmToken,
        data: {
          playerName: 'toto',
          roleName: 'Vito Falcaninio',
        },
      };
      serverws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.be.equal('setPlayerRole');
        expect(data.status).to.equal('ok');
        done();
      });
    });
  });

  describe('Authenticated player wants his home page', () => {
    it('should respond the right informations', (done) => {
      const content = {
        type: 'getHomePage',
        status: 'ok',
        token,
        data: {},
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('getHomePage');
        expect(data.status).to.equal('ok');
        expect(data.data).to.have.keys(
          ['characterName',
            'characterPhoto',
            'characterSummaryRole',
            'characterHints',
            'scenarioTitle',
            'scenarioSummary',
            'characterProperties',
          ],
        );
        expect(data.data.characterHints).to.be.an('array');
        data.data.characterHints.forEach((hint) => {
          expect(hint.clue).to.equal(true);
        });
        done();
      });
    });
  });

  describe('Unauthenticated player wants his home page', () => {
    it('should respond a no token error', (done) => {
      const content = {
        type: 'getHomePage',
        status: 'ok',
        token: null,
        data: {},
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.be.equal('getHomePage');
        expect(data.status).to.equal('error');
        done();
      });
    });

    it('should respond an authentication error', (done) => {
      const content = {
        type: 'getHomePage',
        status: 'ok',
        token: 'qdkjhqfjlhsfdjqshd',
        data: {},
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.be.equal('getHomePage');
        expect(data.status).to.equal('error');
        done();
      });
    });
  });

  describe('Player wants the event page', () => {
    it('should respond an ok and the first event (triggered on gameStart)', (done) => {
      const content = {
        type: 'getEventsPage',
        status: 'ok',
        token,
        data: {},
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('getEventsPage');
        expect(data.status).to.equal('ok');
        expect(data.data).to.have.key('events');
        done();
      });
    });
  });

  describe('test getMyPlayer', () => {
    before((done) => {
      const content = {
        type: 'connectGame',
        status: 'ok',
        token: null,
        data: {
          gameId,
          username: 'titi',
          password: 'encrypted',
        },
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        if (data.status == 'ok') {
          token2 = data.data.token;
          done();
        }
      });
    });

    it('should respond an ok the first player', (done) => {
      const content = {
        type: 'getMyPlayer',
        status: 'ok',
        token,
        data: {},
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.be.equal('getMyPlayer');
        expect(data.status).to.equal('ok');
        expect(data.data).to.have.key('characterRole');
        done();
      });
    });

    it('should respond an error because player has no role', (done) => {
      const content = {
        type: 'getMyPlayer',
        status: 'ok',
        token: token2,
        data: {},
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.be.equal('getMyPlayer');
        expect(data.status).to.equal('error');
        expect(data.data.message).to.equal('Player has no role set');
        done();
      });
    });
  });

  describe('test getSetup', () => {
    it('should respond an ok', (done) => {
      const content = {
        type: 'getSetup',
        status: 'ok',
        token: gmToken,
        data: {},
      };
      serverws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.be.equal('getSetup');
        expect(data.status).to.equal('ok');
        done();
      });
    });
  });

  describe('test setPlayerRole', () => {
    it('should set the player role and respond ok', (done) => {
      const content = {
        type: 'setPlayerRole',
        status: 'ok',
        token: gmToken,
        data: {
          playerName: 'titi',
          roleName: 'Vito Falcaninio',
        },
      };
      serverws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.be.equal('setPlayerRole');
        expect(data.status).to.equal('ok');
        done();
      });
    });

    it('should set the player role and send reload page to player', (done) => {
      const content = {
        type: 'setPlayerRole',
        status: 'ok',
        token: gmToken,
        data: {
          playerName: 'titi',
          roleName: 'Vito Falcaninio',
        },
      };
      serverws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.be.equal('reloadPage');
        expect(data.status).to.equal('ok');
        done();
      });
    });
  });

  describe('test startGame', () => {
    it('should return ok', (done) => {
      const content = {
        type: 'startGame',
        status: 'ok',
        token: gmToken,
        data: {},
      };
      serverws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('startGame');
        expect(data.status).to.equal('ok');
        done();
      });
    });
  });

  describe('test makeAction', () => {
    it('should handle the action and respond makeAction', (done) => {
      const content = {
        type: 'makeAction',
        status: 'ok',
        token,
        data: {
          actionName: 'Refroidir',
        },
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('makeAction');
        expect(data.status).to.equal('ok');
        expect(data.data).to.have.key('choices');
        expect(data.data.choices).to.be.an('array');
        expect(data.data.choices[0].possibilities).to.includes('Carla Gurzio');
        done();
      });
    });
  });

  describe('test announce', () => {
    it('should announce first player', (done) => {
      const content = {
        type: 'announce',
        status: 'ok',
        token: gmToken,
        data: {
          message: 'This is an announce !',
        },
      };
      serverws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('notification');
        expect(data.status).to.equal('ok');
        expect(data.data).to.have.keys(['message', 'type']);
        expect(data.data.type).to.equal('announce');
        expect(data.data.message).to.be.a('string');
        done();
      });
    });

    it('should send back to server', (done) => {
      const content = {
        type: 'announce',
        status: 'ok',
        token: gmToken,
        data: {
          message: 'This is an announce !',
        },
      };
      serverws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('announce');
        expect(data.status).to.equal('ok');
        done();
      });
    });
  });

  describe('test pause', () => {
    it('should return ok', (done) => {
      const content = {
        type: 'pause',
        status: 'ok',
        token: gmToken,
        data: {
          currentTime: 3590,
        },
      };
      serverws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('pause');
        expect(data.status).to.equal('ok');
        done();
      });
    });
  });

  describe('test resume', () => {
    it('should return the currentTime when paused', (done) => {
      const content = {
        type: 'resume',
        status: 'ok',
        token: gmToken,
        data: {},
      };
      serverws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('resume');
        expect(data.status).to.equal('ok');
        expect(data.data.currentTime).to.equal(3590);
        done();
      });
    });
  });

  describe('test save', () => {
    it('should return ok', (done) => {
      const content = {
        type: 'save',
        status: 'ok',
        token: gmToken,
        data: {},
      };
      serverws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('save');
        expect(data.status).to.equal('ok');
        done();
      });
    });
  });

  describe('test reconnection', () => {
    it('should return an error', (done) => {
      const content = {
        type: 'gmReconnectGame',
        status: 'ok',
        token: null,
        data: {
          gameId,
          playerName: 'qgksdq',
        },
      };
      serverws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('gmReconnectGame');
        expect(data.status).to.equal('error');
        done();
      });
    });

    it('should return the new token', (done) => {
      const content = {
        type: 'gmReconnectGame',
        status: 'ok',
        token: null,
        data: {
          gameId: parseInt(gameId, 10),
          playerName: 'toto',
        },
      };
      serverws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('gmReconnectGame');
        expect(data.status).to.equal('ok');
        expect(data.data.token).to.be.a('string');
        expect(data.data.status).to.not.equal(null);
        gmToken = data.data.token;
        done();
      });
    });

    it('should accept the new token', (done) => {
      const content = {
        type: 'getSetup',
        status: 'ok',
        token: gmToken,
        data: {},
      };
      serverws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.be.equal('getSetup');
        expect(data.status).to.equal('ok');
        done();
      });
    });
  });

  describe('test getPlayersPage', () => {
    it('should return the list of the roles name', (done) => {
      const content = {
        type: 'getPlayersPage',
        status: 'ok',
        token,
        data: {},
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('getPlayersPage');
        expect(data.status).to.equal('ok');
        expect(data.data.charactersName).to.be.an('array');
        expect(data.data.charactersName[0]).to.equal('Vito Falcaninio');
        expect(data.data.charactersName.length).to.equal(1);
        expect(data.data.charactersPhotos).to.equal(null);
        done();
      });
    });
  });
  describe('test getOverview', () => {
    it('should return the correct elements', (done) => {
      const content = {
        type: 'getOverview',
        status: 'ok',
        token: gmToken,
        data: {},
      };
      serverws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('getOverview');
        expect(data.status).to.equal('ok');
        expect(data.data).to.have.keys(['gameDescription', 'gameId', 'globalDuration', 'remainingDuration', 'players']);
        done();
      });
    });
  });

  describe('test getMyInventoryPage', () => {
    it('should return the list of the names of the objects', (done) => {
      const content = {
        type: 'getMyInventoryPage',
        status: 'ok',
        token,
        data: {},
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('getMyInventoryPage');
        expect(data.status).to.equal('ok');
        expect(data.data.characterObject).to.be.an('array');
        done();
      });
    });
  });
  describe('test getObjectPage', () => {
    it('should return the description of the object', (done) => {
      const content = {
        type: 'getObjectPage',
        status: 'ok',
        token,
        data: {
          objectName: 'La lettre du parrain',
        },
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('getObjectPage');
        expect(data.status).to.equal('ok');
        expect(data.data.objectDescription).to.be.an('string');
        expect(data.data.objectDescription).to.equal('Cette lettre signée du parrain exprime ses doutes sur son entourage direct. C’est elle qui pousse Vito a réunir tout ce beau monde ce soir');
        expect(data.data.objectPhoto).to.equal(null);
        done();
      });
    });
  });

  describe('test getMyActions', () => {
    it('should return the list of actions', (done) => {
      const content = {
        type: 'getMyActions',
        status: 'ok',
        token,
        data: {},
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('getMyActions');
        expect(data.status).to.equal('ok');
        expect(data.data.characterActions).to.not.equal(null);
        done();
      });
    });
  });

  describe('test getMg', () => {
    it('should return a biiiiig object', (done) => {
      const content = {
        type: 'getMg',
        status: 'ok',
        token: gmToken,
        data: {},
      };
      serverws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        // fs.writeFile('C:\\Users\\tomsa\\Documents\\GitHub\\API\\src\\tests\\out.txt', event, (err) => {
        //   if (err) {
        //     console.log(err);
        //   }
        // });
        expect(data.type).to.equal('getMg');
        done();
      });
    });
  });

  describe('test getPlayerData', () => {
    it('should return the data of the player', (done) => {
      const content = {
        type: 'getPlayerData',
        status: 'ok',
        token,
        data: {
          playerRoleName: 'Sebastiano Pechetto',
        },
      };
      ws.send(JSON.stringify(content));

      ws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('getPlayerData');
        expect(data.status).to.equal('ok');
        expect(data.data.characterRole).to.be.an('string');
        expect(data.data.characterThoughts).to.be.an('string');
        expect(data.data.characterRole).to.equal('Sebastiano Pechetto');
        expect(data.data.characterThoughts).to.equal('Un atout indispensable. Je ne peux tout simplement pas être en mauvais termes avec lui si je veux gérer une mafia digne de ce nom.');
        done();
      });
    });
  });

  describe('test stopGame', () => {
    it('should return ok', (done) => {
      const content = {
        type: 'stopGame',
        status: 'ok',
        token: gmToken,
        data: {},
      };
      serverws.send(JSON.stringify(content));

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('stopGame');
        expect(data.status).to.equal('ok');
        done();
      });
    });
  });
  // ! This test needs to be the last one
  describe('test reconnect', () => {
    it('should send update to the gameMaster', (done) => {
      ws.close();

      serverws.once('message', (event) => {
        const data = JSON.parse(event);
        expect(data.type).to.equal('updatePlayers');
        expect(data.status).to.equal('ok');
        expect(data.data.players[0].connected).to.equal(false);
        done();
      });
    });
  });
});
