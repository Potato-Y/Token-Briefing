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
      dbController.addMemoPost(memo, res);
    }
  } catch (err) {
    console.error('err: ' + err);
    res.send({ process: false, message: null });
  }
});

// 최근 10건 조회
router.get('/memo/last/:num', (req, res) => {
  let num = req.params.num;
  dbController.getMemoPostLastNum(num, res);
});

// 특정 메모 포스트 조회
router.get('/memo/get/:id', (req, res) => {
  let id = req.params.id;

  dbController.getMemoPost(id, res);
});

// 특정 메모 삭제
router.post('/memo/delete', (req, res) => {
  try {
    dbController.deleteMemoPost(req.body.key, res);
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

    dbController.addTokenBriefingPost(tokenbriefing.data, res);
  } catch (err) {
    console.error('err: ' + err);
    res.send({ process: false, message: null });
  }
});

// 최신 토큰 브리핑 포스트
router.get('/tokenbriefing/last_latest_post', (req, res) => {
  dbController.getLastLatestTokenBriefingPost(res);
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

module.exports = router;
