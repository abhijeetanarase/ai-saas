import dotenv from "dotenv";
import app from "./app";
import http from 'http'
import { seedSystemTemplatesIfNeeded } from './utils/seedSystemTemplates';

dotenv.config();









const port = process.env.PORT || 3000;



const server = http.createServer(app);

// Seed system templates on server start
seedSystemTemplatesIfNeeded();

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
});