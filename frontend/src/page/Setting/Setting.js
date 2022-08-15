import axios from 'axios';
import { useState } from 'react';
import useTitle from '../../function/useTitle';
import './Setting.css';

function Setting() {
  useTitle('Token Briefing - 설정');
  const [writerList, setWriterList] = useState(null);
  const usedOpenSource = [
    {
      name: 'axios',
      license: 'MIT',
      link: 'https://github.com/axios/axios/blob/v1.x/LICENSE',
    },
    {
      name: 'react',
      license: 'MIT',
      link: 'https://github.com/facebook/react/blob/main/LICENSE',
    },
    {
      name: 'react-dom',
      license: 'MIT',
      link: 'https://github.com/facebook/react/blob/main/LICENSE',
    },
    {
      name: 'react-router',
      license: 'MIT',
      link: 'https://github.com/remix-run/react-router/blob/main/LICENSE.md',
    },
    {
      name: 'react-scripts',
      license: 'MIT',
      link: 'https://github.com/facebook/create-react-app/blob/main/LICENSE',
    },
    {
      name: 'web-vitals',
      license: 'Apache-2.0',
      link: 'https://github.com/GoogleChrome/web-vitals/blob/main/LICENSE',
    },
    {
      name: '@testing-library/jest-dom',
      license: 'MIT',
      link: 'https://github.com/testing-library/jest-dom/blob/main/LICENSE',
    },
    {
      name: '@testing-library/react',
      license: 'MIT',
      link: 'https://github.com/testing-library/react-testing-library/blob/main/LICENSE',
    },
    {
      name: '@testing-library/user-event',
      license: 'MIT',
      link: 'https://github.com/testing-library/user-event/blob/main/LICENSE',
    },
    {
      name: 'cookie-parser',
      license: 'MIT',
      link: 'https://github.com/expressjs/cookie-parser/blob/master/LICENSE',
    },
    {
      name: 'debug',
      license: 'MIT',
      link: 'https://github.com/debug-js/debug/blob/master/LICENSE',
    },
    {
      name: 'express',
      license: 'MIT',
      link: 'https://github.com/expressjs/express/blob/master/LICENSE',
    },
    {
      name: 'http-errors',
      license: 'MIT',
      link: 'https://github.com/jshttp/http-errors/blob/master/LICENSE',
    },
    {
      name: 'morgan',
      license: 'MIT',
      link: 'https://github.com/expressjs/morgan/blob/master/LICENSE',
    },
    {
      name: 'sqlite3',
      license: 'MIT',
      link: 'https://github.com/TryGhost/node-sqlite3',
    },
    {
      name: 'pkg',
      license: 'MIT',
      link: 'https://github.com/vercel/pkg/blob/main/LICENSE',
    },
  ].map((row) => (
    <div>
      <p className="setting-contents">
        -{row.name}
        <br />
        {row.license}
        <br />
        <a href={row.link} target="_blank" rel="noopener noreferrer">
          {row.link}
        </a>
      </p>
      <br />
    </div>
  ));

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
      <div>
        <p>사용된 오픈소스</p>
        {usedOpenSource}
      </div>

      <div>
        <p>사용된 폰트</p>
        <p className="setting-contents">
          - NanumGothic, NanumSquareRound
          <br />
          Copyright (c) 2010, NAVER Corporation (https://www.navercorp.com/) with Reserved Font Name Nanum, Naver Nanum, NanumGothic, Naver NanumGothic, NanumMyeongjo, Naver NanumMyeongjo, NanumBrush,
          Naver NanumBrush, NanumPen, Naver NanumPen, Naver NanumGothicEco, NanumGothicEco, Naver NanumMyeongjoEco, NanumMyeongjoEco, Naver NanumGothicLight, NanumGothicLight, NanumBarunGothic, Naver
          NanumBarunGothic, NanumSquareRound, NanumBarunPen, MaruBuri ​ This Font Software is licensed under the SIL Open Font License, Version 1.1. ​ This license is copied below, and is also
          available with a FAQ at: ​http://scripts.sil.org/OFL ​ SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
        </p>
      </div>
    </div>
  );
}

export default Setting;
