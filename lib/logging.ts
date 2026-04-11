import { createWriteStream } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const logFile = join(__dirname, '../system_log.log');
const logStream = createWriteStream(logFile, { flags: 'a' });


const logger = (message: string, dump?: object) => {
  const timestamp = new Date().toISOString();
  let line = `${timestamp}: ${message}`;
  if (dump) {
    line += ` ${JSON.stringify(dump)}`;
  }
  line += '\n';
  logStream.write(line);
}

export default logger;

