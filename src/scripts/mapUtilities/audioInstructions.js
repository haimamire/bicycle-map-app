let lastLocation;

export function resetAudioHistory() {
  lastLocation = '';
}

export function playAudioDirection(allDirections) {
  // console.log(allDirections);
  const currentDirection = allDirections[1];
  if (isValid(currentDirection)) {
    lastLocation = currentDirection.location;
    playAudio(currentDirection);
  }
}

function playAudio(currentDirection) {
  const { type, modifier } = currentDirection;

  if (type === 'arrive') {
    console.log('Played arrive audio');
  } else if (modifier.includes('right')) {
    console.log('Played turn right audio');
  } else if (modifier.includes('left')) {
    console.log('Played turn left audio');
  } else {
    console.log('Played go forward audio');
  }
}

function isValid(direction) {
  if (
    direction.distance <= 50 &&
    direction.type !== 'depart' &&
    JSON.stringify(direction.location) !== JSON.stringify(lastLocation)
  ) {
    return true;
  }
  return false;
}
