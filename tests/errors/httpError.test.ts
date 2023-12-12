import { HttpError } from '../../src/errors/httpError';

const message: string = 'Not found';
const code: number = 404;
const error: HttpError = new HttpError(message, code);

describe('HttpError', () => {
  it('should create an HttpError with the provided message and code', () => {
    expect(error).toBeInstanceOf(HttpError);
    expect(error.message).toBe(message);
    expect(error.code).toBe(code);
  });

  it('should have the correct name and stack', () => {
    expect(error.name).toBe('HttpError');
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('HttpError: Not found');
  });

  it('should have the correct prototype', () => {
    expect(Object.getPrototypeOf(error)).toBe(HttpError.prototype);
  });
});
