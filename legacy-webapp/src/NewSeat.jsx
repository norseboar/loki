import React, {useState} from 'react';
import useCounter from './useCounter';

function Seat({resetSeat, seatInfo}) {
  return (
    <div style={{padding: '10px'}}>
      <div>
        VPIP: {(100 * seatInfo.vpip.actedCount / seatInfo.vpip.opportunityCount).toFixed(0)} %  ({seatInfo.vpip.actedCount}/{seatInfo.vpip.opportunityCount})
      </div>
      <div>
        PFR: {(100 * seatInfo.pfr.actedCount / seatInfo.pfr.opportunityCount).toFixed(0)} %  ({seatInfo.pfr.actedCount}/{seatInfo.pfr.opportunityCount})
      </div>
      <button onClick={resetSeat}>Reset</button>
    </div>
  );
}

export default Seat;