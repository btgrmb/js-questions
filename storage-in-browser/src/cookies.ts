import './style.css';

const ttl = 5 * 60 * 1000; // 5m

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string): void {
  const date = new Date();
  date.setTime(date.getTime() + ttl);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

const fileInput = document.getElementById('file-input') as HTMLInputElement;
const textarea = document.getElementById('textarea') as HTMLTextAreaElement;
const preview = document.getElementById('preview') as HTMLImageElement;
const readOnlyInput = document.getElementById('read-input') as HTMLInputElement;

const storedText = getCookie('textarea-text');
const imagePath = getCookie('image-path');
const firstVisit = getCookie('first-visit');
const visitTime = getCookie('first-visit-time');

if (storedText) {
  textarea.value = storedText;
}

if (imagePath) {
  preview.src = imagePath;
}

const storedWidth = getCookie('textarea-width');
const storedHeight = getCookie('textarea-height');
if (storedWidth && storedHeight) {
  textarea.style.width = storedWidth;
  textarea.style.height = storedHeight;
}

if (!firstVisit || (visitTime && Date.now() - parseInt(visitTime, 10) > ttl)) {
  setCookie('first-visit', 'false');
  setCookie('first-visit-time', Date.now().toString());
  readOnlyInput.value = 'Вы зашли впервые';
} else {
  readOnlyInput.value = 'Вы заходили раньше';
}

textarea.addEventListener('input', () => {
  setCookie('textarea-text', textarea.value);
});

const resizeObserver = new ResizeObserver(() => {
  setCookie('textarea-width', textarea.style.width);
  setCookie('textarea-height', textarea.style.height);
});
resizeObserver.observe(textarea);

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (file) {
    const fileURL = URL.createObjectURL(file);
    setCookie('image-path', fileURL);
    preview.src = fileURL;
  }
});

setInterval(() => {
  const currentTime = Date.now();
  const visitTime = getCookie('first-visit-time');

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
      document.cookie = `first-visit=; expires=${new Date(0).toUTCString()}; path=/`;
      document.cookie = `first-visit-time=; expires=${new Date(0).toUTCString()}; path=/`;
      readOnlyInput.value = 'Забыли вас';
    }
  }
}, 1000);
