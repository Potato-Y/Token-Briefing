import axios from 'axios';
import './TokenWritePanel.css';

const TokenWritePanel = () => {
  return (
    <div>
      <div className="token-write-panel-wrap">
        <div className="token-write-panel-content-wrap">
          새로운 마감 번호 입력하기
          <form
            onSubmit={(event) => {
              // 저장 클릭 시 실행
              event.preventDefault();
              // api에 보낼 데이터 생성
              var data = '';
              const addData = (id, contents) => {
                // post로 보내기 위해 data에 양식에 맞게 저장한다.
                data += `${id}=${contents}&`;
              };

              const tokenwriter = event.target.tokenwriter.value;

              if (tokenwriter === '') {
                // 작성자가 없을 경우 경고 및 취소
                return alert('작성자를 선택하세요.');
              }
              addData('writer', tokenwriter);

              const token1000 = event.target.token1000.value;
              const token2000 = event.target.token2000.value;
              const token3000 = event.target.token3000.value;
              const token4000 = event.target.token4000.value;
              const token5000 = event.target.token5000.value;
              const tokenmemo = event.target.tokenmemo.value;

              if (token1000 === '' && token2000 === '' && token3000 === '' && token4000 === '' && token5000 === '') {
                // 번호표 값이 하나라도 입력되지 않은 경우
                return alert('최소 한개 이상의 번호표 값을 입력해주세요.');
              }

              // 4자리의 숫자가 맞는지 확인 후, 맞으면 데이터에 추가
              if (token1000 !== '') {
                if (token1000.length === 4) {
                  addData('token1000', token1000);
                } else {
                  return alert('1000번대 번호표의 값이 4자리가 아닙니다.');
                }
              }
              if (token2000 !== '') {
                if (token2000.length === 4) {
                  addData('token2000', token2000);
                } else {
                  return alert('2000번대 번호표의 값이 4자리가 아닙니다.');
                }
              }
              if (token3000 !== '') {
                if (token3000.length === 4) {
                  addData('token3000', token3000);
                } else {
                  return alert('3000번대 번호표의 값이 4자리가 아닙니다.');
                }
              }
              if (token4000 !== '') {
                if (token4000.length === 4) {
                  addData('token4000', token4000);
                } else {
                  return alert('4000번대 번호표의 값이 4자리가 아닙니다.');
                }
              }
              if (token5000 !== '') {
                if (token5000.length === 4) {
                  addData('token5000', token5000);
                } else {
                  return alert('5000번대 번호표의 값이 4자리가 아닙니다.');
                }
              }
              if (tokenmemo !== '') {
                addData('tokenmemo', tokenmemo);
              }

              axios.post('/api/v1/tokenbriefing/upload', data).then((response) => {
                const process = response.data.process;
                console.log(`token briefing process ${process}`);
                if (process === true) {
                  alert('저장되었습니다.');

                  // 폼 초기화
                  event.target.tokenwriter.value = '';
                  event.target.token1000.value = '';
                  event.target.token2000.value = '';
                  event.target.token3000.value = '';
                  event.target.token4000.value = '';
                  event.target.token5000.value = '';
                  event.target.tokenmemo.value = '';
                } else {
                  return alert('저장에 실패하였습니다.');
                }
              });
            }}
          >
            <select name="tokenwriter" style={{ marginTop: '10px' }}>
              <option value="">작성자</option>
              <option value="테스트">테스트</option>
            </select>
            <br />
            <br />
            1000:{' '}
            <input
              name="token1000"
              className="input-box"
              type="text"
              maxLength="4"
              autoComplete="off"
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                if (e.target.value >= 2000) {
                  alert('2000을 넘을 수 없습니다.');
                  e.target.value = 1999;
                }
              }}
            ></input>
            <textarea name="tokenmemo" id="input-memo" className="input-box" placeholder="여기에 메모를 입력하세요"></textarea>
            <br />
            2000:{' '}
            <input
              name="token2000"
              className="input-box"
              type="text"
              maxLength="4"
              autoComplete="off"
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                if (e.target.value < 2000 && e.target.value.length === 4) {
                  alert('2000보다 낮을 수 없습니다.');
                  return (e.target.value = 2000);
                } else if (e.target.value >= 3000) {
                  alert('3000을 넘을 수 없습니다.');
                  return (e.target.value = 2999);
                }
              }}
            ></input>
            <br />
            3000:{' '}
            <input
              name="token3000"
              className="input-box"
              type="text"
              maxLength="4"
              autoComplete="off"
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                if (e.target.value < 3000 && e.target.value.length === 4) {
                  alert('3000보다 낮을 수 없습니다.');
                  return (e.target.value = 3000);
                } else if (e.target.value >= 4000) {
                  alert('4000을 넘을 수 없습니다.');
                  return (e.target.value = 3999);
                }
              }}
            ></input>
            <br />
            4000:{' '}
            <input
              name="token4000"
              className="input-box"
              type="text"
              maxLength="4"
              autoComplete="off"
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                if (e.target.value < 4000 && e.target.value.length === 4) {
                  alert('4000보다 낮을 수 없습니다.');
                  return (e.target.value = 4000);
                } else if (e.target.value >= 5000) {
                  alert('5000을 넘을 수 없습니다.');
                  return (e.target.value = 4999);
                }
              }}
            ></input>
            {/* 업로드 버튼 */}
            <input className="button-upload" type="submit" value="저장"></input>
            <br />
            5000:{' '}
            <input
              name="token5000"
              className="input-box"
              type="text"
              maxLength="4"
              autoComplete="off"
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                if (e.target.value < 5000 && e.target.value.length === 4) {
                  alert('5000보다 낮을 수 없습니다.');
                  return (e.target.value = 5000);
                } else if (e.target.value >= 6000) {
                  alert('6000을 넘을 수 없습니다.');
                  return (e.target.value = 5999);
                }
              }}
            ></input>
            <br />
          </form>
        </div>
      </div>
    </div>
  );
};

export default TokenWritePanel;
