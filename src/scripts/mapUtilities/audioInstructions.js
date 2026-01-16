import rightAudio from '../../audio/right.mp3';
import slightRightAudio from '../../audio/slight-right.mp3';
import sharpRightAudio from '../../audio/sharp-right.mp3';
import leftAudio from '../../audio/left.mp3';
import slightLeftAudio from '../../audio/slight-left.mp3';
import sharpLeftAudio from '../../audio/sharp-left.mp3';
import straightAudio from '../../audio/straight.mp3';
import arrivalAudio from '../../audio/arrival.mp3';

let lastLocation = null;
let audioUnlocked = false;

const audioMap = {
  left: new Audio(leftAudio),
  right: new Audio(rightAudio),
  'slight left': new Audio(slightLeftAudio),
  'slight right': new Audio(slightRightAudio),
  'sharp left': new Audio(sharpLeftAudio),
  'sharp right': new Audio(sharpRightAudio),
  straight: new Audio(straightAudio),
  arrive: new Audio(arrivalAudio),
};

Object.values(audioMap).forEach((audio) => {
  audio.preload = 'auto';
  audio.playsInline = true;
});

export function unlockAudio() {
  if (audioUnlocked) return;

  Object.values(audioMap).forEach((audio) => {
    const originalVolume = audio.volume;
    audio.volume = 0;
    audio.muted = true;

    audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
        audio.volume = originalVolume;
      })
      .catch(() => {
        audio.muted = false;
        audio.volume = originalVolume;
      });
  });

  audioUnlocked = true;
}

export function resetAudioHistory() {
  lastLocation = null;
}

export function playAudioDirection(allDirections) {
  if (!audioUnlocked) return;

  const currentDirection = allDirections[1];
  if (!currentDirection) return;

  if (isValid(currentDirection)) {
    lastLocation = currentDirection.location;
    playAudio(currentDirection);
  }
}

function playAudio(direction) {
  let audio;

  if (direction.type === 'arrive') {
    audio = audioMap.arrive;
  } else {
    audio = audioMap[direction.modifier] || audioMap.straight;
  }

  audio.pause();
  audio.currentTime = 0;

  audio.play().catch(() => {});
}

function isValid(direction) {
  return (
    direction.distance <= 50 &&
    direction.type !== 'depart' &&
    JSON.stringify(direction.location) !== JSON.stringify(lastLocation)
  );
}
