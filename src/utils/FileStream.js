const readline = require('readline');
const { createReadStream, createWriteStream  } = require('fs');

class FileStream {
  static readLine(path) {
    const stream = createReadStream(path);
    return readline.createInterface({
      input: stream,
    });
  }

  static writeLine(path, options = { flags: 'a' } ) {
    return createWriteStream(path, options);
  }
}

module.exports = FileStream;
