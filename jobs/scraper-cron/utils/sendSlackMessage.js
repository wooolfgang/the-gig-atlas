const sendMessageSlack = (text, threadTs) =>
  fetch('https://slack.com/api/chat.postMessage', {
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${process.env.SLACK_AUTH_TOKEN}`,
    },
    method: 'POST',
    body: JSON.stringify(
      threadTs
        ? { channel: '#logs', text, thread_ts: threadTs }
        : { channel: '#logs', text },
    ),
  });

module.exports = sendMessageSlack;
