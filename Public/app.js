// Assistente Pessoal Victorino - Chat Completo
console.log('🤖 Assistente Victorino - Iniciado!');

class AssistantVictorino {
    constructor() {
        this.chatHistory = [];
        this.isProcessing = false;
        this.initializeChat();
    }

    initializeChat() {
        console.log('💬 Inicializando chat...');
        this.showWelcomeMessage();
        this.setupEventListeners();
    }

    showWelcomeMessage() {
        const welcomeMessage = `
            <strong>Assistente Victorino:</strong>
            <span>
                <strong>Olá! Eu sou o Assistente Pessoal Victorino! 🚀</strong><br><br>
                Posso te ajudar com:<br>
                • 📝 Tarefas e organização<br>
                • 💡 Ideias e criatividade<br>
                • 📚 Aprendizado e estudos<br>
                • 🎯 Metas e produtividade<br>
                • 🏋️ Saúde e bem-estar<br><br>
                <em>Em que posso ser útil hoje?</em>
            </span>
        `;
        
        this.addMessageToChat('assistant', welcomeMessage);
    }

    setupEventListeners() {
        const userInput = document.getElementById('user-input');
        const sendButton = document.querySelector('.input-container button');

        // Enter para enviar
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isProcessing) {
                this.sendMessage();
            }
        });

        // Botão enviar
        sendButton.addEventListener('click', () => {
            if (!this.isProcessing) {
                this.sendMessage();
            }
        });

        // Focar no input automaticamente
        userInput.focus();
    }

    sendMessage() {
        const userInput = document.getElementById('user-input');
        const message = userInput.value.trim();

        if (!message) {
            return;
        }

        // Adicionar mensagem do usuário ao chat
        this.addMessageToChat('user', message);
        userInput.value = '';

        // Mostrar indicador de digitação
        this.showTypingIndicator();

        // Enviar para a API
        this.sendToAssistant(message);
    }

    async sendToAssistant(message) {
        this.isProcessing = true;

        try {
            const response = await fetch('/api/assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message
                })
            });

            const data = await response.json();

            // Remover indicador de digitação
            this.removeTypingIndicator();

            if (data.success) {
                this.addMessageToChat('assistant', data.response);
            } else {
                this.addMessageToChat('assistant', 
                    `🤖 <strong>Assistente Victorino:</strong><br>${data.response}`
                );
            }

        } catch (error) {
            console.error('Erro:', error);
            this.removeTypingIndicator();
            this.addMessageToChat('assistant', 
                '❌ <strong>Erro de conexão:</strong><br>Não foi possível conectar com o assistente. Tente novamente.'
            );
        }

        this.isProcessing = false;
    }

    addMessageToChat(sender, content) {
        const chatMessages = document.getElementById('chat-messages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `<strong>Você:</strong><span>${content}</span>`;
        } else {
            // Manter a formatação do assistente
            messageDiv.innerHTML = content;
        }

        chatMessages.appendChild(messageDiv);
        
        // Rolagem automática para a última mensagem
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Salvar no histórico
        this.chatHistory.push({
            sender: sender,
            content: content,
            timestamp: new Date().toISOString()
        });
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'message assistant-message typing-indicator';
        typingDiv.innerHTML = '<strong>Assistente Victorino:</strong> digitando...';
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

// Funções globais para ações rápidas
function acaoRapida(acao) {
    const assistant = window.assistantVictorino;
    if (assistant && !assistant.isProcessing) {
        assistant.addMessageToChat('user', acao);
        assistant.showTypingIndicator();
        assistant.sendToAssistant(acao);
    }
}

function enviarMensagem() {
    const assistant = window.assistantVictorino;
    if (assistant && !assistant.isProcessing) {
        assistant.sendMessage();
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM Carregado - Iniciando Assistente...');
    window.assistantVictorino = new AssistantVictorino();
    console.log('✅ Assistente Victorino iniciado!');
});
