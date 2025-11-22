const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware crítico - SERVIR ARQUIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, 'public')));

// Debug da estrutura
console.log('🔍 VERIFICANDO ESTRUTURA:');
console.log('📁 Diretório atual:', __dirname);
console.log('📂 Conteúdo:', fs.readdirSync(__dirname));
console.log('📁 Pasta public existe?', fs.existsSync(path.join(__dirname, 'public')));
console.log('📄 index.html existe?', fs.existsSync(path.join(__dirname, 'public', 'index.html')));

// Rota principal - COM FALLBACK
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    
    if (fs.existsSync(indexPath)) {
        console.log('✅ index.html ENCONTRADO - Enviando...');
        res.sendFile(indexPath);
    } else {
        console.log('❌ index.html NÃO ENCONTRADO');
        // Fallback HTML
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Vexus - Em Desenvolvimento</title>
                <style>
                    body { font-family: Arial; padding: 40px; text-align: center; background: #f0f2f5; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    h1 { color: #2563eb; }
                    .status { background: #dcfce7; color: #166534; padding: 15px; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>⚡ Vexus</h1>
                    <p>Seu assistente pessoal inteligente</p>
                    <div class="status">
                        <strong>🚧 Sistema em Desenvolvimento</strong>
                        <p>Backend funcionando - Frontend em ajustes</p>
                    </div>
                    <p><strong>Victorino Sérgio</strong> - Moçambique 🇲🇿</p>
                </div>
            </body>
            </html>
        `);
    }
});

// Health Check - MOSTRA INFORMAÇÕES REAIS
app.get('/health', (req, res) => {
    const publicPath = path.join(__dirname, 'public');
    const indexPath = path.join(publicPath, 'index.html');
    
    res.json({
        status: 'RUNNING',
        message: 'Vexus Server está operacional',
        author: 'Victorino Sérgio',
        timestamp: new Date().toISOString(),
        fileSystem: {
            currentDirectory: __dirname,
            directoryContents: fs.readdirSync(__dirname),
            publicFolder: fs.existsSync(publicPath),
            indexHtml: fs.existsSync(indexPath),
            publicContents: fs.existsSync(publicPath) ? fs.readdirSync(publicPath) : 'NOT_FOUND'
        }
    });
});

// API do Assistente (mantém igual)
app.post('/api/assistant', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Mensagem é obrigatória' });
        }

        if (!process.env.DEEPSEEK_API_KEY) {
            return res.json({
                success: false,
                response: "**⚡ Vexus:** Configuração em andamento. Em breve estarei 100% operacional!"
            });
        }

        const response = await axios.post('https://api.deepseek.com/chat/completions', {
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: 'Você é o Vexus, um assistente pessoal inteligente e útil. Seja prático e direto.'
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
            response: aiResponse + "\n\n---\n*Vexus 🤖*"
        });

    } catch (error) {
        console.error('Erro API:', error.message);
        res.json({
            success: false,
            response: "**⚡ Vexus:** Estou com limitações temporárias. Tente novamente em alguns instantes!"
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Vexus Server rodando na porta ${PORT}`);
    console.log(`📍 Acesse: http://localhost:${PORT}`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
});