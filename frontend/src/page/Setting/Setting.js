import axios from 'axios';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useTitle from '../../function/useTitle';
import './Setting.css';

function Setting() {
  useTitle('Token Briefing - 설정');
  const [writerList, setWriterList] = useState(null);

  // 작성자 리스트가 비어있으면 불러오기
  if (writerList === null) {
    axios.get('/api/v1/writer/all_writer').then((response) => {
      setWriterList(response.data.map((row) => <option value={row.name}>{row.name}</option>));
    });
  }

  return (
    <div style={{ lineHeight: '150%', marginLeft: '20px', marginRight: '20px' }}>
      <p className="title">설정</p>

      {/* 새로운 작성자 등록 */}
      <p>
        <div className="setting-name"> + 새로운 작성자 등록</div>
        <span className="setting-contents">새로운 작성자를 등록합니다.</span>
        <form
          onSubmit={(event) => {
            // 저장 버튼 클릭 시 작동하는 기본 기능 제거
            event.preventDefault();

            const value = event.target.writer_name.value;
            if (value.replace(' ', '') === '') {
              return alert('작성자 이름을 다시 확인하세요.');
            }

            var data = '';
            const addData = (id, contents) => {
              // post로 보내기 위해 data에 양식에 맞게 저장한다.
              data += `${id}=${contents}&`;
            };

            addData('name', value);

            axios.post('/api/v1/writer/add', data).then((response) => {
              const process = response.data.process;
              console.log(`add writer process: ${process}`);

              if (process === true) {
                alert('저장되었습니다.');

                // 작성자 리스트 초기화
                setWriterList(null);
              } else {
                alert('저장에 실패하였습니다.');
              }
            });
          }}
        >
          <input name="writer_name" className="input-writer-name" placeholder="이름" autoComplete="off" />
          <input type="submit" value="저장" />
        </form>
      </p>

      {/* 기존 작성자 삭제 */}
      <p>
        <div className="setting-name"> + 기존 작성자 삭제</div>
        <span className="setting-contents">기존에 존재하는 작성자를 목록에서 제거합니다.</span>
        <form
          onSubmit={(event) => {
            // 저장 버튼 클릭 시 작동하는 기본 기능 제거
            event.preventDefault();

            const value = event.target.allwriter.value;

            if (value === '') {
              return alert('작성자를 선택하세요.');
            }

            var data = '';
            const addData = (id, contents) => {
              // post로 보내기 위해 data에 양식에 맞게 저장한다.
              data += `${id}=${contents}&`;
            };

            addData('name', value);

            axios.post('/api/v1/writer/delete', data).then((response) => {
              const process = response.data.process;
              console.log(`writer remove process: ${process}`);
              if (process === true) {
                alert('삭제되었습니다.');
                setWriterList(null);
              } else {
                return alert('삭제 중 오류가 발생했습니다.');
              }
            });
          }}
        >
          <select name="allwriter">
            <option value="">작성자 선택</option>
            {writerList}
          </select>
          <input type="submit" value="삭제" />
        </form>
      </p>
      <br />
      <br />

      <NavLink to="/about" className={'navlink-to-reset setting-contents'} style={{ color: 'blue' }}>
        더 보기 및 사용한 오픈소스
      </NavLink>
    </div>
  );
}

export default Setting;
