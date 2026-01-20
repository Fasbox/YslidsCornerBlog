// src/utils/httpError.ts

export class HttpError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(
    status: number,
    message: string,
    opts?: {
      code?: string;
      details?: unknown;
    }
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = opts?.code ?? "ERROR";
    this.details = opts?.details;
  }
}
