import { CustomError } from "../interfaces/CustomError";

export class HttpError extends Error {
    status?: number;
    errors: CustomError[];
    constructor(message: CustomError[], status: number = 400) {
      super("HTTP Error");
      this.status = status;
      this.errors = message;
    }
}