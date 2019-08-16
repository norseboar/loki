console.log('running contentscript')

const PACKET_CLASSES = {
  VersionPacket: 0,
  GameVersionPacket: 1,
  GoodPacket: 2,
  BadPacket: 3,
  SystemMessagePacket: 4,
  Param: 5,
  ParamFilter: 6,
  PingPacket: 7,
  Attribute: 8,
  LoginRequestPacket: 10,
  LoginResponsePacket: 11,
  LogoutPacket: 12,
  PlayerInfoPacket: 13,
  ForcedLogoutPacket: 14,
  SeatInfoPacket: 15,
  PlayerQueryRequestPacket: 16,
  PlayerQueryResponsePacket: 17,
  SystemInfoRequestPacket: 18,
  SystemInfoResponsePacket: 19,
  JoinRequestPacket: 30,
  JoinResponsePacket: 31,
  WatchRequestPacket: 32,
  WatchResponsePacket: 33,
  UnwatchRequestPacket: 34,
  UnwatchResponsePacket: 35,
  LeaveRequestPacket: 36,
  LeaveResponsePacket: 37,
  TableQueryRequestPacket: 38,
  TableQueryResponsePacket: 39,
  CreateTableRequestPacket: 40,
  CreateTableResponsePacket: 41,
  InvitePlayersRequestPacket: 42,
  NotifyInvitedPacket: 43,
  NotifyJoinPacket: 60,
  NotifyLeavePacket: 61,
  TournamentRegistration: 212,
  NotifyRegisteredPacket: 211,
  NotifyWatchingPacket: 63,
  KickPlayerPacket: 64,
  TableChatPacket: 80,
  GameTransportPacket: 100,
  ServiceTransportPacket: 101,
  LocalServiceTransportPacket: 103,
  MttTransportPacket: 104,
  EncryptedTransportPacket: 105,
  JoinChatChannelRequestPacket: 120,
  JoinChatChannelResponsePacket: 121,
  LeaveChatChannelPacket: 122,
  NotifyChannelChatPacket: 123,
  ChannelChatPacket: 124,
  LobbyQueryPacket: 142,
  TableSnapshotPacket: 143,
  TableUpdatePacket: 144,
  LobbySubscribePacket: 145,
  LobbyUnsubscribePacket: 146,
  TableRemovedPacket: 147,
  TournamentSnapshotPacket: 148,
  TournamentUpdatePacket: 149,
  TournamentRemovedPacket: 150,
  LobbyObjectSubscribePacket: 151,
  LobbyObjectUnsubscribePacket: 152,
  TableSnapshotListPacket: 153,
  TableUpdateListPacket: 154,
  TournamentSnapshotListPacket: 155,
  TournamentUpdateListPacket: 156,
  ProbeStamp: 200,
  ProbePacket: 201,
  MttRegisterRequestPacket: 205,
  MttRegisterResponsePacket: 206,
  MttUnregisterRequestPacket: 207,
  MttUnregisterResponsePacket: 208,
  MttSeatedPacket: 209,
  MttPickedUpPacket: 210,
  NotifySeatedPacket: 62,
  GameModeChangePacket: 65
}

