const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const APPLY_DB_VERSION = 1;
const DB_NAME = path.join(__dirname, '../../Data', 'Token-Briefing.sqlite');

class DBController {
  constructor() {
    this.db;
    this.lastLatestDBVersion = 1; // 최신 DB 버전
  }

  connectDB() {
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
                content TEXT NOT NULL,
                date TEXT NOT NULL
               )`,
              (err) => {
                if (err) {
                  return console.error(`DB ERR: 'token_briefing_post' 테이블 생성 실패. \n${err}`);
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

  addMemo(memo, res) {
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
          return res.send({ process: true });
        }
      }
    );
  }

  // 최근 10건 조회
  getMemoPostLast10(res) {
    this.db.all(`SELECT * FROM 'memo_post' ORDER BY ROWID DESC LIMIT 10`, [], (err, rows) => {
      if (err) {
        console.error(`DB ERR: 'memo_post' 불러오기 오류\n${err}`);
      } else {
        return res.send(rows);
      }
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
