import { CustomError } from "../interfaces/CustomError";

export class HttpError extends Error {
    status: number;
    errors: CustomError[];
    constructor(errors: CustomError[], status: number = 400) {
      super("HTTP Error");
      this.status = status;
      this.errors = errors;
    }
}