const GAME_DATA_CLASSES = {
  PlayerAction: 1,
  ErrorPacket: 4,
  FuturePlayerAction: 5,
  GameState: 6,
  ProtocolAttribute: 7,
  GameCard: 8,
  BestHand: 9,
  BestHandAttribute: 10,
  PlayerState: 11,
  CardToDeal: 12,
  RequestAction: 13,
  CardMoved: 14,
  InformFutureAllowedActions: 15,
  HandStartInfo: 16,
  DealerButton: 17,
  StartDealPocketCards: 18,
  StopDealPocketCards: 19,
  DealPublicCards: 20,
  RedealCommunityCards: 21,
  DealPrivateCards: 22,
  ExposePrivateCards: 23,
  HandEnd: 24,
  HandCanceled: 25,
  ClearTable: 26,
  StartHandHistory: 27,
  StopHandHistory: 28,
  PerformAction: 29,
  ChessClock: 33,
  HandStartsIn: 35,
  CardAction: 37,
  PositionCardsAction: 38,
  PlayerBetStack: 40,
  BetStackChanged: 41,
  CardChanged: 42,
  TournamentOut: 43,
  PlayerBalance: 44,
  BuyInInfoRequest: 45,
  BuyInInfoResponse: 46,
  BuyInRequest: 47,
  BuyInCancel: 48,
  BuyInResponse: 49,
  TournamentBuyInResponse: 50,
  Pot: 51,
  PotTransfer: 52,
  PotTransfers: 53,
  TakeBackUncalledBet: 54,
  PlayerPokerStatus: 56,
  PlayerHandStartStatus: 57,
  PlayerSitinRequest: 58,
  PlayerSitoutRequest: 59,
  RoundInfoUpdate: 60,
  TournamentPositionUpdate: 61,
  DeckInfo: 62,
  ExternalSessionInfoPacket: 63,
  PlayerReconnectedPacket: 65,
  PingPacket: 66,
  PongPacket: 67,
  WaitingToStartBreak: 68,
  WaitingForPlayers: 69,
  BlindsAreUpdated: 70,
  BlindsLevel: 71,
  RequestTournamentPlayerList: 72,
  TournamentPlayerList: 73,
  TournamentPlayer: 74,
  RequestBlindsStructure: 75,
  BlindsStructure: 76,
  RequestPayoutInfo: 77,
  PayoutInfo: 78,
  Payout: 79,
  RequestTournamentStatistics: 80,
  ChipStatistics: 81,
  LevelInfo: 82,
  PlayersLeft: 83,
  FeedbackMessage: 84,
  TournamentStatistics: 85,
  TournamentInfo: 86,
  RequestTournamentLobbyData: 87,
  TournamentLobbyData: 88,
  RequestTournamentTable: 89,
  TournamentTable: 90,
  RebuyOffer: 91,
  RebuyResponse: 92,
  AddOnOffer: 93,
  PerformAddOn: 94,
  PlayerPerformedRebuy: 95,
  PlayerPerformedAddOn: 96,
  AddOnPeriodClosed: 97,
  TournamentDestroyed: 98,
  RequestTournamentRegistrationInfo: 99,
  TournamentRegistrationInfo: 100,
  TicketTournamentInfo: 101,
  TournamentBuyIn: 102,
  Currency: 103,
  AchievementNotificationPacket: 104,
  TournamentTables: 105,
  Connected: 106,
  TimeBank: 107,
  DisconnectTimeBank: 108,
  HandWinPercentage: 109,
  PausedStatus: 113,
  PauseAction: 114,
  RealityCheck: 115,
  StartOver: 119,
  SatelliteTicket: 120,
  TicketBuyIn: 121,
  TargetTournamentInfo: 122,
  SatelliteTournamentInfo: 123,
  JsngPrizeInfo: 125,
  JsngInactivityRequest: 126,
  JsngInactivityResponse: 127,
}

