import escape from './escape';

export default (name, namedArgs, posArgs) => {
  // TODO: Add support for collected arguments (aka lists)

  if (!name) {
    throw new Error('Need command name');
  }

  if (name.indexOf(' ') >= 0) {
    throw new Error('Invalid command name');
  }

  const parts = [];

  // Add name
  if (name && name.length > 0) {
    parts.push(name);
  }

  // Add named arguments
  if (namedArgs) {
    parts.push(...Object.entries(namedArgs)
      .filter(([, v]) => v !== null)
      .map(([k, v]) => `${escape(k)}=${escape(v)}`));
  }

  // Add positional arguments
  if (posArgs) {
    parts.push(...Array.from(posArgs)
      .filter(v => v != null)
      .map(v => escape(v)));
  }

  return `${parts.join(' ')}\n\r`;
};
