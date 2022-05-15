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
  <span class="text-end time">${time} <span id="message-status-ticks-${messageId}"></span></span>
</div>`;
};

const mimicTyping = async ({ fakeChatInputElement, message }) => {
  fakeChatInputElement.value = '';
  for (const messageCharacter of message) {
    await sleep(100);
    fakeChatInputElement.value += messageCharacter;
    fakeChatInputElement.scrollTop = fakeChatInputElement.scrollHeight;
  }
  await sleep(1000);
  fakeChatInputElement.value = '';
};

module.exports = async function mockChat() {
  const chatContainer = document.getElementById('chat-container');
  const fakeChatInputElement = document.getElementById('fake-chat-input');

  let messageId = 1;

  for (const chat of chats) {
    const {
      readingDelay,
      time,
      message,
      fromSelf = false,
      pendingMessageDelay = 0,
      deliveredMessageDelay = 0,
      readMessageDelay = 0
    } = chat;

    chatContainer.innerHTML += createChatMessageContainer(messageId);

    let messageElem = document.getElementById(`message-container-${messageId}`);

    if (fromSelf) {
      fakeChatInputElement.focus();
      await mimicTyping({ fakeChatInputElement, message });
    } else {
      messageElem.innerHTML = typingChatMessage();
      chatContainer.scrollTop = chatContainer.scrollHeight;
      const writingDelayInMilliseconds = message.length * 100;
      messageId > 1 && (await sleep(writingDelayInMilliseconds));
    }

    messageElem.innerHTML = chatBox(messageId, message, time, fromSelf);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    if (fromSelf) {
      const messageTickElement = document.getElementById(`message-status-ticks-${messageId}`);
      await sleep(pendingMessageDelay * 1000);
      messageTickElement.innerHTML = '<i class="bi bi-check"></i>';
      await sleep(deliveredMessageDelay * 1000);
      messageTickElement.innerHTML = '<i class="bi bi-check-all"></i>';
      await sleep(readMessageDelay * 1000);
      messageTickElement.innerHTML = '<i class="bi bi-check-all text-primary"></i>';
    }

    messageId++;
    await sleep(readingDelay * 1000);
  }
};
