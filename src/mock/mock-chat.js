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
    const { delay, time, message, fromSelf } = chat;

    const writingDelayInMilliseconds = message.length * 100;

    chatContainer.innerHTML += createChatMessageContainer(messageId);

    let messageElem = document.getElementById(`message-container-${messageId}`);

    if (fromSelf) {
      await mimicTyping({ fakeChatInputElement, message });
    } else {
      messageElem.innerHTML = typingChatMessage();
      chatContainer.scrollTop = chatContainer.scrollHeight;
      await sleep(writingDelayInMilliseconds);
    }

    messageElem.innerHTML = chatBox(messageId, message, time, fromSelf);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    messageId++;

    await sleep(delay * 1000);
  }
};