const REVERSED_PACKET_CLASSES = {
  0: "VersionPacket",
  1: "GameVersionPacket",
  2: "GoodPacket",
  3: "BadPacket",
  4: "SystemMessagePacket",
  5: "Param",
  6: "ParamFilter",
  7: "PingPacket",
  8: "Attribute",
  10: "LoginRequestPacket",
  11: "LoginResponsePacket",
  12: "LogoutPacket",
  13: "PlayerInfoPacket",
  14: "ForcedLogoutPacket",
  15: "SeatInfoPacket",
  16: "PlayerQueryRequestPacket",
  17: "PlayerQueryResponsePacket",
  18: "SystemInfoRequestPacket",
  19: "SystemInfoResponsePacket",
  30: "JoinRequestPacket",
  31: "JoinResponsePacket",
  32: "WatchRequestPacket",
  33: "WatchResponsePacket",
  34: "UnwatchRequestPacket",
  35: "UnwatchResponsePacket",
  36: "LeaveRequestPacket",
  37: "LeaveResponsePacket",
  38: "TableQueryRequestPacket",
  39: "TableQueryResponsePacket",
  40: "CreateTableRequestPacket",
  41: "CreateTableResponsePacket",
  42: "InvitePlayersRequestPacket",
  43: "NotifyInvitedPacket",
  60: "NotifyJoinPacket",
  61: "NotifyLeavePacket",
  212: "TournamentRegistration",
  211: "NotifyRegisteredPacket",
  63: "NotifyWatchingPacket",
  64: "KickPlayerPacket",
  80: "TableChatPacket",
  100: "GameTransportPacket",
  101: "ServiceTransportPacket",
  103: "LocalServiceTransportPacket",
  104: "MttTransportPacket",
  105: "EncryptedTransportPacket",
  120: "JoinChatChannelRequestPacket",
  121: "JoinChatChannelResponsePacket",
  122: "LeaveChatChannelPacket",
  123: "NotifyChannelChatPacket",
  124: "ChannelChatPacket",
  142: "LobbyQueryPacket",
  143: "TableSnapshotPacket",
  144: "TableUpdatePacket",
  145: "LobbySubscribePacket",
  146: "LobbyUnsubscribePacket",
  147: "TableRemovedPacket",
  148: "TournamentSnapshotPacket",
  149: "TournamentUpdatePacket",
  150: "TournamentRemovedPacket",
  151: "LobbyObjectSubscribePacket",
  152: "LobbyObjectUnsubscribePacket",
  153: "TableSnapshotListPacket",
  154: "TableUpdateListPacket",
  155: "TournamentSnapshotListPacket",
  156: "TournamentUpdateListPacket",
  200: "ProbeStamp",
  201: "ProbePacket",
  205: "MttRegisterRequestPacket",
  206: "MttRegisterResponsePacket",
  207: "MttUnregisterRequestPacket",
  208: "MttUnregisterResponsePacket",
  209: "MttSeatedPacket",
  210: "MttPickedUpPacket",
  62: "NotifySeatedPacket",
  65: "GameModeChangePacket"
}

