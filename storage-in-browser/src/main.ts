import './style.css';

const fileInput = document.getElementById('file-input') as HTMLInputElement;
const preview = document.getElementById('preview') as HTMLImageElement;
const textarea = document.getElementById('textarea') as HTMLTextAreaElement;
const readOnlyInput = document.getElementById('read-input') as HTMLInputElement;

const storedText = localStorage.getItem('textarea-text');
const imagePath = localStorage.getItem('image-path');
const firstVisit = localStorage.getItem('first-visit');
const visitTime = localStorage.getItem('first-visit-time');

const ttl = 5 * 60 * 1000; // 5m

if (imagePath) {
  preview.src = imagePath;
}

if (storedText) {
  textarea.value = storedText;
}

const storedWidth = localStorage.getItem('textarea-width');
const storedHeight = localStorage.getItem('textarea-height');
if (storedWidth && storedHeight) {
  textarea.style.width = storedWidth;
  textarea.style.height = storedHeight;
}

if (!firstVisit || (visitTime && Date.now() - parseInt(visitTime, 10) > ttl)) {
  localStorage.setItem('first-visit', 'false');
  localStorage.setItem('first-visit-time', Date.now().toString());
  readOnlyInput.value = 'Вы зашли впервые';
} else {
  readOnlyInput.value = 'Вы заходили раньше';
}

textarea.addEventListener('input', () => {
  localStorage.setItem('textarea-text', textarea.value);
});

const resizeObserver = new ResizeObserver(() => {
  localStorage.setItem('textarea-width', textarea.style.width);
  localStorage.setItem('textarea-height', textarea.style.height);
});
resizeObserver.observe(textarea);

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (file) {
    const fileURL = URL.createObjectURL(file);
    localStorage.setItem('image-path', fileURL);
    preview.src = fileURL;
  }
});

setInterval(() => {
  const currentTime = Date.now();
  const visitTime = localStorage.getItem('first-visit-time');

  if (visitTime) {
    const timePassed = currentTime - parseInt(visitTime, 10);
    const timeLeft = ttl - timePassed;

    if (timeLeft > 0) {
      let seconds = Math.floor(timeLeft / 1000);
      const minutesLeft = Math.floor(seconds / 60);
      if (!firstVisit) {
        readOnlyInput.value = `Вы зашли впервые (помним вас еще ${minutesLeft} мин ${seconds % 60} сек)`;
      } else {
        readOnlyInput.value = `Вы заходили раньше (помним вас еще ${minutesLeft} мин ${seconds % 60} сек)`;
      }
    } else {
      localStorage.removeItem('first-visit');
      localStorage.removeItem('first-visit-time');
      readOnlyInput.value = 'Забыли вас';
    }
  }
}, 1000);

window.addEventListener('storage', (e) => {
  if (e.key === 'textarea-text') {
    textarea.value = e.newValue || '';
  }
});