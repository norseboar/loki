const EVENTS = {
  PLAYER_ACTION_EVENT: 'PlayerAction',
  TABLE_CARDS_DEALT_EVENT:'TableCardsDealt'
}
const GAME_STATES = {
  PREFLOP: 'PREFLOP',
  FLOP: 'FLOP',
  TURN: 'TURN',
  RIVER: 'RIVER'
}
const ACTIONS = {
  CALL: 'CALL',
  CHECK: 'CHECK',
  FOLD: 'FOLD',
  RAISE: 'RAISE',
}



export default function processHand(hand) {
  const seats = hand.seats.map(function(seat) {
    return {
      seatId: seat.seatId,
      playerId: seat.playerId,
      pfr: {
        actedCount: 0,
        opportunityCount: 0,
      },
      vpip: {
        actedCount: 0,
        opportunityCount: 0,
      }
    }
  });
  let gameState = GAME_STATES.PREFLOP;
  for (let event of hand.events) {
    if (gameState === GAME_STATES.PREFLOP) {
      switch (event.type) {
        case EVENTS.TABLE_CARDS_DEALT_EVENT:
          gameState = GAME_STATES.FLOP
          break;

        case EVENTS.PLAYER_ACTION_EVENT:
          const seat = seats.find(function(seat) {
            return seat.playerId === event.playerId;
          })
          seat.pfr.opportunityCount = 1;
          seat.vpip.opportunityCount = 1;
          switch (event.action) {
            case ACTIONS.CALL:
              seat.vpip.actedCount = 1;
              break;

            case ACTIONS.RAISE:
              seat.vpip.actedCount = 1;
              seat.pfr.actedCount = 1;
              break;

            default:
              break;
          }
          break;

        default:
          break;
      }
    }
  }
  return seats;
}