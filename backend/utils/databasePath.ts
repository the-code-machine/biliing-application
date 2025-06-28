import Logger from "electron-log";
import { app } from "electron";
import { join } from "path";
import { existsSync } from "fs";

const isDev =
  process.env.NODE_ENV === "development" ||
  !app.isPackaged || // Useful fallback for Electron dev mode
  existsSync(join(__dirname, "..", "..", "node_modules")); // Another dev check fallback

// Path logic
const databasePath = isDev
  ? join(__dirname, "..", "..", "database.sqlite") // inside project root in dev mode
  : join(app.getPath("userData"), "database.sqlite"); // production path

Logger.info("DATABASE: ", databasePath);

export default databasePath;
