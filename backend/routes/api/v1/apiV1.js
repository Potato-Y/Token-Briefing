const express = require('express');
const DBController = require('../../../db/dbController/dbController');
const Memo = require('../../../db/dbModel/memo');
const router = express.Router();

const dbController = new DBController();
dbController.connectDB();

router.use((req, res, next) => {
  next();
});

router.get('/', (req, res) => {
  res.send('error');
});

router.post('/memo/upload', (req, res) => {
  // 컴퓨터의 표준 시간 상관 없이 항상 한국 시간이 나타나도록 하기
  const localDate = new Date(); // locale 시간
  // UTC 시간 계산
  const utc = localDate.getTime() + localDate.getTimezoneOffset() * 60 * 1000;
  // UTC -> KST (UTC + 9 시간)
  const KR_TIME_EIFF = 9 * 60 * 60 * 1000;
  const krDate = new Date(utc + KR_TIME_EIFF);
  var nowTimeYear = krDate.getFullYear();
  var nowTimeMonth = ('00' + (krDate.getMonth() + 1)).slice(-2);
  var nowTimeDate = krDate.getDate();
  var nowTimeHur = ('00' + krDate.getHours()).slice(-2);
  var nowTimeMin = ('00' + krDate.getMinutes()).slice(-2);
  var nowTimeSec = ('00' + krDate.getSeconds()).slice(-2);

  // 현재 시간 (처리 시간)
  const date = `${nowTimeYear}-${nowTimeMonth}-${nowTimeDate} ${nowTimeHur}:${nowTimeMin}:${nowTimeSec}`;

  try {
    if (req.body.writer != undefined && req.body.content != undefined) {
      var memo = new Memo(req.body.writer, date, req.body.content);
      dbController.addMemo(memo, res);
    }
  } catch (err) {
    console.log('err:' + err);
  }
});

module.exports = router;
