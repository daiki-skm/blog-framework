import { parse } from "./parser.ts";
import { generate } from "./generator.ts";

const convertToHTMLString = (markdown: string) => {
  const mdArray = markdown.split(/\r\n|\r|\n/);
  console.log(mdArray);
  const asts = mdArray.map((md) => parse(md));
  console.log(asts);
  const htmlString = generate(asts);
  return htmlString;
};

// console.log(convertToHTMLString("normal**bold**"));
console.log(convertToHTMLString("* list1"));
// console.log(convertToHTMLString("* list1\n* list2"));
