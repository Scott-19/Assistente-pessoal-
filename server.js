const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota da API DeepSeek
app.post('/api/assistant', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Mensagem é obrigatória' });
        }

        // Verificar API Key
        if (!process.env.DEEPSEEK_API_KEY) {
            return res.json({
                success: false,
                response: "🤖 **Assistente Victorino:** No momento estou aprendendo ainda. Em breve terei acesso à IA avançada! Como posso te ajudar com tarefas básicas?"
            });
        }

        const response = await axios.post('https://api.deepseek.com/chat/completions', {
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: 'Você é o Assistente Pessoal Victorino, um assistente inteligente e útil criado por Victorino Sérgio. Seja amigável, prático e responda em português.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 500,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        const aiResponse = response.data.choices[0].message.content;
        
        res.json({ 
            success: true,
            response: aiResponse + "\n\n---\n*Assistente Victorino 🤖*"
        });

    } catch (error) {
        console.error('Erro DeepSeek:', error.message);
        
        // Fallback inteligente
        const fallbackResponse = gerarRespostaFallback(req.body.message);
        
        res.json({
            success: false,
            response: fallbackResponse + "\n\n---\n*Assistente Victorino 🤖*"
        });
    }
});

// Respostas fallback inteligentes
function gerarRespostaFallback(mensagem) {
    const msg = mensagem.toLowerCase();
    
    if (msg.includes('oi') || msg.includes('olá') || msg.includes('ola')) {
        return "**Olá! Eu sou o Assistente Pessoal Victorino!** 🚀\n\nPosso te ajudar com:\n• 📝 Tarefas e organização\n• 💡 Ideias e criatividade\n• 📚 Aprendizado\n• 🎯 Metas e produtividade\n\nEm que posso ser útil?";
    }
    
    if (msg.includes('tarefa') || msg.includes('fazer')) {
        return "**🎯 Gerenciamento de Tarefas:**\n\n1. **Priorize** - Faça primeiro o que é importante\n2. **Divida** - Grandes tarefas em partes menores\n3. **Tempo** - Use a técnica Pomodoro (25min foco + 5min pausa)\n4. **Revise** - No final do dia, veja o progresso";
    }
    
    if (msg.includes('estudar') || msg.includes('aprender')) {
        return "**📚 Dicas de Estudo:**\n\n• **Revisão espaçada** - Revise conteúdo periodicamente\n• **Prática ativa** - Faça exercícios, não só leia\n• **Ensine** - Explique o conteúdo para alguém\n• **Ambiente** - Estude em lugar silencioso e organizado";
    }
    
    if (msg.includes('tempo') || msg.includes('produtividade')) {
        return "**⏰ Gestão do Tempo:**\n\n🕘 **Manhã** (6h-12h) - Tarefas difíceis\n🕑 **Tarde** (12h-18h) - Reuniões/tarefas médias\n🌙 **Noite** (18h-22h) - Planejamento/relaxamento\n\n**Dica:** Planeje seu dia na noite anterior!";
    }
    
    return "**🤖 Assistente Victorino:**\n\nRecebi sua mensagem! No momento estou em desenvolvimento, mas posso te ajudar com:\n\n• Dicas de produtividade\n• Organização de tarefas\n• Ideias criativas\n• Planejamento de metas\n\nO que você gostaria de fazer hoje?";
}

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Assistente Pessoal Victorino está rodando!',
        author: 'Victorino Sérgio',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Assistente Pessoal Victorino rodando na porta ${PORT}`);
});
