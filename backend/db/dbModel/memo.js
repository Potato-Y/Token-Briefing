class Memo {
  constructor() {
    this.writer;
    this.date;
    this.content;
  }

  setMemoForApiRes(data) {
    // 컴퓨터의 표준 시간 상관 없이 항상 한국 시간이 나타나도록 하기
    const localDate = new Date(); // locale 시간
    // UTC 시간 계산
    const utc = localDate.getTime() + localDate.getTimezoneOffset() * 60 * 1000;
    // UTC -> KST (UTC + 9 시간)
    const KR_TIME_EIFF = 9 * 60 * 60 * 1000;
    const krDate = new Date(utc + KR_TIME_EIFF);
    var nowTimeYear = krDate.getFullYear();
    var nowTimeMonth = ('00' + (krDate.getMonth() + 1)).slice(-2);
    var nowTimeDate = ('00' + krDate.getDate()).slice(-2);
    var nowTimeHur = ('00' + krDate.getHours()).slice(-2);
    var nowTimeMin = ('00' + krDate.getMinutes()).slice(-2);
    var nowTimeSec = ('00' + krDate.getSeconds()).slice(-2);

    // 현재 시간 (처리 시간)
    const date = `${nowTimeYear}-${nowTimeMonth}-${nowTimeDate} ${nowTimeHur}:${nowTimeMin}:${nowTimeSec}`;

    this.writer = data.writer;
    this.date = date;
    this.content = data.content;
  }

  get data() {
    return { writer: this.writer, date: this.date, content: this.content };
  }
}

module.exports = Memo;
