import { BrowserWindow } from "electron";
import { ApiError, ApiResponse } from "../utils/apihandler";

export type AsynchandlerType = {
    fn: (
      event:Electron.IpcMainEvent,data:any,
      win?:BrowserWindow
    ) =>ApiError | ApiResponse | unknown;
  };