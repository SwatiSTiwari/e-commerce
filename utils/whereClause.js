const { json } = require("express");

class WhereClause {
  constructor(base, biq) {
    this.base = base;
    this.bigQ = bigQ;
  }

  search() {
    const searchword = this.bigQ.search
      ? {
          name: {
            $regex: this.bigQ.search,
            $uptions: "i",
          },
        }
      : {};

    this.base = this.base.find({ ...searchword });
    return this;
  }
  filter() {
    const copyQ = { ...this.bigQ };

    delete copyQ["search"];
    delete copyQ["limit"];
    delete copyQ["page"];

    //cobcer bigQ into string
    let stringOfCopyQ = JSON.stringify(copyQ);

    stringOfCopyQ = stringOfCopyQ.replace(
      /\b(gte|lte|gt|lt)\b/g,
      (m) => `$${m}`
    );

    const jsonOfCopyQ = JSON.parse(stringOfCopyQ);
    this.base = this.base.find(jsonOfCopyQ);
  }

  pager(resultperPage) {
    let currentPage = 1;
    if (this.bigQ.page) {
      currentPage = this.bigQ.page;
    }

    const skipVal = resultperPage * currentPage - 1;
    this.base = this.limit(resultperPage).skip(skipVal);

    return this;
  }
}

module.exports = WhereClause;
