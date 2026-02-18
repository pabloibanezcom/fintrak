export const logError = (...args: unknown[]): void => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...args);
  }
};
