import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// ============================================
// OPEN-WA (WA-AUTOMATE) PROXY ENDPOINTS
// Permite conectar a um servidor open-wa / wa-automate local ou remoto
// ============================================
app.post('/api/openwa/test', async (req, res) => {
  const { serverUrl, apiKey, sessionId } = req.body;
  if (!serverUrl) {
    return res.status(400).json({ success: false, error: 'URL do servidor open-wa não informada.' });
  }

  const cleanUrl = serverUrl.replace(/\/+$/, '');
  const targetUrl = `${cleanUrl}/checkHost`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const headers = {};
    if (apiKey) headers['api_key'] = apiKey;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    res.json({
      success: response.ok,
      status: response.status,
      data: data || 'Host ativo'
    });
  } catch (err) {
    clearTimeout(timeoutId);
    res.status(502).json({
      success: false,
      error: `Não foi possível conectar ao servidor Open-WA em ${serverUrl}: ${err.message}`
    });
  }
});

app.post('/api/openwa/send-text', async (req, res) => {
  const { serverUrl, apiKey, to, content, pass_filter } = req.body;
  if (!serverUrl || !to || !content) {
    return res.status(400).json({ success: false, error: 'Parâmetros serverUrl, to e content são obrigatórios.' });
  }

  const cleanUrl = serverUrl.replace(/\/+$/, '');
  const targetUrl = `${cleanUrl}/sendText`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    // Formatar destinatário para WhatsApp ID (ex.: 5511999999999@c.us)
    let chatId = String(to).replace(/\D/g, '');
    if (!chatId.includes('@c.us') && !chatId.includes('@g.us')) {
      chatId = `${chatId}@c.us`;
    }

    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['api_key'] = apiKey;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        args: {
          to: chatId,
          content: content,
          pass_filter: pass_filter ?? true
        }
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: typeof data === 'string' ? data : JSON.stringify(data)
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (err) {
    clearTimeout(timeoutId);
    res.status(502).json({
      success: false,
      error: `Erro ao enviar via Open-WA: ${err.message}`
    });
  }
});

app.post('/api/openwa/send-image', async (req, res) => {
  const { serverUrl, apiKey, to, file, filename, caption } = req.body;
  if (!serverUrl || !to || !file) {
    return res.status(400).json({ success: false, error: 'Parâmetros serverUrl, to e file (base64) são obrigatórios.' });
  }

  const cleanUrl = serverUrl.replace(/\/+$/, '');
  const targetUrl = `${cleanUrl}/sendImage`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    let chatId = String(to).replace(/\D/g, '');
    if (!chatId.includes('@c.us') && !chatId.includes('@g.us')) {
      chatId = `${chatId}@c.us`;
    }

    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['api_key'] = apiKey;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        args: {
          to: chatId,
          file: file,
          filename: filename || 'imagem.jpg',
          caption: caption || ''
        }
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: typeof data === 'string' ? data : JSON.stringify(data)
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (err) {
    clearTimeout(timeoutId);
    res.status(502).json({
      success: false,
      error: `Erro ao enviar imagem via Open-WA: ${err.message}`
    });
  }
});

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Feitosa CRM' });
});

// Serve static assets from project root
app.use(express.static(__dirname, {
  extensions: ['html', 'htm']
}));

// Route handler for clean URLs and fallback
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  const htmlPath = filePath + '.html';
  if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
    return res.sendFile(htmlPath);
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Feitosa CRM running at http://0.0.0.0:${PORT}`);
});
