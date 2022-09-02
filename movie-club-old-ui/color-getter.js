exports.getBoxOfficeColor = (earnings) => {
  let earningNew;
  if (earnings) {
    earningNew = earnings.substring(1).replaceAll(",", "");
  }
  if (earningNew <= 50000000) {
    return "red";
  } else if (earningNew > 50000000 && earningNew <= 100000000) {
    return "blue";
  } else {
    return "green";
  }
};

// TODO: getMetaScoreColor & getImdbRatingColor will be same if we multiply imdbrating by 10
exports.getMetaScoreColor = (score) => {
  const scoreNew = parseInt(score);
  if (scoreNew === undefined) {
    return "grey";
  } else if (scoreNew <= 50) {
    return "red";
  } else if (scoreNew > 50 && scoreNew <= 75) {
    return "blue";
  } else {
    return "green";
  }
};

exports.getImdbRatingColor = (score) => {
  const scoreNew = parseFloat(score);
  if (scoreNew === undefined) {
    return "grey";
  } else if (scoreNew <= 5) {
    return "red";
  } else if (scoreNew > 5 && scoreNew <= 7.5) {
    return "blue";
  } else {
    return "green";
  }
};
