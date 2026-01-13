import './styles/fontsAndReset.css';
import './styles/styles.css';

document.addEventListener('DOMContentLoaded', () => {});

function addScript(src, type) {
  const s = document.createElement(type);
  s.setAttribute('src', src);

  if (type === 'script') {
    document.body.appendChild(s);
  } else {
    s.setAttribute('rel', 'stylesheet');
    document.head.appendChild(s);
  }
}

const btnActive = document.querySelector('.btn-active');
const mapContainer = document.querySelector('#map');
