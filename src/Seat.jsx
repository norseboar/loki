import React, {useState} from 'react';
import useCounter from './useCounter';

function Seat({handIndex}) {
  const [vpipCount, incrementVpipCount, resetVpipCount] = useCounter();
  const [pfrCount, incrementPfrCount, resetPfrCount] = useCounter();
  const [startingHandIndex, setStartingHandIndex] = useState(0);

  function getHandCount() {
    return handIndex - startingHandIndex + 1;
  }

  function resetSeat() {
    resetVpipCount();
    resetPfrCount();
    setStartingHandIndex(handIndex);
  }

  function raise() {
    incrementPfrCount()
    incrementVpipCount()
  }

  return (
    <div style={{padding: '10px'}}>
      <div>
        Hands: {getHandCount()}
      </div>
      <div>
        VPIP: {(100 * vpipCount / getHandCount()).toFixed(0)} %  ({vpipCount})
      </div>
      <div>
        PFR: {(100 * pfrCount / getHandCount()).toFixed(0)} %  ({pfrCount})
      </div>
      <button onClick={incrementVpipCount}>VPIP</button>      
      <button onClick={raise}>PFR</button>
      <button onClick={resetSeat}>Reset</button>
    </div>
  );
}

export default Seat;