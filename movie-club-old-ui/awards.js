// TODO: right now we are summing everything including nominations
// which should be excluded
exports.getTotalNumberOFAwardsWon = (awardsSentence) => {
  let awardsReceived = 0;

  const words = awardsSentence.split(" ");
  for (let word of words) {
    const wordAsInt = parseInt(word);
    if (!isNaN(wordAsInt)) {
      awardsReceived = awardsReceived + wordAsInt;
    }
  }
  return awardsReceived;
};

exports.calculateWinPercentage = (awardsSentence) => {
  const words = awardsSentence.split(" ");
  let noOfNominations;
  let awardsGot = 0;

  for (let i = 0; i < words.length; i++) {
    if (words[i].toLowerCase().includes("nomination")) {
      noOfNominations = words[i - 1];
    }
    if (!isNaN(parseInt(words[i]))) {
      if (!words[i + 1].toLowerCase().includes("nomination")) {
        awardsGot = awardsGot + parseInt(words[i]);
      }
    }
  }
  if (noOfNominations === undefined) {
    return 0;
  } else {
    const winPercent = Math.floor(
      (awardsGot / parseInt(noOfNominations)) * 100
    );
    return winPercent;
  }
};
