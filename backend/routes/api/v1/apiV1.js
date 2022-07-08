const express = require('express');
const DBController = require('../../../db/dbController/dbController');
const Memo = require('../../../db/dbModel/memo');
const TokenBriefing = require('../../../db/dbModel/tokenbriefing');
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

module.exports = router;
