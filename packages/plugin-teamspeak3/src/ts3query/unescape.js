export default value => value.toString()
  .replace(/\\s/g, ' ')
  .replace(/\\t/g, '\t')
  .replace(/\\r/g, '\r')
  .replace(/\\n/g, '\n')
  .replace(/\\p/g, '|')
  .replace(/\\\//g, '/')
  .replace(/\\\\/g, '\\');
