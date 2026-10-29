import express from 'express';
import { createServer as createViteServer } from 'vite';
import apiApp from './api/index.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Mount Express API routes
app.use(apiApp);

async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Application server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
});