const REVERSED_GAME_DATA_CLASSES = {
  1: "PlayerAction",
  4: "ErrorPacket",
  5: "FuturePlayerAction",
  6: "GameState",
  7: "ProtocolAttribute",
  8: "GameCard",
  9: "BestHand",
  10: "BestHandAttribute",
  11: "PlayerState",
  12: "CardToDeal",
  13: "RequestAction",
  14: "CardMoved",
  15: "InformFutureAllowedActions",
  16: "HandStartInfo",
  17: "DealerButton",
  18: "StartDealPocketCards",
  19: "StopDealPocketCards",
  20: "DealPublicCards",
  21: "RedealCommunityCards",
  22: "DealPrivateCards",
  23: "ExposePrivateCards",
  24: "HandEnd",
  25: "HandCanceled",
  26: "ClearTable",
  27: "StartHandHistory",
  28: "StopHandHistory",
  29: "PerformAction",
  33: "ChessClock",
  35: "HandStartsIn",
  37: "CardAction",
  38: "PositionCardsAction",
  40: "PlayerBetStack",
  41: "BetStackChanged",
  42: "CardChanged",
  43: "TournamentOut",
  44: "PlayerBalance",
  45: "BuyInInfoRequest",
  46: "BuyInInfoResponse",
  47: "BuyInRequest",
  48: "BuyInCancel",
  49: "BuyInResponse",
  50: "TournamentBuyInResponse",
  51: "Pot",
  52: "PotTransfer",
  53: "PotTransfers",
  54: "TakeBackUncalledBet",
  56: "PlayerPokerStatus",
  57: "PlayerHandStartStatus",
  58: "PlayerSitinRequest",
  59: "PlayerSitoutRequest",
  60: "RoundInfoUpdate",
  61: "TournamentPositionUpdate",
  62: "DeckInfo",
  63: "ExternalSessionInfoPacket",
  65: "PlayerReconnectedPacket",
  66: "PingPacket",
  67: "PongPacket",
  68: "WaitingToStartBreak",
  69: "WaitingForPlayers",
  70: "BlindsAreUpdated",
  71: "BlindsLevel",
  72: "RequestTournamentPlayerList",
  73: "TournamentPlayerList",
  74: "TournamentPlayer",
  75: "RequestBlindsStructure",
  76: "BlindsStructure",
  77: "RequestPayoutInfo",
  78: "PayoutInfo",
  79: "Payout",
  80: "RequestTournamentStatistics",
  81: "ChipStatistics",
  82: "LevelInfo",
  83: "PlayersLeft",
  84: "FeedbackMessage",
  85: "TournamentStatistics",
  86: "TournamentInfo",
  87: "RequestTournamentLobbyData",
  88: "TournamentLobbyData",
  89: "RequestTournamentTable",
  90: "TournamentTable",
  91: "RebuyOffer",
  92: "RebuyResponse",
  93: "AddOnOffer",
  94: "PerformAddOn",
  95: "PlayerPerformedRebuy",
  96: "PlayerPerformedAddOn",
  97: "AddOnPeriodClosed",
  98: "TournamentDestroyed",
  99: "RequestTournamentRegistrationInfo",
  100: "TournamentRegistrationInfo",
  101: "TicketTournamentInfo",
  102: "TournamentBuyIn",
  103: "Currency",
  104: "AchievementNotificationPacket",
  105: "TournamentTables",
  106: "Connected",
  107: "TimeBank",
  108: "DisconnectTimeBank",
  109: "HandWinPercentage",
  113: "PausedStatus",
  114: "PauseAction",
  115: "RealityCheck",
  119: "StartOver",
  120: "SatelliteTicket",
  121: "TicketBuyIn",
  122: "TargetTournamentInfo",
  123: "SatelliteTournamentInfo",
  125: "JsngPrizeInfo",
  126: "JsngInactivityRequest",
  127: "JsngInactivityResponse",
}

const REVERSED_ACTION_TYPES = {
  0: "SMALL_BLIND",
  1: "BIG_BLIND",
  2: "CALL",
  3: "CHECK",
  4: "BET",
  5: "RAISE",
  6: "FOLD",
  7: "DECLINE_ENTRY_BET",
  8: "ANTE",
  9: "BIG_BLIND_PLUS_DEAD_SMALL_BLIND",
  10: "DEAD_SMALL_BLIND",
  11: "ENTRY_BET",
  12: "WAIT_FOR_BIG_BLIND",
  13: "DISCARD",
  14: "BRING_IN",
  15: "SHOW_CARDS",
  16: "MUCK_CARDS",
  17: "TIME_BANK",
  18: "HIT",
  19: "STAND",
  20: "DOUBLE",
  21: "SPLIT",
  22: "SHOW_REMAINING_CARDS",
  23: "PASS",
  24: "PLAY_CARD",
  25: "EXPOSE_CARD",
  26: "CONTINUE_HAND",
  27: "ANTE_PLUS_SMALL_BLIND",
  28: "ANTE_PLUS_BIG_BLIND",
  29: "ANTE_PLUS_ENTRY_BET",
  30: "ANTE_PLUS_BIG_BLIND_PLUS_DEAD_SMALL_BLIND",
  31: "ANTE_PLUS_DEAD_SMALL_BLIND",
  32: "POSITION_CARDS"
}

