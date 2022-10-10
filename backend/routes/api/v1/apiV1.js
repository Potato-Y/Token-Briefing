class TempMemoDbData {
  constructor() {
    /** 마지막 업데이트 시간 */
    this.lastUpdate;
    /** 메모 DB 데이터 */
    this.memoDbData;
  }

  /**
   * 메모 데이터 설정
   * @param data DB Data
   */
  setData(data) {
    this.memoDbData = data;
    this.lastUpdate = getDate();
  }

  get data() {
    return { lastUpdate: this.lastUpdate, memoDbData: this.memoDbData };
  }
}

class TemptokenbriefingDbData {
  constructor() {
    /** 마지막 업데이트 시간 */
    this.lastUpdate;
    /** tokenbriefing DB 데이터 */
    this.tokenbriefingDbData;
  }

  setData(data) {
    this.tokenbriefingDbData = data;
    this.lastUpdate = getDate();
  }

  get data() {
    return { lastUpdate: this.lastUpdate, tokenbriefingDbData: this.tokenbriefingDbData };
  }
}

const express = require('express');
const DBController = require('../../../db/dbController/dbController');
const Memo = require('../../../db/dbModel/memo');
const TokenBriefing = require('../../../db/dbModel/tokenBriefing');
const router = express.Router();

/** 자주 조회되는 내용은 저장소 과부하를 줄이기 위해 temp를 전송 */
const tempMemoDbData = new TempMemoDbData();
const temptokenbriefingDbData = new TemptokenbriefingDbData();

const dbController = new DBController();

dbController.connectDB(tempMemoDbData, temptokenbriefingDbData);

router.use((req, res, next) => {
  next();
});

router.get('/', (req, res) => {
  res.send('error');
});

// 클라이언트에서 서버 온라인 확인용
router.get('/status', (req, res) => {
  res.json({
    status: true,
  });
});

// 새로운 메모 업로드
router.post('/memo/upload', (req, res) => {
  try {
    const data = req.body;
    if (data.writer != undefined && req.body.content != undefined) {
      var memo = new Memo();
      memo.setMemoForApiRes(data);
      dbController.addMemoPost(memo, res, tempMemoDbData);
    }
  } catch (err) {
    console.error('err: ' + err);
    res.send({ process: false, message: null });
  }
});

// 최근 n건 조회
router.get('/memo/last/:num', (req, res) => {
  let num = req.params.num;
  dbController.getMemoPostLastNum(num, res);
});

// 날짜로 해당 날짜의 모든 메모 조회하기
router.get('/memo/by_date/:date', (req, res) => {
  let date = req.params.date;
  dbController.getThisDateMemo(dbController.manualDay, date, res);
});

// 당일 모든 메모 조회하기
router.get('/memo/today_all', (req, res) => {
  // dbController.getThisDateMemo(dbController.today, null, res);
  res.json(tempMemoDbData.data);
});

// 특정 메모 포스트 조회
router.get('/memo/get/:id', (req, res) => {
  let id = req.params.id;

  dbController.getMemoPost(id, res);
});

// 특정 메모 삭제
router.post('/memo/delete', (req, res) => {
  try {
    dbController.deleteMemoPost(req.body.key, res, tempMemoDbData);
  } catch (err) {
    console.error('err: ' + err);
    res.send({ process: false, message: null });
  }
});

// 새로운 토큰 브리핑 포스트 업로드
router.post('/tokenbriefing/upload', (req, res) => {
  try {
    const tokenbriefing = new TokenBriefing();
    tokenbriefing.setTokenBriefingForApiRes(req.body);

    dbController.addTokenBriefingPost(tokenbriefing.data, res, temptokenbriefingDbData);
  } catch (err) {
    console.error('err: ' + err);
    res.send({ process: false, message: null });
  }
});

// 최신 토큰 브리핑 포스트
router.get('/tokenbriefing/last_latest_post', (req, res) => {
  // dbController.getLastLatestTokenBriefingPost(res);
  res.json(temptokenbriefingDbData.data);
});

// 새로운 작성자 이름 등록
router.post('/writer/add', (req, res) => {
  try {
    dbController.addWriter(req.body, res);
  } catch (err) {
    console.error('err: ' + err);
    res.send({ process: false, message: null });
  }
});

// 모든 작성자 리스트
router.get('/writer/all_writer', (req, res) => {
  dbController.getAllWriter(res);
});

// 작성자 제거
router.post('/writer/delete', (req, res) => {
  try {
    dbController.deleteWriter(req.body, res);
  } catch (err) {
    console.error('err: ' + err);
    res.send({ process: false, message: null });
  }
});

router.get('/client/release_version', (req, res) => {
  res.json({ version: '0.1.0' });
});

router.get('/client/updater', (req, res) => {
  let path = require('path');
  let file = path.join(__dirname, '../../../assets/client', 'dummy1.txt');

  res.download(file);
});

router.get('/client/download', (req, res) => {
  let path = require('path');
  let file = path.join(__dirname, '../../../assets/client', 'dummy2.txt');

  res.download(file);
});

module.exports = router;

/**
 * 현재 날짜와 시간 얻기
 * @returns {String} 현재 날짜와 시간을 반환
 */
const getDate = () => {
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

  return date;
};
