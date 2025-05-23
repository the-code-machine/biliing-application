import { api } from "../../backend/preload";

declare global {
  namespace NodeJS {
    interface Global {
      api: typeof api;
    }
  }
}

global.api = api;
