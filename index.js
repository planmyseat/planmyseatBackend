import e from "express";

import authRoutes from "./routes/auth.route.js"
import { configDotenv } from "dotenv";
import connectToMongoDB from "./db/ConnectToMongoDB.js";

const app = e()
configDotenv()
const PORT = process.env.PORT || 3001

// middlewares to prevent non json data to cause error or server crash
app.use((req, res, next) => {
  const contentType = req.headers['content-type'];
  if (req.method === 'POST' && contentType && !contentType.includes('application/json')) {
    return res.status(400).json({ error: 'Server expects JSON data' });
  }
  next();
});

app.use(e.json({
  strict: true,
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf.toString());
    } catch {
      throw new SyntaxError('Invalid Input');
    }
  }
}));


app.use("/api/auth", authRoutes);


// fallback to prevent server crash
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Invalid JSON Error:', err.message);
        return res.status(400).json({ error: 'Invalid JSON format' });
    }
    console.error('Unexpected server error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
    connectToMongoDB()
})