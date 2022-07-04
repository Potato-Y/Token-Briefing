class Memo {
  constructor(writer, date, content) {
    this.writer = writer;
    this.date = date;
    this.content = content;
  }

  get data() {
    return { writer: this.writer, date: this.date, content: this.content };
  }
}

module.exports = Memo;
