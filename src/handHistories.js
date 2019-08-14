// Paid: XSD
// Free: XGC
function getHandHistoryUrl(sessionToken) {
  return `https://player-api.globalpoker.com/rest/player/handhistory/XSD?count=20&startTime=0&descending=true&session=${sessionToken}&playerId=2387923`;
}

export async function getHandHistory(sessionToken) {
  const response = await fetch(getHandHistoryUrl(sessionToken))
  return response.json();
}