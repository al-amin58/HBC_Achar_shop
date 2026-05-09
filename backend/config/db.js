import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { MongoMemoryServer } from "mongodb-memory-server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localMongoDbPath = path.resolve(__dirname, "../.mongodb-data");
const DEFAULT_MONGO_URI = "mongodb://127.0.0.1:27017/hbc_acher";
let memoryMongoServer = null;
const DEFAULT_DB_NAME = "hbc_acher";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const tryAutoStartLocalMongo = async () =>
  new Promise((resolve) => {
    fs.mkdirSync(localMongoDbPath, { recursive: true });
    const child = spawn(
      "mongod",
      ["--dbpath", localMongoDbPath, "--bind_ip", "127.0.0.1", "--port", "27017"],
      { stdio: "ignore", detached: true }
    );

    child.once("error", () => resolve(false));
    child.once("spawn", async () => {
      child.unref();
      await sleep(2500);
      resolve(true);
    });
  });

const connectDB = async () => { 
    const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO_URI;
    let triedAutoStart = false;
    const isLocalhostMongoUri =
      /mongodb:\/\/(?:127\.0\.0\.1|localhost|\[::1\])(?::27017)?/i.test(mongoUri);

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      try {
        await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB connected");
        return true;
      } catch (error) {
        const isConnectionRefused =
          error?.message?.includes("ECONNREFUSED") &&
          isLocalhostMongoUri;

        if (isConnectionRefused && !triedAutoStart) {
          triedAutoStart = true;
          const started = await tryAutoStartLocalMongo();
          if (started) {
            console.log("Local MongoDB auto-start attempted. Retrying...");
            continue;
          }
        }

        if (attempt < 5) {
          console.log(`MongoDB not ready (attempt ${attempt}/5). Retrying...`);
          await sleep(2000);
          continue;
        }

        try {
          memoryMongoServer = await MongoMemoryServer.create({
            instance: {
              ip: "127.0.0.1",
              port: 27017,
              dbName: DEFAULT_DB_NAME,
            },
          });
          const memoryUri = memoryMongoServer.getUri();
          await mongoose.connect(memoryUri, {
            serverSelectionTimeoutMS: 5000,
          });
          console.log(
            "Primary MongoDB unavailable. Using in-memory MongoDB fallback."
          );
          console.log(`MongoDB URI in use: ${memoryUri}`);
          return true;
        } catch (memoryError) {
          console.error(`MongoDB connection error: ${error.message}`);
          console.error(
            `In-memory MongoDB fallback failed: ${memoryError.message}`
          );
          if (isConnectionRefused) {
            console.error(
              "Start MongoDB service (or run 'mongod --dbpath backend/.mongodb-data') and restart the server."
            );
          }
          return false;
        }
      }
    }

    return false;

};

export default connectDB;

