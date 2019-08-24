const SERVER_URL = 'https://loki-poker.herokuapp.com'

let apiKey = null;

chrome.storage.sync.get(['apiKey'], function(result) {
  console.log(result);
  apiKey = result.apiKey;
});

// Use a function so that apiKey is up to date
function getDefaultOptions() {
  return {
    mode: 'cors',
    headers: {'X-Api-Key': apiKey}
  };
}

async function loadPlayer(pid, nick, seat) {
  const response = await fetch(SERVER_URL + `/players/${pid}`,
                               getDefaultOptions());

  let existingData = null;
  if (response.ok) {
    existingData = await response.json();
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
    isNew: !existingData
  }
  return player;
}

async function savePlayer(player) {
  const requestOptions = Object.assign({}, getDefaultOptions());
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
