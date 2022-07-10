const express = require('express');
const DBController = require('../../../db/dbController/dbController');
const Memo = require('../../../db/dbModel/memo');
const TokenBriefing = require('../../../db/dbModel/tokenBriefing');
const router = express.Router();

const dbController = new DBController();
dbController.connectDB();

router.use((req, res, next) => {
  next();
});

router.get('/', (req, res) => {
  res.send('error');
});

// 새로운 메모 업로드
router.post('/memo/upload', (req, res) => {
  try {
    const data = req.body;
    console.log(data.writer);
    if (data.writer != undefined && req.body.content != undefined) {
      var memo = new Memo();
      memo.setMemoForApiRes(data);
      dbController.addMemoPost(memo, res);
    }
  } catch (err) {
    console.log('err:' + err);
    res.send({ process: false, message: null });
  }
});

// 최근 10건 조회
router.get('/memo/last10', (req, res) => {
  dbController.getMemoPostLast10(res);
});

// 새로운 토큰 브리핑 포스트 업로드
router.post('/tokenbriefing/upload', (req, res) => {
  try {
    const tokenbriefing = new TokenBriefing();
    tokenbriefing.setTokenBriefingForApiRes(req.body);

    dbController.addTokenBriefingPost(tokenbriefing.data, res);
  } catch (err) {
    console.log('err:' + err);
    res.send({ process: false, message: null });
  }
});

// 최신 토큰 브리핑 포스트
router.get('/tokenbriefing/last_latest_post', (req, res) => {
  dbController.getLastLatestTokenBriefingPost(res);
});

module.exports = router;
