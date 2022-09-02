const { getImdbRatingColor } = require("./color-getter");

describe("color-getter", () => {
  it("should fetch correct color for imdb rating", () => {
    const color = getImdbRatingColor("8.9");
    expect(color).toEqual("green");
  });
});
