/**
 * SplitText turns every whitespace run into a plain space by default, which also eats the hard
 * spaces after one-letter words (a, i, o, u, w, z). Collapse only ordinary whitespace instead.
 */
export const keepNbsp = {
  reduceWhiteSpace: false,
  prepareText: (text: string) => text.replace(/[ \t\n\r]+/g, ' '),
};
