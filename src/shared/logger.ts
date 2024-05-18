import path from "path";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
const { combine, timestamp, label, printf, prettyPrint } = format;

const loggerFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  console.log(hours);
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${date.toDateString()} ${hours}:${minutes}:${seconds} } [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    label({ label: "PH" }),
    timestamp(),
    loggerFormat,
    // prettyPrint(),
  ),
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      level: "info",
      filename: path.join(
        process.cwd(),
        "logs",
        "winston",
        "successes",
        "%DATE%success.log",
      ),
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "1d",
    }),
  ],
});
const errorLogger = createLogger({
  level: "error",
  format: combine(
    label({ label: "PH" }),
    timestamp(),
    loggerFormat,
    // prettyPrint(),
  ),
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      level: "error",
      filename: path.join(
        process.cwd(),
        "logs",
        "winston",
        "errors",
        "%DATE%error.log",
      ),
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "1d",
    }),
  ],
});

export { logger, errorLogger };
