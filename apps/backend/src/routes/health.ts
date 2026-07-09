import express, { type Router } from 'express';

// Explicit annotation avoids TS2742 ("inferred type cannot be named")
// under pnpm's nested node_modules layout with composite project refs.
const router: Router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'e-shop-backend',
    timestamp: new Date().toISOString(),
  });
});

export default router;
