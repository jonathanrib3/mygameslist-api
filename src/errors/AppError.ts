type httpError = 400 | 401 | 403 | 404 | 500 | 502;

class AppError extends Error {
  public readonly status: httpError;

  public readonly message: string;

  constructor(status: httpError, message: string) {
    super();
    this.status = status;
    this.message = message;
  }
}

export { AppError };
