import { Token } from "./models/token.ts";
import { MergedToken } from "./models/merged_token.ts";

const _generationHtmlString = (tokens: Array<Token | MergedToken>) => {
  return tokens
    .map((t) => t.content)
    .reverse()
    .join("");
};

const isAllElmParentRoot = (tokens: Array<Token | MergedToken>) => {
  return tokens.map((t) => t.parent?.elmType).every((val) => val === "root");
};

const _getInsertPosition = (content: string) => {
  let state = 0;
  const closeTagParentheses = ["<", ">"];
  let position = 0;
  console.log("content", content);
  content.split("").some((c, i) => {
    if (state === 1 && c === closeTagParentheses[state]) {
      position = i;
      return true;
    } else if (state === 0 && c === closeTagParentheses[state]) {
      state++;
    }
  });
  return ++position;
};

const _createMergedContent = (
  currentToken: Token | MergedToken,
  parentToken: Token | MergedToken
) => {
  let content = "";
  switch (parentToken.elmType) {
    case "li":
      content = `<li>${currentToken.content}</li>`;
      break;
    case "ul":
      content = `<ul>${currentToken.content}</ul>`;
      break;
    case "strong":
      content = `<strong>${currentToken.content}</strong>`;
      break;
    // deno-lint-ignore no-case-declarations
    case "merged":
      const position = _getInsertPosition(parentToken.content);
      content = `${parentToken.content.slice(0, position)}${
        currentToken.content
      }${parentToken.content.slice(position)}`;
  }
  return content;
};

const generate = (asts: Token[][]) => {
  const htmlStrings = asts.map((lineTokens) => {
    console.log("lineTokens", lineTokens);
    let rearrangedAst: Array<Token | MergedToken> = lineTokens.reverse();
    console.log("rearrangedAst", rearrangedAst);
    while (!isAllElmParentRoot(rearrangedAst)) {
      let index = 0;
      while (index < rearrangedAst.length) {
        if (rearrangedAst[index].parent?.elmType === "root") {
          index++;
        } else {
          const currentToken = rearrangedAst[index];
          rearrangedAst = rearrangedAst.filter((_, t) => t !== index);
          const parentIndex = rearrangedAst.findIndex(
            (t) => t.id === currentToken.parent.id
          );
          const parentToken = rearrangedAst[parentIndex];
          const mergedToken: MergedToken = {
            id: parentToken.id,
            elmType: "merged",
            content: _createMergedContent(currentToken, parentToken),
            parent: parentToken.parent,
          };
          rearrangedAst.splice(parentIndex, 1, mergedToken);
        }
      }
    }
    return _generationHtmlString(rearrangedAst);
  });
  return htmlStrings.join("");
};

export { generate };
