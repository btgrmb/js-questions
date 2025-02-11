
const checkUrlsAvailabity = async (urls: string[]): Promise<void> => {
  let urlsChecked = 0;
  const total = urls.length;
  const results: any[] = [];

  await Promise.all(
    urls.map(async (url) => {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 10000); 

      try {
        await fetch(url, {
          mode: 'no-cors',
          signal: abortController.signal,
        });

        results.push({ url, status: 'доступен' });
      } catch (err) {
        results.push({ url, status: 'недоступен' });
      }

      clearTimeout(timeoutId); 
      urlsChecked++;
      console.log(`Прогресс: ${urlsChecked}/${total}`);
    })
  );

  console.log('\nДоступность ресурсов: ');
  results.forEach(result => {
    console.log(result.url, result.status);
  });
};

checkUrlsAvailabity(['https://google.com', 'https://yandex.ru', 'https://mail.ru']);