import dayjs from "dayjs";

export const URL_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;

export const renderText = (text: string): string => {
  const textWithoutEmptyLines = text.replace(/^\s*$/gm, " ");
  const textWithSingleLineBreaks = textWithoutEmptyLines.replace(/\n+/g, "\n");
  return textWithSingleLineBreaks;
};

export const tweetTime = (date: Date) => {
  const currentTime = dayjs();
  const tweetDate = dayjs(date);

  const secondsDiff = currentTime.diff(date, "second");

  switch (true) {
    case secondsDiff <= 60:
      return `${currentTime.diff(tweetDate, "second")}s`;
    case secondsDiff <= 3600:
      return `${currentTime.diff(tweetDate, "minute")}s`;
    default:
      const hoursDiff = currentTime.diff(tweetDate, "hour");
      if (hoursDiff >= 24) {
        return tweetDate.format("DD MMM");
      }
      return `${hoursDiff}h`;
  }
};
