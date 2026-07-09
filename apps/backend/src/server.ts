import app from './app';

const port = process.env.PORT ? Number(process.env.PORT) : 3001;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`e-shop backend listening on http://localhost:${port}`);
});
