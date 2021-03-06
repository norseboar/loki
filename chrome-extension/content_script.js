console.log('running contentscript')
const TABLE_SIZE = 6;

function createGameState() {
  return {
    phase: GAME_PHASES.NotStarted,
    raiseCount: 0  // The first bet is considered a raise for these purposes
  }
}

function createTableState() {
  return {
    tableid: null,
    players: {},
    myPlayerSeat: -1,
    gameState: createGameState(),
    hudElems: null,
    listPlayers: function() {
      l = [];
      for (const pid in this.players) {
        l.push(this.players[pid]);
      }
      return l;
    }
  }
}

let tableState = createTableState();

function createHud() {
  // console.log('creating hud')
  const seatOffset = tableState.myPlayerSeat !== -1
    ? tableState.myPlayerSeat : 0;
  // console.log(`myPlayerSeat is ${tableState.myPlayerSeat}`)
  // console.log(`seat offset is ${seatOffset}`)
  const seatContainer = document.getElementById(
    `seatContainer-${tableState.tableid}`
  );
  if (!seatContainer) {
    console.log('no seat container')
    // If no seatContainer can be found, that means the table html hasn't loaded
    // Rather than retry, we'll wait for the next set of messages to kick off
    // another render
    return;
  }

  // console.log('about to create elems')
  tableState.hudElems = [...Array(TABLE_SIZE).keys()].map(function(i) {
    // console.log(`running for index ${i}`)
    const seat = (i + seatOffset) % TABLE_SIZE;
    // console.log(`seat is ${seat}`)
    const elemId = (tableState.myPlayerSeat !== -1 && i === 0
                    ? `myPlayerSeat-${tableState.tableid}`
                    : `seat${seat}-${tableState.tableid}`)
    // console.log(`element is ${elemId}`)
    const seatElem = document.getElementById(elemId);
    if (!seatElem) {
      console.log(`could not find seat w/ name ${elemId}`)
      return null;
    }

    const positionHud = document.createElement('div');
    positionHud.id = `__position${i}Hud`;
    positionHud.className = 'position-hud fs-block';
    const player = tableState.listPlayers().find(p => p.seat === seat);
    if (player) {
      positionHud.innerHTML = `
        <div>
          ${player.vpip.getPercentage()} / ${player.pfr.getPercentage()}
          (${player.vpip.opportunities})
        </div>
        <div>
          ${player.threeBet.getPercentage()} (${player.threeBet.opportunities})
          / ${player.foldToThreeBet.getPercentage()}
          (${player.foldToThreeBet.opportunities})
        </div>
        <div>
          ${Math.round(10*(player.afp.actions /
              (player.afp.opportunities - player.afp.actions)
            ))/10}
          (${player.afp.opportunities})
        </div>
        <div>
          ${player.cBet.getPercentage()} (${player.cBet.opportunities})
          / ${player.foldToCbet.getPercentage()}
          (${player.foldToCbet.opportunities})
        </div>
      `;
      // positionHud.innerHTML = `
      //   <table>
      //     <thead><tr>
      //       <td></td><td>VPIP</td><td>PFR</td><td>3B</td><td>F3B</td>
      //       <td>AFP</td><td>CB</td><td>FCB</td><td>
      //     </tr></thead>
      //     <tbody>
      //       <tr>
      //         <td><b>%</b></td>
      //         <td>${player.vpip.getPercentage()}</td>
      //         <td>${player.pfr.getPercentage()}</td>
      //         <td>${player.threeBet.getPercentage()}</td>
      //         <td>${player.foldToThreeBet.getPercentage()}</td>
      //         <td>${player.afp.getPercentage()}</td>
      //         <td>${player.cBet.getPercentage()}</td>
      //         <td>${player.foldToCbet.getPercentage()}</td>
      //       </tr>
      //       <tr>
      //         <td><b>A</b></td>
      //         <td>${player.vpip.actions}</td>
      //         <td>${player.pfr.actions}</td>
      //         <td>${player.threeBet.actions}</td>
      //         <td>${player.foldToThreeBet.actions}</td>
      //         <td>${player.afp.actions}</td>
      //         <td>${player.cBet.actions}</td>
      //         <td>${player.foldToCbet.actions}</td>
      //       </tr>
      //       <tr>
      //         <td><b>O</b></td>
      //         <td>${player.vpip.opportunities}</td>
      //         <td>${player.pfr.opportunities}</td>
      //         <td>${player.threeBet.opportunities}</td>
      //         <td>${player.foldToThreeBet.opportunities}</td>
      //         <td>${player.afp.opportunities}</td>
      //         <td>${player.cBet.opportunities}</td>
      //         <td>${player.foldToCbet.opportunities}</td>
      //       </tr>
      //     </tbody>
      //   </table>`;
    }

    seatElem.append(positionHud);
    return positionHud;
  });


  tableState.hudElems[0].style.top = '60%';
  tableState.hudElems[0].style.left = '80%';
  tableState.hudElems[1].style.top = '130%';
  tableState.hudElems[2].style.top = '60%';
  tableState.hudElems[3].style.top = '-1%';
  tableState.hudElems[3].style.left = '-60%';
  tableState.hudElems[4].style.top = '60%';
  tableState.hudElems[4].style.left = '25%';
  tableState.hudElems[5].style.top = '130%';
  tableState.hudElems[5].style.left = '30%';
}

