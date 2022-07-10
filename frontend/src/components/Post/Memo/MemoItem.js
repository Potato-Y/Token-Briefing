import axios from 'axios';
import { NavLink } from 'react-router-dom';
import './MemoItem.css';

const MemoItem = (props) => {
  if (props.mode === 'write') {
    //만약에 쓰기 모드라면 아래 디자인을 사용한다.
    return (
      <div>
        <div className="memo-post-wrap">
          <div className="memo-content-wrap">
            <form
              onSubmit={(event) => {
                // 저장 버튼 클릭 시 작동
                event.preventDefault();
                const memocontent = event.target.memocontent.value;
                const memowriter = event.target.memowriter.value;

                if (memowriter === '') {
                  // 작성자가 선택되지 않은 경우 경고 및 취소
                  return alert('작성자를 선택하세요.');
                } else if (memocontent === '') {
                  // 내용이 입력되지 않은 경우
                  return alert('내용을 입력하세요.');
                }

                var data = '';
                const addData = (id, contents) => {
                  // post로 보내기 위해 data에 양식에 맞게 저장한다.
                  data += `${id}=${contents}&`;
                };

                addData('writer', memowriter);
                addData('content', `${memocontent}`);

                axios.post('/api/v1/memo/upload', data).then((response) => {
                  const process = response.data.process;
                  console.log(`memo upload process: ${process}`);
                  if (process === true) {
                    alert('저장되었습니다.');
                    // 폼 초기화
                    event.target.memocontent.value = '';
                    event.target.memowriter.value = '';

                    // 메모 리스트 초기화
                    props.saveOnClick();
                  } else {
                    return alert('저장에 실패하였습니다.');
                  }
                });
              }}
            >
              <div className="memo-title">
                새로운 메모 작성하기
                {/* 작성자 추가 */}
                <select name="memowriter" style={{ float: 'right' }}>
                  <option value="">작성자</option>
                  <option value="테스트">테스트</option>
                </select>
              </div>

              <textarea name="memocontent" className="new-memo-textarea" placeholder="여기에 내용을 입력하세요"></textarea>
              <p>
                <input className="memo-save-button" type="submit" value="저장"></input>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  } else {
    //만약에 읽기 모드라면 아래 디자인을 사용한다.
    return (
      <div>
        <div className="memo-post-wrap">
          <div className="memo-content-wrap">
            <div className="memo-title">작성자: {props.writer}</div>

            <div className="memo-contents">
              <span style={{ fontSize: '12px' }}>{props.date}</span>
              <br />
              {props.content}
            </div>
            <NavLink to={`/post/${props.id}`} className="navlink-to-reset" style={{ float: 'right', marginTop: '10px', fontSize: '12px' }}>
              [자세히]
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
};

export default MemoItem;
