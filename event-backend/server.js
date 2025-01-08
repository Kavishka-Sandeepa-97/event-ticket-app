import express from "express"
import { userRoute } from "./routers/user.mjs";
import eventRoutes from "./routers/event.mjs";
import ticketRoutes from "./routers/ticket.mjs";

const app=express();
app.use(express.json());

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      console.error("Invalid JSON payload detected:", err.message);
      return res.status(400).json({ error: "Invalid JSON payload" });
    }
    console.error("Unhandled error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  });

app.use("/api/user",userRoute);
app.use("/api/ticket",eventRoutes);
app.use("/api/event",ticketRoutes);

app.listen(3001,()=>{console.log("connected")})