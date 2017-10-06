import unescape from './unescape';

export default (_str) => {
  let str = _str;

  let name;

  // Section contains no named parameters => assume this is a name
  let sections = str.split(' ');
  if (sections[0].indexOf('=') < 0) {
    [name, ...sections] = sections;
    str = str.substring(name.length + 1);
  }

  // Parse arguments
  let args = str.split('|')
    .map((s) => {
      const argsForThisSection = {};
      const posArgs = [];

      s.split(' ')
        .forEach((section) => {
          const equalsPos = section.indexOf('=');
          if (equalsPos < 0) {
            // This is a positional argument
            posArgs.push(section);
            return;
          }

          // Parse named argument
          const key = unescape(section.substring(0, equalsPos));
          const value = unescape(section.substring(equalsPos + 1));
          argsForThisSection[key] = value;
        });

      argsForThisSection._ = posArgs;

      return argsForThisSection;
    });

  if (args.length === 1) {
    [args] = args;
  }

  return {
    name,
    args,
  };
};