function removeHud() {
  if (!tableState.hudElems) {
    return;
  }
  tableState.hudElems.forEach(hudElem => hudElem.remove());
  tableState.hudElems = null;
}

function renderHUD() {
  removeHud();
  createHud();
}

function processAllStats() {
  tableState.listPlayers().forEach(function(player){
    player.vpip.process();
    player.pfr.process();
    player.threeBet.process();
    player.foldToThreeBet.process();
    player.afp.process();
    player.cBet.process();
    player.foldToCbet.process();
  });
}

async function processMessage(message) {
  let logMsg = `${REVERSED_PACKET_CLASSES[message.classId]}`
  if (message.classId === 66){
  }
  if (tableState.tableid === null) {
    switch(message.classId) {
      case PACKET_CLASSES.NotifySeatedPacket:
      case PACKET_CLASSES.NotifySeatedPacketV2:
        tableState.myPlayerSeat = message.seat;
        tableState.tableid = message.tableid;
        break;
      case PACKET_CLASSES.WatchResponsePacket:
        tableState.tableid = message.tableid;
        break;
      default:
        return;
    }
  }

  if (tableState.tableid !== message.tableid) {
    return;
  }

  gameState = tableState.gameState;

  switch (message.classId) {
    case PACKET_CLASSES.SeatInfoPacket:
      tableState.players[message.player.pid] = await loadPlayer(
        message.player.pid, message.player.nick, message.seat);
      renderHUD();
      break;
    case PACKET_CLASSES.NotifyJoinPacket:
      tableState.players[message.pid] = await loadPlayer(
        message.pid, message.nick, message.seat);
      renderHUD();
      break;
    case PACKET_CLASSES.NotifyLeavePacket:
      await savePlayer(tableState.players[message.pid])
      delete tableState.players[message.pid];
      break;
    case PACKET_CLASSES.NotifySeatedPacket:
    case PACKET_CLASSES.NotifySeatedPacketV2:
      tableState.myPlayerSeat = message.seat;
      renderHUD();
      break;
    case PACKET_CLASSES.UnwatchResponsePacket:
    case PACKET_CLASSES.LeaveResponsePacket:
      console.log('leaving!')
      for (const player of tableState.listPlayers()) {
        await savePlayer(player);
      }
      tableState = createTableState();
      removeHud();
      break;
    case PACKET_CLASSES.GameTransportPacket:
      const decodedGameData = atob(message.gamedata);
      const gameDataBytes = Uint8Array.from(
        decodedGameData, b => b.charCodeAt(0))
      const gameDataClass = gameDataBytes[4];
      logMsg += `: ${REVERSED_GAME_DATA_CLASSES[gameDataClass]}`
      switch(gameDataClass) {
        case GAME_DATA_CLASSES.HandStartInfo:
          processAllStats();
          gameState.phase = GAME_PHASES.Preflop;
          gameState.raiseCount = 0;
          break;
        case GAME_DATA_CLASSES.DealPublicCards:
          processAllStats();
          gameState.raiseCount = 0;
          switch(gameState.phase){
            case GAME_PHASES.Preflop:
              gameState.phase = GAME_PHASES.Flop;
              break;
            case GAME_PHASES.Flop:
              gameState.phase = GAME_PHASES.Turn;
              break;
            case GAME_PHASES.Turn:
              gameState.phase = GAME_PHASES.River;
              break;
            default:
              gameState.phase = GAME_PHASES.NotStarted;
          }
          break;
        case GAME_DATA_CLASSES.PerformAction:
          const playerBytes = gameDataBytes.slice(9, 13);
          function bytesToIntReducer(acc, val, i) {
            return Math.pow(2, (3-i)*8)*val + acc;
          }
          const pid = playerBytes.reduce(bytesToIntReducer);
          const player = tableState.players[pid];

          const actionType = gameDataBytes[13];

          if (![ACTION_TYPES.FOLD, ACTION_TYPES.CHECK, ACTION_TYPES.CALL,
                ACTION_TYPES.BET, ACTION_TYPES.RAISE].includes(actionType)) {
            break;
          }

          switch (gameState.phase) {
            case GAME_PHASES.Preflop:
              if (gameState.raiseCount === 1) {
                player.threeBet.setHadOpportunity();
              }
              if (gameState.raiseCount === 2) {
                player.foldToThreeBet.setHadOpportunity();
              }
              switch(actionType) {
                case ACTION_TYPES.CALL:
                  player.vpip.setTookAction();
                  player.pfr.setHadOpportunity();
                  break;
                case ACTION_TYPES.BET:
                  player.vpip.setTookAction();
                  player.pfr.setTookAction();
                  break;
                case ACTION_TYPES.RAISE:
                  player.vpip.setTookAction();
                  player.pfr.setTookAction();
                  if (gameState.raiseCount === 1) {
                    player.threeBet.setTookAction();
                  }
                  break;
                case ACTION_TYPES.CHECK:
                  player.vpip.setHadOpportunity();
                  player.pfr.setHadOpportunity();
                  break;
                case ACTION_TYPES.FOLD:
                  player.vpip.setHadOpportunity();
                  player.pfr.setHadOpportunity();
                  if (gameState.raiseCount === 2) {
                    player.foldToThreeBet.setTookAction();
                  }
                  break;
                default:
                  break;
              }
              break;
            case GAME_PHASES.Flop:
              if (gameState.raiseCount === 0) {
                player.cBet.setHadOpportunity();
                if (actionType === ACTION_TYPES.BET) {
                  player.cBet.setTookAction();
                }
              }
              if (gameState.raiseCount === 1) {
                player.foldToCbet.setHadOpportunity();
                if (actionType === ACTION_TYPES.FOLD) {
                  player.foldToCbet.setTookAction();
                }
              }
              break;
            default:
              break;
          }
          if (actionType === ACTION_TYPES.BET ||
              actionType === ACTION_TYPES.RAISE) {
            gameState.raiseCount += 1;
          }
          if (POSTFLOP_PHASES.includes(gameState.phase)) {
            switch(actionType) {
              case ACTION_TYPES.CALL:
                player.afp.setHadOpportunity();
                break;
              case ACTION_TYPES.BET:
              case ACTION_TYPES.RAISE:
                player.afp.setTookAction();
                break;
            }
          }
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }

  renderHUD();
}

async function retrieveMessage() {
  if (!apiKey) {
    return;
  }
  const messageListElem = document.getElementById('__socketData')
  for (const messageElem of messageListElem.childNodes){
    const message = JSON.parse(messageElem.innerHTML);
    if (message.classId != null) {
      await processMessage(message)
    }
  }
  while (messageListElem.firstChild) {
    messageListElem.removeChild(messageListElem.firstChild);
  }
}

setInterval(requestIdleCallback.bind(this, retrieveMessage), 5000);
