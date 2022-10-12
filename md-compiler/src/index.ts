import { parse } from "./parser.ts";

const convertToHTMLString = (markdown: string) => {
  const mdArray = markdown.split(/\r\n|\r|\n/);
  console.log(mdArray);
  const asts = mdArray.map((md) => parse(md));
  return asts;
};

console.log(convertToHTMLString("normal**bold**"));
