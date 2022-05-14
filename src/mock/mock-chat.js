'use strict';

const chats = require('./chats-tina-toni.json');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const createChatMessageContainer = messageId => {
  return `<div class="row">
  <div class="col" id='message-container-${messageId}'></div>
</div>`;
};

const typingChatMessage = () => {
  return `<div class="chat-message-container">
  <span class="spinner-border text-primary spinner-border-sm" role="status"></span>
  <span>Typing...</span>
</div>`;
};

const chatBox = (messageId, message, time, fromSelf) => {
  return `<div class="chat-message-container ${fromSelf ? 'from-self float-end' : ''}">
  <span class="message">${message}</span>
  <span class="text-end time">${time}</span>
</div>`;
};

module.exports = async function mockChat() {
  const chatContainer = document.getElementById('chat-container');

  let messageId = 1;

  for (const chat of chats) {
    const { delay, time, message, fromSelf } = chat;

    chatContainer.innerHTML += createChatMessageContainer(messageId);

    let messageElem = document.getElementById(`message-container-${messageId}`);

    if (!fromSelf) {
      messageElem.innerHTML = typingChatMessage();
    }

    chatContainer.scrollTop = chatContainer.scrollHeight;

    await sleep(delay * 1000);
    messageElem.innerHTML = chatBox(messageId, message, time, fromSelf);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    messageId++;

    await sleep(delay * 1000);
  }
};
