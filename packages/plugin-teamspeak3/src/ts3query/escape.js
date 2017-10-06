export default value => value.toString()
  .replace(/\\/g, '\\\\')
  .replace(/\//g, '\\/')
  .replace(/\|/g, '\\p')
  .replace(/\n/g, '\\n')
  .replace(/\r/g, '\\r')
  .replace(/\t/g, '\\t')
  .replace(/ /g, '\\s');
