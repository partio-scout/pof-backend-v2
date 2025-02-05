import showdown from 'showdown';

const classMap = {
  img: 'max-w-full',
  h1: 'heading-1',
  h2: 'heading-2',
  h3: 'heading-3',
  p: 'paragraph',
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