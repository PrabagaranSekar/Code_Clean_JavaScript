// [
//   {
//     "Source": "Internet Movie Database",
//     "Value": "8.0/10"
//   },
//   {
//     "Source": "Rotten Tomatoes",
//     "Value": "91%"
//   },
//   {
//     "Source": "Metacritic",
//     "Value": "69/100"
//   }
// ]

exports.calculateAverageRating = (ratings) => {
  const noOfItems = ratings.length;
  let totalratings = 0;
  for (let ratingObj of ratings) {
    const ratingVal = ratingObj.Value;
    if (ratingVal.includes("/")) {
      const numbers = ratingVal.split("/");
      if (numbers[1] === "10") {
        totalratings = totalratings + parseInt(numbers[i]) * 10;
      } else if (numbers[1] === "100") {
        totalratings = totalratings + parseInt(numbers[i]);
      }
    } else {
      totalratings = parseInt(ratingVal);
    }
  }
  const avgRating = Math.floor(totalratings / noOfItems);
  return avgRating;
};
