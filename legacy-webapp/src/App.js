import update, {extend} from 'immutability-helper';
import React, {useState} from 'react';
import './App.css';
import {getHandHistory} from './handHistories';
import processHand from './processHand';
import Seat from './NewSeat';
import useCounter from './useCounter';
import useFormInput from './useFormInput';

const PLAYER_ID = 2387923;

extend('$addNumber', function(num, original) {
  return original + num;
});

function App() {
  const [sessionTokenInputValue, onChangeSessionToken] = useFormInput('');
  const [tableNameInputValue, onChangeTableName] = useFormInput('');
  const [sessionToken, setSessionToken] = useState('');
  const [tableName, setTableName] = useState('');
  const [lastProcessedHand, setLastProcessedHand] = useState({
    startTime: Date.now()
  });
  const [seats, setSeats] = useState([...Array(6).keys()].map(function(i) {
    return {
      id: i,
      pfr: {
        actedCount: 0,
        opportunityCount: 0,
      },
      vpip: {
        actedCount: 0,
        opportunityCount: 0,
      },
    }
  }));
  const [sessionInfo, setSessionInfo] = useState(null);

  function resetSeat(seatId) {

    const updatedSeats = []
    seats.forEach(function(seat) {
      if (seat.id === seatId) {
        updatedSeats.push({
          id: seatId,
          pfr: {
            actedCount: 0,
            opportunityCount: 0,
          },
          vpip: {
            actedCount: 0,
            opportunityCount: 0,
          },
        });
      } else  {
        updatedSeats.push(seat);
      }
    });
    setSeats(updatedSeats);
  }

  async function startTracking() {
    console.log('Current state:')
    if (sessionInfo) {
      let status = '';
      seats.forEach(function(seat) {
        status += `${seat.id}`
        status += `PFR: ${seat.pfr.actedCount/seat.pfr.opportunityCount} `
        status += `VPIP: ${seat.vpip.actedCount/seat.vpip.opportunityCount} `
        status += '|'
      })
    }
    setSessionToken(sessionTokenInputValue);
    setTableName(tableNameInputValue);
    const handHistory = await getHandHistory(sessionTokenInputValue);
    console.log(`Fetching handhistories for ${lastProcessedHand.startTime}`)
    console.log(handHistory)
    let newHands = [];
    handHistory.hands.forEach(function(hand) {
      if (hand.startTime > lastProcessedHand.startTime && hand.table.tableName.toLowerCase() === tableNameInputValue.toLowerCase()) {
        newHands.push(hand);
      }
    });
    const updatedSeats = [...seats];
    newHands.forEach(function(hand) {
      console.log(`processing ${hand.id}`)
      console.log(hand)
      const handSeats = processHand(hand);
      handSeats.forEach(function(handSeat) {
        const seat = updatedSeats.find(function(seat) {
          return seat.id === handSeat.seatId;
        });
        seat.pfr.actedCount += handSeat.pfr.actedCount;
        seat.pfr.opportunityCount += handSeat.pfr.opportunityCount;
        seat.vpip.actedCount += handSeat.vpip.actedCount;
        seat.vpip.opportunityCount += handSeat.vpip.opportunityCount;
      })
    });
    if (newHands.length > 0) {
      setLastProcessedHand(newHands[0]);
      setSeats(updatedSeats);
      
      setSessionInfo({
        playerSeat: newHands[0].seats.find(function(seat) {
          return seat.playerId === PLAYER_ID;
        }).seatId
      });
    }        
  }

  return (
    <div className="App" style={{alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', flexDirection: 'column', width: '600px'}}>
        {
          sessionInfo
          ? <div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <Seat 
                seatInfo={seats.find(function(seat) {
                  return seat.id === (2 + sessionInfo.playerSeat) % 6
                })}
                resetSeat={resetSeat.bind(this, (2 + sessionInfo.playerSeat) % 6)}
              />
              <Seat 
                seatInfo={seats.find(function(seat) {
                  return seat.id === (3 + sessionInfo.playerSeat) % 6
                })}
                resetSeat={resetSeat.bind(this, (3 + sessionInfo.playerSeat) % 6)}
              />
              <Seat
                seatInfo={seats.find(function(seat) {
                  return seat.id === (4 + sessionInfo.playerSeat) % 6
                })}
                resetSeat={resetSeat.bind(this, (4 + sessionInfo.playerSeat) % 6)}
              />
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <Seat
                seatInfo={seats.find(function(seat) {
                  return seat.id === (1 + sessionInfo.playerSeat) % 6
                })} 
                resetSeat={resetSeat.bind(this, (1 + sessionInfo.playerSeat) % 6)}
              />
              <Seat
                seatInfo={seats.find(function(seat) {
                  return seat.id === (5 + sessionInfo.playerSeat) % 6
                })}
                resetSeat={resetSeat.bind(this, (5 + sessionInfo.playerSeat) % 6)}
              />
            </div>
          </div>
          : <div>No Session Loaded</div> }
        <div>
          <div>
            <label style={{marginRight: '6px'}}>Session Token</label>
            <input type='text' style={{marginTop: '6px'}} onChange={onChangeSessionToken} value={sessionTokenInputValue}/>
          </div>
          <div>
            <label style={{marginRight: '6px'}}>Table Name</label>
            <input type='text' style={{marginTop: '6px'}} onChange={onChangeTableName} value={tableNameInputValue}/> 
          </div>
          <button onClick={startTracking} style={{marginTop: '6px'}}>Start Tracking</button>
        </div>
      </div>
    </div>
  );
}

export default App;
