class HttpException extends Error {
  constructor(status = 500, message) {
    super(message);
    this.status = status;
  }
}

export default HttpException