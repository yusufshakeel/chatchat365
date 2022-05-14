'use strict';

const mockChat = require('../mock/mock-chat');

window.onload = function () {
  const chainInputContainer = document.getElementById('footer-chat-input-container');
  const newMessageElement = document.getElementById('click-me-to-read');
  const chatWithImage = document.getElementById('chat-with-image');

  newMessageElement.addEventListener('click', () => {
    newMessageElement.style.display = 'none';
    chatWithImage.style.display = 'initial';
    chainInputContainer.style.display = 'initial';

    mockChat();
  });
};
