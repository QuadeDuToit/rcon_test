require("dotenv").config();
const express = require("express");
const { Rcon } = require("@a-rcon/client");

const app = express();
app.use(express.json());

const rconConfig = {
  host: process.env.RCON_HOST,
  port: parseInt(process.env.RCON_PORT),
  password: process.env.RCON_PASSWORD,
};

async function sendRconCommand(command) {
  const rcon = new Rcon(rconConfig);

  try {
    // Connect to the RCON server
    await rcon.connect();
    console.log(`Connected to RCON server at ${rconConfig.host}:${rconConfig.port}`);

    // Send the command to the server
    const response = await rcon.send(command);
    console.log("RCON Response:", response);

    return response;
  } catch (error) {
    console.error("RCON Error:", error);
    return "RCON Error: " + error.message;
  } finally {
    // Close the RCON connection
    rcon.close();
  }
}

// API to send commands
app.post("/rcon", async (req, res) => {
  try {
    const { command } = req.body;
    if (!command) return res.status(400).json({ error: "Command is required" });

    const response = await sendRconCommand(command);
    res.json({ response });
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.error("API Error:", e);
  }
});

const PORT = 4444;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
