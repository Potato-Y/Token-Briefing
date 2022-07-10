import './TokenBriefing.css';

const TokenBriefing = (props) => {
  if (props.mode === false) {
    return (
      <div>
        <div className="token-panel-wrap">
          <div className="token-panel-content-wrap">아직 업로드 된 마감 번호가 없습니다.</div>
        </div>
      </div>
    );
  } else {
    let date = props.tokenData.date;
    let token1000 = props.tokenData.token1000 === null ? '-' : props.tokenData.token1000;
    let token2000 = props.tokenData.token2000 === null ? '-' : props.tokenData.token2000;
    let token3000 = props.tokenData.token3000 === null ? '-' : props.tokenData.token3000;
    let token4000 = props.tokenData.token4000 === null ? '-' : props.tokenData.token4000;
    let token5000 = props.tokenData.token5000 === null ? '-' : props.tokenData.token5000;
    let writer = props.tokenData.writer;
    let memo = props.tokenData.memo === 'null' ? '' : props.tokenData.memo;

    return (
      <div>
        <div className="token-panel-wrap">
          <div className="token-panel-content-wrap">
            <span style={{ fontFamily: 'NanumSquareEB' }}>{date}</span>에 업로드 된 오전 마감 번호입니다.
            <br />
            작성자: {writer}
            <br />
            <br />
            <div style={{ lineHeight: '130%' }}>
              1000: {token1000}
              <br />
              2000: {token2000}
              <br />
              3000: {token3000}
              <br />
              4000: {token4000}
              <br />
              5000: {token5000}
              <br />
              <br />
              메모
              <br />
              {memo}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default TokenBriefing;
