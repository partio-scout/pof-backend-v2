import showdown from 'showdown';

const classMap = {
  img: 'max-w-full',
}

const bindings = Object.keys(classMap)
  .map(key => ({
    type: 'output',
    regex: new RegExp(`<${key}(.*)>`, 'g'),
    replace: `<${key} class="${classMap[key]}" $1>`
  }));

const converter = new showdown.Converter({
  extensions: [...bindings]
});

export const markdownToHtml = (md) => converter.makeHtml(md);