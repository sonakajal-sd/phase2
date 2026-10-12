import app from "./app";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, (error) => {
  if (error) {
    console.error(`Failed to start server on port ${PORT}:`, error.message);
    process.exit(1);
  }
  console.log(`Server running on http://localhost:${PORT}`);
});