const ACTION_TYPES = {
  "SMALL_BLIND": 0,
  "BIG_BLIND": 1,
  "CALL": 2,
  "CHECK": 3,
  "BET": 4,
  "RAISE": 5,
  "FOLD": 6,
  "DECLINE_ENTRY_BET": 7,
  "ANTE": 8,
  "BIG_BLIND_PLUS_DEAD_SMALL_BLIND": 9,
  "DEAD_SMALL_BLIND": 10,
  "ENTRY_BET": 11,
  "WAIT_FOR_BIG_BLIND": 12,
  "DISCARD": 13,
  "BRING_IN": 14,
  "SHOW_CARDS": 15,
  "MUCK_CARDS": 16,
  "TIME_BANK": 17,
  "HIT": 18,
  "STAND": 19,
  "DOUBLE": 20,
  "SPLIT": 21,
  "SHOW_REMAINING_CARDS": 22,
  "PASS": 23,
  "PLAY_CARD": 24,
  "EXPOSE_CARD": 25,
  "CONTINUE_HAND": 26,
  "ANTE_PLUS_SMALL_BLIND": 27,
  "ANTE_PLUS_BIG_BLIND": 28,
  "ANTE_PLUS_ENTRY_BET": 29,
  "ANTE_PLUS_BIG_BLIND_PLUS_DEAD_SMALL_BLIND": 30,
  "ANTE_PLUS_DEAD_SMALL_BLIND": 31,
  "POSITION_CARDS": 32
}

function shouldSendMessage(message) {
  const ACCEPTABLE_MESSAGES = [15, 60, 61, 62, 100];
  // return ACCEPTABLE_MESSAGES.includes(message.classId);
  return true;
}

function patchWebSocket() {
  var OrigWebSocket = window.WebSocket;
  var callWebSocket = OrigWebSocket.apply.bind(OrigWebSocket);
  var wsAddListener = OrigWebSocket.prototype.addEventListener;
  wsAddListener = wsAddListener.call.bind(wsAddListener);
  window.WebSocket = function WebSocket(url, protocols) {
      var ws;
      if (!(this instanceof WebSocket)) {
          // Called without 'new' (browsers will throw an error).
          ws = callWebSocket(this, arguments);
      } else if (arguments.length === 1) {
          ws = new OrigWebSocket(url);
      } else if (arguments.length >= 2) {
          ws = new OrigWebSocket(url, protocols);
      } else { // No arguments (browsers will throw an error)
          ws = new OrigWebSocket();
      }

      wsAddListener(ws, 'message', function(event) {
        if (shouldSendMessage(JSON.parse(event.data))) {
          const messageListElem = document.getElementById('__socketData')
          const messageElem = document.createElement("div");
          messageListElem.appendChild(messageElem);
          messageElem.innerText = event.data;
        }
      });
      return ws;
  }.bind();
  window.WebSocket.prototype = OrigWebSocket.prototype;
  window.WebSocket.prototype.constructor = window.WebSocket;

  var wsSend = OrigWebSocket.prototype.send;
  wsSend = wsSend.apply.bind(wsSend);
  OrigWebSocket.prototype.send = function(data) {
      // TODO: Do something with the sent data if needed
      return wsSend(this, arguments);
  };

}

function checkForDOM() {
  if (document.body && document.head) {
    // Insert script that will patch WebSocket
    var patchWebSocketScript = document.createElement('script');
    patchWebSocketScript.type = 'text/javascript';
    patchWebSocket.className = 'fs-block';
    patchWebSocketScript.innerHTML = `
      ${shouldSendMessage.toString()}
      (${patchWebSocket.toString()})();
    `
    document.head.prepend(patchWebSocketScript);

    // Create a hidden DOM element to store data from websocket
    var messageListElem = document.createElement('div');
    messageListElem.id = '__socketData';
    messageListElem.className = 'fs-block'  // Stop fullstory from seeing these
    messageListElem.style.display = 'none';
    document.body.appendChild(messageListElem);
  } else {
    requestIdleCallback(checkForDOM);
  }
}

requestIdleCallback(checkForDOM);

const GAME_PHASES = {
  NotStarted: 'NotStarted',
  Preflop: 'Preflop',
  Flop: 'Flop',
  Turn: 'Turn',
  River: 'River',
}

