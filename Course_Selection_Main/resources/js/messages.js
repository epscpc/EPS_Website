async function getData() {
  // works in dev
  const url = "https://www.elginparksecondary.com/orca-news/data?api=msg";
  const response = await fetch(url);
  // badly formatted "JSON" from ON
  const rawText = await response.text();
  return JSON.parse(rawText.replace(/[\x00-\x1F]/g, " "));
}

getData().then((data) => {
  for (const message of data) {
    let messageArticle = document.createElement('article');
    messageArticle.setAttribute('id', `msg-${message['sid']}`);
    messageArticle.setAttribute('class', 'message');

    if (message['atts'].length && !message['atts'][0]['url'].endsWith('.pdf')) {
      const messageAttachment = document.createElement('img');
      messageAttachment.setAttribute('src', message['atts'][0]['url']);
      messageAttachment.setAttribute('loading', 'lazy');
      messageAttachment.setAttribute('alt', '');
      messageArticle.appendChild(messageAttachment);
    }

    const messageDate = document.createElement('div');
    messageDate.setAttribute('class', 'date');
    messageDate.textContent = message['date'];
    messageArticle.appendChild(messageDate);

    const messageText = document.createElement('span');
    messageText.setAttribute('class', 'msg-text');
    // XSS
    let messageInnerHTML = message['text']
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#x27;')
        .replaceAll('/', '&#x2F;');
    messageText.innerHTML = messageInnerHTML.replace(/\r\n|\r|\n/g, '<br>') + ' ';
    messageArticle.appendChild(messageText);

    if (message['url']) {
      const topLevelLink = document.createElement('a');
      topLevelLink.setAttribute('href', message['url']);
      topLevelLink.setAttribute('title', message['text']);
      topLevelLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.open(message.url, 'newwindow', 'width=550,height=600');
      })
      topLevelLink.setAttribute('onmouseover', "this.title='';");

      const moreLink = document.createElement('span');
      moreLink.setAttribute('class', 'msg-more');
      moreLink.setAttribute('aria-hidden', 'true');
      moreLink.textContent = '[more]'
      messageArticle.appendChild(moreLink)

      const endingHr = document.createElement('hr');
      endingHr.setAttribute('class', 'msg-divider');
      messageArticle.appendChild(endingHr);

      topLevelLink.appendChild(messageArticle);
      document.querySelector("main").append(topLevelLink);
    } else {
      const endingHr = document.createElement('hr');
      endingHr.setAttribute('class', 'msg-divider');
      messageArticle.appendChild(endingHr);
      document.querySelector("main").append(messageArticle);
    }
  }
  document.getElementById('loading-message').remove();
  document.getElementById('body').setAttribute(
      'style', 'cursor: auto !important;');
});
