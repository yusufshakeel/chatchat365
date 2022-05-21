'use strict';

const chats = require('./chats-tina-toni.json');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const createChatMessageContainer = messageId => {
  return `<div class="row">
  <div class="col" id='message-container-${messageId}'></div>
</div>`;
};

const typingChatMessage = () => {
  return `<div class="chat-message-container float-start">
  <span class="spinner-border text-primary spinner-border-sm" role="status"></span>
  <span>Typing...</span>
</div>`;
};

const chatBox = (messageId, message, time, fromSelf) => {
  return `<div class="chat-message-container ${fromSelf ? 'from-self float-end' : 'float-start'}">
  <span class="message">${message}</span>
  <p class="align-right time m-0">${time} <span id="message-status-ticks-${messageId}"></span></p>
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
  const chatUserIsOnlineStatus = document.getElementById('chat-user-is-online-status-container');

  let messageId = 1;

  for (const chat of chats) {
    const {
      command,
      duration = 0,
      readingDelay,
      time,
      message,
      fromSelf = false,
      pendingMessageDelay = 0,
      deliveredMessageDelay = 0,
      readMessageDelay = 0
    } = chat;

    if (command) {
      if (command === 'OFFLINE') {
        chatUserIsOnlineStatus.innerHTML = `<small><i class="bi bi-circle-fill text-dark"></i> Offline</small>`;
      } else {
        chatUserIsOnlineStatus.innerHTML = `<small><i class="bi bi-circle-fill text-success"></i> Online</small>`;
      }
      await sleep(duration * 1000);
      continue;
    }

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
