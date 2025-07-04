const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(4000, () => {
  console.log('🚀 Servidor de teste rodando na porta 4000');
});
