import './style.css';

const fileInput = document.getElementById('file-input') as HTMLInputElement;
const preview = document.getElementById('preview') as HTMLImageElement;
const textarea = document.getElementById('textarea') as HTMLTextAreaElement;
const readOnlyInput = document.getElementById('read-input') as HTMLInputElement;

const storedText = sessionStorage.getItem('textarea-text');
const imagePath = sessionStorage.getItem('image-path');
const firstVisit = sessionStorage.getItem('first-visit');
const visitTime = sessionStorage.getItem('first-visit-time');

const ttl = 5 * 60 * 1000; // 5m

if (imagePath) {
  preview.src = imagePath;
}

if (storedText) {
  textarea.value = storedText;
}

const storedWidth = sessionStorage.getItem('textarea-width');
const storedHeight = sessionStorage.getItem('textarea-height');
if (storedWidth && storedHeight) {
  textarea.style.width = storedWidth;
  textarea.style.height = storedHeight;
}

if (!firstVisit || (visitTime && Date.now() - parseInt(visitTime, 10) > ttl)) {
  sessionStorage.setItem('first-visit', 'false');
  sessionStorage.setItem('first-visit-time', Date.now().toString());
  readOnlyInput.value = 'Вы зашли впервые';
} else {
  readOnlyInput.value = 'Вы заходили раньше';
}

textarea.addEventListener('input', () => {
  sessionStorage.setItem('textarea-text', textarea.value);
});

const resizeObserver = new ResizeObserver(() => {
  sessionStorage.setItem('textarea-width', textarea.style.width);
  sessionStorage.setItem('textarea-height', textarea.style.height);
});
resizeObserver.observe(textarea);

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (file) {
    const fileURL = URL.createObjectURL(file);
    sessionStorage.setItem('image-path', fileURL);
    preview.src = fileURL;
  }
});

setInterval(() => {
  const currentTime = Date.now();
  const visitTime = sessionStorage.getItem('first-visit-time');

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
      sessionStorage.removeItem('first-visit');
      sessionStorage.removeItem('first-visit-time');
      readOnlyInput.value = 'Забыли вас';
    }
  }
}, 1000);
