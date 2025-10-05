const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Función para obtener la IP real (considerando proxies)
const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null);
};

// Endpoint principal
app.get('/api/whoami', (req, res) => {
  const result = {
    ipaddress: getClientIp(req),
    language: req.headers['accept-language'],
    software: req.headers['user-agent']
  };
  
  res.json(result);
});

// Ruta raíz con instrucciones
app.get('/', (req, res) => {
  res.json({
    message: 'Request Header Parser Microservice',
    usage: 'Visit /api/whoami to see your request headers',
    example: {
      ipaddress: '192.168.1.1',
      language: 'en-US,en;q=0.9',
      software: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
