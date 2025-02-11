onmessage = (e) => {
  const data = JSON.parse(e.data);

  const result: any[] = [];

  data.forEach((item: { payload: { commits: any } }) => {
    if (item?.payload?.commits) {
      item.payload.commits.forEach((commit) => {
        result.push(commit.author);
      });
    }
  });

  postMessage(result);
};