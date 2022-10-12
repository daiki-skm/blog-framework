import { Token } from "./token.ts";

export type MergedToken = {
  id: number;
  elmType: "merged";
  content: string;
  parent: Token | MergedToken;
};
