const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { send } = require('process');

const APPLY_DB_VERSION = 1;
const DB_NAME = path.join(__dirname, '../../Data', 'Token-Briefing.sqlite');

class DBController {
  constructor() {
    this.db;
    this.lastLatestDBVersion = 1; // 최신 DB 버전
  }

  connectDB(setTempMemoDbData, setTemptokenbriefingDbData) {
    makeFoler('./Data'); // 디렉터리가 없으면 생성

    this.db = new sqlite3.Database(DB_NAME, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('데이터베이스에 연결 완료.');
    });

    this.db.serialize(() => {
      // 쿼리가 순차적으로 이루어지도록

      // DB 버전을 확인
      this.db.get(`SELECT * FROM 'client_settings' WHERE id='settings'`, (err, value) => {
        if (err) {
          // 에러 발생 시 기존 DB가 존재하지 않던 것으로 인지 후 기본값 저장
          console.log('DB 버전이 존재하지 않습니다. 기본 설정을 적용합니다.');

          this.db.serialize(() => {
            // 메모 포스트
            this.db.run(
              `CREATE TABLE 'memo_post'(
                key INTEGER PRIMARY KEY AUTOINCREMENT,
                writer TEXT NOT NULL,
                content TEXT NOT NULL,
                date TEXT NOT NULL
               )`,
              (err) => {
                if (err) {
                  return console.error(`DB ERR: 'memo_post' 테이블 생성 실패. \n${err}`);
                }
              }
            );

            // 토큰 브리핑 포스트
            this.db.run(
              `CREATE TABLE 'token_briefing_post'(
                key INTEGER PRIMARY KEY AUTOINCREMENT,
                writer TEXT NOT NULL,
                token1000 INTEGER,
                token2000 INTEGER,
                token3000 INTEGER,
                token4000 INTEGER,
                token5000 INTEGER,
                memo TEXT NOT NULL,
                date TEXT NOT NULL
               )`,
              (err) => {
                if (err) {
                  return console.error(`DB ERR: 'token_briefing_post' 테이블 생성 실패. \n${err}`);
                }
              }
            );

            // 작성자 목록
            this.db.run(
              `CREATE TABLE 'writer'(
                name TEXT PRIMARY KEY NOT NULL
              )`,
              (err) => {
                if (err) {
                  return console.error(`DB ERR: 'writer' 테이블 생성 실패.\n${err}`);
                }
              }
            );

            // 필요 쿼리 진행 후, DB 버전 정보 입력
            this.db.run(
              `CREATE TABLE 'client_settings'(
                id TEXT PRIMARY KEY,
                db_version INTEGER NOT NULL
                )`,
              (err) => {
                if (err) {
                  return console.error(`DB ERR: 'client_settings' 테이블 생성 실패. \n${err}`);
                }
              }
            );

            this.db.run(
              `INSERT INTO 'client_settings'(
                id,
                db_version
                )
                VALUES(
                'settings',
                '${APPLY_DB_VERSION}'
                )`,
              (err) => {
                if (err) {
                  return console.error(`DB ERR: 'client_settings' 데이터 추가 실패. \n${err}`);
                }
              }
            );
          });
        } else {
          // DB 버전 확인 후, 확인 시 정상 파일로 판단
          try {
            if (!isNaN(value.db_version)) {
              console.log('연결된 DB 버전: ' + value.db_version);

              // 메모와 토큰 정보를 api 측 변수에 저장합니다.
              this.getThisDateMemo(this.today, null, null, setTempMemoDbData);
              this.getLastLatestTokenBriefingPost(setTemptokenbriefingDbData);
            } else {
              console.error('버전 정보를 불러오지 못 하였습니다. DB 파일이 정상적으로 생성되어 있는지 확인하세요.\n간단 조치: Data 폴더를 지우고 프로그램을 다시 실행하세요.');
            }
          } catch (err) {
            console.error('DB를 불러오는 중 오류가 발생하였습니다. \n간단 조치: Data 폴더를 지우고 프로그램을 다시 실행하세요.\n' + err);
          }
        }
      });
    });
  }

  get getDB() {
    return this.db;
  }

  addMemoPost(memo, res, setTempMemoDbData) {
    this.db.run(
      `INSERT INTO 'memo_post'(
        writer,
        content,
        date
        )
        VALUES(
        '${memo.writer}',
        '${memo.content}',
        '${memo.date}'
      )`,
      (err) => {
        if (err) {
          console.error(`DB ERR: 'memo_post' 데이터 추가 실패. \n${err}`);
          return res.send({ process: false, message: null });
        } else {
          res.send({ process: true });
          // 메모와 토큰 정보를 api 측 변수에 저장합니다.
          this.getThisDateMemo(this.today, null, null, setTempMemoDbData);
          return true;
        }
      }
    );
  }

  /**
   * 최근 n건 조회
   * @deprecated
   */
  getMemoPostLastNum(num, res) {
    this.db.all(`SELECT * FROM 'memo_post' ORDER BY ROWID DESC LIMIT ${num}`, [], (err, rows) => {
      if (err) {
        console.error(`DB ERR: 'memo_post' 불러오기 오류\n${err}`);
      } else {
        return res.send(rows);
      }
    });
  }

  /**
   * getThisDateMemo에서 타입에 사용
   * @returns 오늘
   */
  get today() {
    return 0;
  }

  /**
   * getThisDateMemo에서 타입에 사용
   * @returns 직접 설정
   */
  get manualDay() {
    return 1;
  }

  /**
   * 특정 날짜에 대한 메모를 조회
   * @param {Integer} type today, 혹은 manualDay
   * @param {String} schDate 검색할 날짜
   * @param  res
   */
  getThisDateMemo(type, schDate, res, setTempData) {
    /** 기준 날짜 */
    let setDate;
    /** 기준 날짜 +1 */
    let setADayLater;

    if (type == this.today) {
      setDate = new Date(); // 오늘을 기준 날짜로 설정
      setADayLater = new Date();
      setADayLater.setDate(setADayLater.getDate() + 1); // 오늘보다 하루 뒤로 날짜를 설정
    } else if (type == this.manualDay) {
      let arrSchDate = schDate.split('-');
      setDate = new Date(arrSchDate[0], arrSchDate[1] - 1, arrSchDate[2]); // 설정한 날짜로 설정
      setADayLater = new Date(arrSchDate[0], arrSchDate[1], arrSchDate[2]);
      setADayLater.setDate(setADayLater.getDate() + 1); // 설정한 날짜보다 뒤로 날짜를 설정
    } else {
      return console.error('err: day search type error');
    }

    var nowTimeYear = setDate.getFullYear();
    var nowTimeMonth = ('00' + (setDate.getMonth() + 1)).slice(-2);
    var nowTimeDate = ('00' + setDate.getDate()).slice(-2);

    const strDate = `${nowTimeYear}-${nowTimeMonth}-${nowTimeDate}`;

    nowTimeYear = setADayLater.getFullYear();
    nowTimeMonth = ('00' + (setADayLater.getMonth() + 1)).slice(-2);
    nowTimeDate = ('00' + setADayLater.getDate()).slice(-2);

    const strADayLater = `${nowTimeYear}-${nowTimeMonth}-${nowTimeDate}`;

    /** 기본적인 베이스 쿼리 */
    const query = `
      SELECT * FROM (
        SELECT *
        FROM memo_post
        WHERE CAST(strftime('%s', date) AS integer ) > CAST(strftime('%s', '${strDate}') AS integer)
        )
        WHERE CAST(strftime('%s', date) AS integer ) < CAST(strftime('%s', '${strADayLater}') AS integer);
    `;

    // console.log('strDate: ' + strDate + ',' + 'strADayLater' + strADayLater);
    this.db.serialize();
    this.db.all(query, [], (err, rows) => {
      if (err) {
        console.error(`DB ERR: 'memo_post' 불러오기 오류\n${err}`);
      } else {
        if (type == this.manualDay) {
          // 만약 api로 특정 날짜에 대한 메모를 요청한 경우 res로 값을 보내준다.
          return res.send(rows);
        } else if (type == this.today) {
          // 만약 오늘 업로드한 메모에 대해 요청하는 경우 api 측 변수에 저장한다.
          setTempData.setData(rows);
        }
      }
    });
  }

  // 특정 메모 조회
  getMemoPost(key, res) {
    this.db.serialize(() => {
      this.db.get(`SELECT * FROM 'memo_post' WHERE key=${key}`, (err, data) => {
        if (err) {
          console.error(`DB ERR: 'memo_post' 불러오기 오류\n${err}`);
          return res.send({ process: false, message: '메모 정보가 없습니다.' });
        } else {
          return res.send(data);
        }
      });
    });
  }

  // 특정 메모 삭제
  deleteMemoPost(key, res) {
    this.db.serialize(() => {
      this.db.all(`DELETE FROM 'memo_post' WHERE key='${key}'`, (err, rows) => {
        if (err) {
          console.error(`DB ERR: 'memo_post' 메모 포스트 삭제 오류\n${err}`);
          return res.send({ process: false, message: '메모 삭제 실패' });
        } else {
          return res.send({ process: true });
        }
      });
    });
  }

  // 토큰 포스트 추가
  addTokenBriefingPost(tokenbriefing, res, temptokenbriefingDbData) {
    this.db.serialize();
    this.db.run(
      `INSERT INTO 'token_briefing_post'(
        writer,
        token1000,
        token2000,
        token3000,
        token4000,
        token5000,
        memo,
        date
        )VALUES(
          '${tokenbriefing.writer}',
          ${tokenbriefing.token1000},
          ${tokenbriefing.token2000},
          ${tokenbriefing.token3000},
          ${tokenbriefing.token4000},
          ${tokenbriefing.token5000},
          '${tokenbriefing.tokenmemo}',
          '${tokenbriefing.date}'
        )
      `,
      (err) => {
        if (err) {
          console.error(`DB ERR: 'token_briefing' 데이터 추가 실패. \n${err}`);
          return res.send({ process: false, message: null });
        } else {
          res.send({ process: true });
          return this.getLastLatestTokenBriefingPost(temptokenbriefingDbData);
        }
      }
    );
  }

  // 최신 토큰 브리핑 포스트 데이터 얻기
  getLastLatestTokenBriefingPost(setTempData) {
    this.db.get(`SELECT * FROM 'token_briefing_post' ORDER BY ROWID DESC LIMIT 1`, (err, data) => {
      if (err) {
        console.error(`DB ERR: 'token_briefing_post' 불러오기 오류\n${err}`);
      } else {
        return setTempData.setData(data);
      }
    });
  }

  // 작성자 추가
  addWriter(data, res) {
    this.db.serialize();
    this.db.run(
      `INSERT INTO 'writer'(
        name
       )VALUES(
        '${data.name}'
      )`,
      (err, data) => {
        if (err) {
          console.error(`DB ERR: 'writer' 데이터 추가 실패\n${err}`);

          return res.send({ process: false, message: '이미 추가된 작성자인지 확인하세요.' });
        } else {
          return res.send({ process: true });
        }
      }
    );
  }

  // 모든 작성자
  getAllWriter(res) {
    this.db.all(`SELECT * FROM 'writer'`, [], (err, rows) => {
      if (err) {
        console.error(`DB ERR: 'writer' 불러오기 오류\n${err}`);
      } else {
        return res.send(rows);
      }
    });
  }

  // 작성자 삭제
  deleteWriter(data, res) {
    this.db.serialize(() => {
      this.db.all(`DELETE FROM 'writer' WHERE name='${data.name}'`, (err, rows) => {
        if (err) {
          console.error(`DB ERR: 'writer' 작성자 삭제 오류\n${err}`);
          return res.send({ process: false, message: '사용자 삭제 실패' });
        } else {
          return res.send({ process: true });
        }
      });
    });
  }
}

const makeFoler = (dir) => {
  if (!fs.existsSync(dir)) {
    console.log('폴더를 생성합니다.\n * 생성 위치: ' + dir);
    fs.mkdirSync(dir);
  }
};

module.exports = DBController;
