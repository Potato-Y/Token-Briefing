import axios from 'axios';
import { useState } from 'react';
import TokenBriefing from './TokenBriefing';
import './TokenPost.css';
import TokenWritePanel from './TokenWritePanel';

const TokenPost = (props) => {
  console.log('Load Token Post');
  // 토큰 포스트 최신 데이터
  const [tokenBriefing, setTokenBriefing] = useState(null);

  const setTokenBriefingWidget = (response) => {
    let data = response.data.tokenbriefingDbData;

    if (data.date === undefined) {
      console.log('토큰 브리핑의 최신 데이터를 찾을 수 없음');
      setTokenBriefing(<TokenBriefing mode={false} />);
    } else {
      // 컴퓨터의 표준 시간 상관 없이 항상 한국 시간이 나타나도록 하기
      const localDate = new Date(); // locale 시간
      // UTC 시간 계산
      const utc = localDate.getTime() + localDate.getTimezoneOffset() * 60 * 1000;
      // UTC -> KST (UTC + 9 시간)
      const KR_TIME_EIFF = 9 * 60 * 60 * 1000;
      const krDate = new Date(utc + KR_TIME_EIFF);
      var nowTimeYear = krDate.getFullYear();
      var nowTimeMonth = ('00' + (krDate.getMonth() + 1)).slice(-2);
      var nowTimeDate = ('00' + krDate.getDate()).slice(-2);

      // 현재 시간 (처리 시간)
      const date = `${nowTimeYear}-${nowTimeMonth}-${nowTimeDate}`;

      if (data.date.split(' ')[0] === date) {
        // 만약 오늘 업로드 된 글이 맞다면 모드를 true
        setTokenBriefing(<TokenBriefing mode={true} tokenData={data} />);
      } else {
        // 오늘 작성한 글이 아니라면 false
        setTokenBriefing(<TokenBriefing mode={false} />);
      }
    }
  };

  if (tokenBriefing === null) {
    // tokenData에 데이터가 없을 경우
    axios.get('/api/v1/tokenbriefing/last_latest_post').then((response) => {
      setTokenBriefingWidget(response);
    });
  }

  return (
    <div className="token-wrap">
      <div id="memo-title">Token</div>
      {tokenBriefing}

      <TokenWritePanel
        saveOnClick={() => {
          // 저장 후 토큰 데이터 다시 불러오기
          setTokenBriefing(null);
        }}
        writerList={props.writerList}
      />
    </div>
  );
};

export default TokenPost;
