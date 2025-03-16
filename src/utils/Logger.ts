import * as fs from 'fs';
import * as path from 'path';

export class Logger {
  private static logFile = path.join(__dirname, '../../logs/app.log');
  private static ensureLogDirectory() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  private static writeToFile(message: string) {
    this.ensureLogDirectory();
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(this.logFile, logMessage);
  }

  static info(message: string, data?: any) {
    const logMessage = data ? `INFO: ${message} ${JSON.stringify(data)}` : `INFO: ${message}`;
    this.writeToFile(logMessage);
  }

  static error(message: string, error?: any) {
    const errorDetails = error instanceof Error ? `${error.message}\n${error.stack}` : JSON.stringify(error);
    const logMessage = `ERROR: ${message} ${errorDetails}`;
    console.error(`[ERROR] ${message}`, error);
    this.writeToFile(logMessage);
  }

  static request(method: string, path: string, body?: any) {
    const logMessage = body 
      ? `REQUEST: ${method} ${path} - Body: ${JSON.stringify(body)}`
      : `REQUEST: ${method} ${path}`;
    this.writeToFile(logMessage);
  }

  static response(method: string, path: string, statusCode: number, body?: any) {
    const logMessage = body 
      ? `RESPONSE: ${method} ${path} - Status: ${statusCode} - Body: ${JSON.stringify(body)}`
      : `RESPONSE: ${method} ${path} - Status: ${statusCode}`;
    this.writeToFile(logMessage);
  }
}