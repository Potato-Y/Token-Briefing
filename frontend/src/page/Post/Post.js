import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Post = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [memoData, setMemoData] = useState({ writer: '$Loading$', date: '$Loading$', content: null });

  if (memoData.content === null) {
    // memoData가 $Loading$일 경우 메모의 정보를 가져오지 않은 것으로 인지, 데이터를 가져오기
    axios.get('/api/v1/memo/get/' + params.id).then((response) => {
      if (response.data.key === '') {
        console.log('받은 메모가 없습니다.');
      } else {
        console.log(response.data.writer);
        let data = response.data;
        setMemoData({ writer: data.writer, date: data.date, content: data.content });
      }
    });
  }

  if (memoData.content === null) {
    return <div></div>;
  }
  return (
    <div style={{ padding: '20px' }}>
      <div className="memo-post-wrap">
        <div className="memo-content-wrap" style={{ fontFamily: 'NanumGothic' }}>
          작성자: {memoData.writer} | 생성 날짜: {memoData.date} [
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => {
              var data = '';
              const addData = (id, contents) => {
                // post로 보내기 위해 data에 양식에 맞게 저장한다.
                data += `${id}=${contents}&`;
              };

              addData('key', params.id);

              axios.post('/api/v1/memo/delete', data).then((response) => {
                const process = response.data.process;
                console.log(`memo remove process: ${process}`);
                if (process === true) {
                  alert('삭제되었습니다.');
                  navigate('/');
                } else {
                  return alert('삭제 중 오류가 발생했습니다.');
                }
              });
            }}
          >
            삭제
          </span>
          ]
          <br />
          <br />
          <br />
          {memoData.content}
        </div>
      </div>
    </div>
  );
};

export default Post;
