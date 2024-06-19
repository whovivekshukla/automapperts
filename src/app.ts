import "reflect-metadata";

import express from "express";
import router from "./routes/userRoute";

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/users", router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
