const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Función para obtener IP del cliente
const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded 
    ? forwarded.split(',')[0] 
    : req.connection.remoteAddress || 
      req.socket.remoteAddress || 
      req.connection.socket.remoteAddress;
  
  // Limpiar la IP (remover ::ffff: si está presente)
  return ip ? ip.replace(/^::ffff:/, '') : 'Unknown';
};

// Endpoint principal - EXACTAMENTE como lo pide FreeCodeCamp
app.get('/api/whoami', (req, res) => {
  const response = {
    ipaddress: getClientIp(req),
    language: req.headers['accept-language'] || 'Unknown',
    software: req.headers['user-agent'] || 'Unknown'
  };
  
  res.json(response);
});

// Ruta raíz con información
app.get('/', (req, res) => {
  res.json({
    message: 'Request Header Parser Microservice',
    endpoint: 'GET /api/whoami',
    returns: {
      ipaddress: 'Your IP address',
      language: 'Your preferred language', 
      software: 'Your software/browser info'
    },
    example: 'https://your-app.onrender.com/api/whoami'
  });
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    available_routes: {
      'GET /': 'Project information',
      'GET /api/whoami': 'Get request header information'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Request Header Parser Microservice running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}/api/whoami`);
});
