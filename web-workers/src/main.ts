import './style.css';

const worker = new Worker(new URL('./worker.ts', import.meta.url));

worker.onmessage = (e) => {
  const list = document.getElementById('users');
  if (list) {
    const users = e.data;

    users.forEach((user: { email: string; name: string }) => {
      const li = document.createElement('li');
      li.textContent = `UserName: ${user.name}, Email: ${user.email}`;
      list.appendChild(li);
    });
  }
};

fetch('https://raw.githubusercontent.com/json-iterator/test-data/refs/heads/master/large-file.json')
  .then((response) => response.json())
  .then((data) => {
    worker.postMessage(JSON.stringify(data));
  });