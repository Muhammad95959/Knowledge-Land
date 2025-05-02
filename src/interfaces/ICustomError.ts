export default interface ICustomError extends Error {
  msg: string;
  statusCode: number;
  status: string;
  isOperational: boolean;
}
