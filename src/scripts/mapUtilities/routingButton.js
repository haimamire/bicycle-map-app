import { drawRoute } from './routingMachine';
import { resetAudioHistory, unlockAudio } from './audioInstructions';

export function addRoutingBtn(map, lat, lng) {
  const routingBtn = document.createElement('button');
  routingBtn.textContent = '経路';
  routingBtn.className = 'directions-btn';

  routingBtn.addEventListener('click', () => {
    if (document.querySelector('.user-marker')) {
      document.querySelector('.user-marker').remove();
      document.querySelector('.user-marker-popup').remove();
    }
    map.closePopup();

    resetAudioHistory();
    unlockAudio();
    drawRoute(map, lat, lng, true);
  });

  return routingBtn;
}