function createBlankTableState() {
  return {
    tableid: null,
    players: Array(6),
    gamePhase: null,
    myPlayerSeat: null,
    hudElems: null
  }
}

let tableState = createBlankTableState();

function createPlayer(pid, nick) {
  return {
    pid,
    nick,
    vpip: {
      numerator: 0,
      denominator: 0,
      eligibleInHand: false,
      qualifiedInHand: false
    },
    pfr: {
      numerator: 0,
      denominator: 0,
      eligibleInHand: false,
      qualifiedInHand: false
    }
  }
}

function getStatHtml(statName, stat) {
  return `<b>${statName}</b>: ${Math.round(100*stat.numerator/stat.denominator)}% (${stat.numerator}/${stat.denominator})`;
}

function createHud() {
  const seatOffset = tableState.myPlayerSeat || 0;
  const seatContainer = document.getElementById(`seatContainer-${tableState.tableid}`)
  if (!seatContainer) {
    // If no seatContainer can be found, that means the table html hasn't loaded
    // Rather than retry, we'll wait for the next set of messages to kick off another render
    return;
  }

  tableState.hudElems = [...Array(tableState.players.length).keys()].map(function(i) {
    
    const seatNum = (i + seatOffset) % 6;
    const seatPlayer = tableState.players[seatNum];
    const elemId = (tableState.myPlayerSeat !== null && i === 0
                    ? `myPlayerSeat-${tableState.tableid}`
                    : `seat${seatNum}-${tableState.tableid}`)
    const seatElem = document.getElementById(elemId);
    if (!seatElem) {
      return null;
    }

    const positionHud = document.createElement('div');
    positionHud.id = `__position${i}Hud`;
    positionHud.className = 'fs-block';
    positionHud.style.cssText = `
      position: relative;
      height: 48px;
      width: 220px;
      z-index: 10;
      background-color: white;
      color: black;
    `;
    if (seatPlayer) {
      positionHud.innerHTML = `
        <div>${getStatHtml('VPIP', seatPlayer.vpip)}</div>
        <div>${getStatHtml('PFR', seatPlayer.pfr)}</div>
      `;
    }
    seatElem.append(positionHud);
    return positionHud;
  });


  tableState.hudElems[0].style.top = '80%';
  tableState.hudElems[0].style.left = '90%';
  tableState.hudElems[1].style.top = '130%';
  tableState.hudElems[2].style.top = '70%';
  tableState.hudElems[3].style.top = '-1%';
  tableState.hudElems[3].style.left = '80%';
  tableState.hudElems[4].style.top = '70%';
  tableState.hudElems[4].style.left = '50%';
  tableState.hudElems[5].style.top = '130%';
  tableState.hudElems[5].style.left = '50%';
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

function processMessage(message) {
  let logMsg = `${REVERSED_PACKET_CLASSES[message.classId]}`
  if (tableState.tableid === null) {
    switch(message.classId) {
      case PACKET_CLASSES.NotifySeatedPacket:
        tableState.myPlayerSeat = message.seat;
        tableState.tableid = message.tableid;
        tableState.gamePhase = GAME_PHASES.NotStarted;
        break;
      case PACKET_CLASSES.WatchResponsePacket:
        tableState.tableid = message.tableid;
        tableState.gamePhase = GAME_PHASES.NotStarted;
        break;
      default:
        return;
    }
  }

  if (tableState.tableid !== message.tableid) {
    return;
  }

  switch (message.classId) {
    case PACKET_CLASSES.SeatInfoPacket:
      tableState.players[message.seat] = createPlayer(message.player.pid, message.player.nick);
      break;
    case PACKET_CLASSES.NotifyJoinPacket:
      tableState.players[message.seat] = createPlayer(message.pid, message.nick);
      break;
    case PACKET_CLASSES.NotifyLeavePacket:
      const index = tableState.players.findIndex(player => player && player.pid === message.pid);
      tableState.players[index] = null;
      break;
    case PACKET_CLASSES.NotifySeatedPacket:
      tableState.myPlayerSeat = message.seat;
      break;
    case PACKET_CLASSES.UnwatchResponsePacket:
    case PACKET_CLASSES.LeaveResponsePacket:
      tableState = createBlankTableState();
      removeHud();
      break;
    case PACKET_CLASSES.GameTransportPacket:
      const decodedGameData = atob(message.gamedata);
      const gameDataBytes = Uint8Array.from(decodedGameData, b => b.charCodeAt(0))
      const gameDataClass = gameDataBytes[4];
      logMsg += `: ${REVERSED_GAME_DATA_CLASSES[gameDataClass]}`
      switch(gameDataClass) {
        case GAME_DATA_CLASSES.HandStartInfo:
          tableState.gamePhase = GAME_PHASES.Preflop;
          break;
        case GAME_DATA_CLASSES.DealPublicCards:
          switch(tableState.gamePhase){
            case GAME_PHASES.Preflop:
              tableState.gamePhase = GAME_PHASES.Flop;
              tableState.players.forEach(function(player) {  
                if (!player) {
                  return;
                }
                if(player.vpip.eligibleInHand){
                  player.vpip.denominator += 1;
                }
                if(player.vpip.qualifiedInHand){
                  player.vpip.numerator += 1;
                }
                if(player.pfr.eligibleInHand){
                  player.pfr.denominator += 1;
                }
                if(player.pfr.qualifiedInHand){
                  player.pfr.numerator += 1;
                }
                player.vpip.eligibleInHand = false;
                player.vpip.qualifiedInHand = false;
                player.pfr.eligibleInHand = false;
                player.pfr.qualifiedInHand = false;
              });
              break;
            case GAME_PHASES.Flop:
              tableState.gamePhase = GAME_PHASES.Turn;
              break;
            case GAME_PHASES.Turn:
              tableState.gamePhase = GAME_PHASES.River;
              break;
            default:
              tableState.gamePhase = GAME_PHASES.NotStarted;
          }
          break;
        case GAME_DATA_CLASSES.PerformAction:
          if (tableState.gamePhase !== GAME_PHASES.Preflop) {
            break;
          }
          const playerBytes = gameDataBytes.slice(9, 13);
          function bytesToIntReducer(acc, val, i) {
            return Math.pow(2, (3-i)*8)*val + acc;
          }
          const pid = playerBytes.reduce(bytesToIntReducer);
          const player = tableState.players.find(player => player && player.pid === pid);

          const actionType = gameDataBytes[13];
          switch(actionType) {
            case ACTION_TYPES.CALL:
              player.vpip.eligibleInHand = true;
              player.vpip.qualifiedInHand = true;
              player.pfr.eligibleInHand = true;
              break;
            case ACTION_TYPES.BET:
            case ACTION_TYPES.RAISE:
              player.vpip.eligibleInHand = true;
              player.vpip.qualifiedInHand = true;
              player.pfr.eligibleInHand = true;
              player.pfr.qualifiedInHand = true;
              break;
            case ACTION_TYPES.CHECK:
              player.pfr.eligibleInHand = true;
              break;
            case ACTION_TYPES.FOLD:
              player.vpip.eligibleInHand = true;
              player.pfr.eligibleInHand = true;
              break;
            default:
              break;
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
  console.log(logMsg);
}

function retrieveMessage() {
  const messageListElem = document.getElementById('__socketData')
  messageListElem.childNodes.forEach(function(messageElem) {
    const message = JSON.parse(messageElem.innerHTML);
    if (message.classId != null) {
      // console.log(REVERSED_PACKET_CLASSES[message.classId]);
      processMessage(message)
    }
  });
  while (messageListElem.firstChild) {
    messageListElem.removeChild(messageListElem.firstChild);
  }
}

setInterval(requestIdleCallback.bind(this, retrieveMessage), 5000);
