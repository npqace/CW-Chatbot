class Chatbox {
    constructor() {
        this.args = {
            chatMessages: document.getElementById('chatMessages'),
            userInput: document.getElementById('userInput'),
            sendButton: document.getElementById('sendButton'),
            typingIndicator: document.getElementById('typingIndicator')
        }

        this.messages = [];
        this.addBotMessage("How may I help you with VSTEP today?");
    }

    display() {
        const { userInput, sendButton } = this.args;

        sendButton.addEventListener('click', () => this.onSendButton());
        userInput.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton();
            }
        });
    }

    onSendButton() {
        const { userInput } = this.args;
        const text = userInput.value.trim();
        if (text === "") {
            return;
        }

        this.addUserMessage(text);
        userInput.value = '';

        this.showTypingIndicator();
        this.getBotResponse(text);
    }

    addUserMessage(message) {
        this.addMessage('user', message);
    }

    addBotMessage(message) {
        this.addMessage('bot', message);
    }

    addMessage(sender, message) {
        const { chatMessages } = this.args;
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        
        const iconElement = document.createElement('img');
        iconElement.classList.add('message-icon');
        // iconElement.textContent = sender === 'user' ? '👤' : '🤖';
        iconElement.src = sender === 'user' ? '/static/images/user.png' : '/static/images/chatbot.png';
        iconElement.alt = sender === 'user' ? 'User' : 'Bot';
        
        const contentElement = document.createElement('div');
        contentElement.classList.add('message-content');
        contentElement.innerHTML = message;
        
        messageElement.appendChild(iconElement);
        messageElement.appendChild(contentElement);
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        const { typingIndicator } = this.args;
        typingIndicator.style.display = 'block';
    }

    hideTypingIndicator() {
        const { typingIndicator } = this.args;
        typingIndicator.style.display = 'none';
    }

    getBotResponse(message) {
        fetch('/query/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: message }),
        })
        .then(response => response.json())
        .then(data => {
            this.hideTypingIndicator();
            this.addBotMessage(data.response);
        })
        .catch((error) => {
            console.error('Error:', error);
            this.hideTypingIndicator();
            this.addBotMessage('Sorry, I encountered an error while processing your request.');
        });
    }
}

const chatbox = new Chatbox();
chatbox.display();