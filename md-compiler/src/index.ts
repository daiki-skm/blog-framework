import { parse } from "./parser.ts";
import { generate } from "./generator.ts";
import { analize } from "./lexer.ts";

const convertToHTMLString = (markdown: string) => {
  const mdArray = analize(markdown);
  console.log(mdArray);
  const asts = mdArray.map((md) => parse(md));
  console.log(asts);
  const htmlString = generate(asts);
  return htmlString;
};

// console.log(convertToHTMLString("normal**bold**"));
// console.log(convertToHTMLString("* list1"));
// console.log(convertToHTMLString("* list1\n* list2"));
console.log(convertToHTMLString("* **boldlist1**\n* list2"));
