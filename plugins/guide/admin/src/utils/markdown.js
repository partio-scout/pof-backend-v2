import showdown from 'showdown';

export const markdownToHtml = (md) => {
  const converter = new showdown.Converter();
  return converter.makeHtml(md);
}