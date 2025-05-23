import { BrowserWindow } from 'electron';
import { AsynchandlerType } from '../lib/types';

export class ApiResponse {
    data;
    statusCode;
    message;
    error = false
    constructor(statusCode: number, data: unknown, message: string) {
        this.data = data;
        this.statusCode = statusCode;
        this.message = message;
    }
}

export class ApiError {
    statusCode;
    message;
    error = true;
    constructor(statusCode: number, message: string) {
        this.statusCode = statusCode;
        this.message = message;
    }
}

export const asynchandler = ({ fn }: AsynchandlerType) => {
    return async (event: Electron.IpcMainEvent, data: any, win?: BrowserWindow) => {
        try {
            return await fn(event, data, win);
        } catch (error) {
            console.log(error)
            return event.returnValue = new ApiError(500, "Internal Server Error");
        }
    };
};