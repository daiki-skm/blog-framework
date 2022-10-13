import {
  genStrongElement,
  genTextElement,
  matchWithStrongRegxp,
  matchWithListRegxp,
} from "./lexer.ts";
import { Token } from "./models/token.ts";

const rootToken: Token = {
  id: 0,
  elmType: "root",
  content: "",
  parent: {} as Token,
};

export const parse = (markdownRow: string) => {
  if (matchWithListRegxp(markdownRow)) {
    return _tokenizeList(markdownRow);
  }
  return _tokenizeText(markdownRow);
};

const _tokenizeText = (
  textElement: string,
  initialId: number = 0,
  initialRoot: Token = rootToken
) => {
  const elements: Token[] = [];
  let parent: Token = initialRoot;
  let id = initialId;

  const _tokenize = (originalText: string, p: Token) => {
    let processingText = originalText;
    parent = p;
    while (processingText.length !== 0) {
      const matchArray = matchWithStrongRegxp(
        processingText
      ) as RegExpMatchArray;
      console.log("matchArray", matchArray);

      if (!matchArray) {
        id += 1;
        const onlyText = genTextElement(id, processingText, parent);
        processingText = "";
        elements.push(onlyText);
      } else {
        if (Number(matchArray.index) > 0) {
          console.log("match index", matchArray.index);
          const text = processingText.substring(0, Number(matchArray.index));
          id += 1;
          const textElm = genTextElement(id, text, parent);
          elements.push(textElm);
          processingText = processingText.replace(text, "");
        }

        id += 1;
        const elm = genStrongElement(id, "", parent);

        parent = elm;
        elements.push(elm);

        processingText = processingText.replace(matchArray[0], "");

        _tokenize(matchArray[1], parent);
        parent = p;
      }
    }
  };

  _tokenize(textElement, parent);
  return elements;
};

export const _tokenizeList = (listString: string) => {
  const UL = "ul";
  const LIST = "li";

  let id = 1;
  const roorUlToken: Token = {
    id,
    elmType: UL,
    content: "",
    parent: rootToken,
  };
  let parent = roorUlToken;
  let tokens: Token[] = [roorUlToken];
  const match = matchWithListRegxp(listString) as RegExpMatchArray;
  console.log("match", match);

  id += 1;
  const listToken: Token = {
    id,
    elmType: LIST,
    content: "",
    parent,
  };
  tokens.push(listToken);
  const listText: Token[] = _tokenizeText(match[3], id, listToken);
  console.log("listText", listText);
  id += listText.length;
  tokens.push(...listText);
  return tokens;
};
