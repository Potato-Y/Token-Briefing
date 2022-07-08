class TokenBriefing {
  constructor() {
    this.writer;
    this.token1000 = null;
    this.token2000 = null;
    this.token3000 = null;
    this.token4000 = null;
    this.token5000 = null;
    this.tokenmemo = null;
    this.date;
  }

  setTokenBriefingForApiRes(data) {
    // api를 통해 받은 데이터를 저장
    this.writer = data.writer;
    console.log(`${data.token1000}: ${isNaN(data.token1000)}`);
    if (data.token1000 != undefined && !isNaN(data.token1000)) this.token1000 = data.token1000;
    if (data.token2000 != undefined && !isNaN(data.token2000)) this.token2000 = data.token2000;
    if (data.token3000 != undefined && !isNaN(data.token3000)) this.token3000 = data.token3000;
    if (data.token4000 != undefined && !isNaN(data.token4000)) this.token4000 = data.token4000;
    if (data.token5000 != undefined && !isNaN(data.token5000)) this.token5000 = data.token5000;
    if (data.tokenmemo != undefined) this.tokenmemo = data.tokenmemo;

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
    this.date = date;
  }

  get data() {
    return {
      writer: this.writer,
      token1000: this.token1000,
      token2000: this.token2000,
      token3000: this.token3000,
      token4000: this.token4000,
      token5000: this.token5000,
      tokenmemo: this.tokenmemo,
      date: this.date,
    };
  }
}

module.exports = TokenBriefing;
