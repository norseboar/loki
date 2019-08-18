const SERVER_URL = 'https://loki-poker.herokuapp.com'
// TODO: Replace this w/ config not accessible in code
const API_KEY = `]Vfnx[c<RL95Y8/L,YqTgAs]L'V-Q&cA`

const defaultOptions = {
  mode: 'cors',
  headers: {'X-Api-Key': API_KEY}
}

async function loadPlayer(pid, nick, seat) {
  const response = await fetch(SERVER_URL + `/players/${pid}`, defaultOptions);

  let existingData = null;
  if (response.ok) {
    existingData = response.json();
    if (pid !== existingData.pid) {
      console.log(`Request for PID ${pid} fetched wrong player`)
      console.log(existingData);
      existingData = null;
    }
  }

  player = {
    pid,
    nick,
    seat,
    vpip: createStat(existingData && existingData.vpip),
    pfr: createStat(existingData && existingData.pfr),
    threeBet: createStat(existingData && existingData.threeBet),
    foldToCbet: createStat(existingData && existingData.foldToCbet),
    isNew: Boolean(existingData)
  }
  return player;
}

async function savePlayer(player) {
  const requestOptions = Object.assign({}, defaultOptions);
  requestOptions.headers['Content-Type'] = 'application/json'
  requestOptions.body = JSON.stringify(player);
  let response;

  if (player.isNew) {
    requestOptions.method = 'POST';
    response = await fetch(SERVER_URL + '/players/', requestOptions);
  } else {
    requestOptions.method = 'PATCH';
    response = await fetch(SERVER_URL + `/players/${player.pid}`,
                           requestOptions);
  }

  if (!response.ok) {
    console.log(`Had a problem saving PID ${player.pid}`);
    console.log(player);
  }
}
