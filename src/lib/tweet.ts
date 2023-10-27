export const URL_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;

export const renderText = (text: string): string => {
  const textWithoutEmptyLines = text.replace(/^\s*$/gm, " ");
  const textWithSingleLineBreaks = textWithoutEmptyLines.replace(/\n+/g, "\n");
  return textWithSingleLineBreaks;
};
