import axios from 'axios';
import { useState } from 'react';
import MemoItem from './MemoItem';
import './MemoPost.css';

const MemoPost = (props) => {
  console.log('Load Memo Post');
  // 메모 포스트 리스트
  const [memoList, setMemoList] = useState(null);
  let getMemoData = '';

  if (memoList === null) {
    // memoList가 null일 경우 메모의 정보를 가져오지 않은 것으로 인지, 데이터를 가져오기
    axios.get('/api/v1/memo/last10').then((response) => {
      if (response.data === '') {
        console.log('받은 최신 메모가 없습니다.');
      } else {
        getMemoData = response.data;
        setMemoList(response.data.map((row) => <MemoItem key={row.key} mode="read" writer={row.writer} date={row.date} content={row.content} />));
      }
    });

    // 새로 올라오는 메모 포스트를 읽어올 수 있도록 한다.
    const reloadMomoPost = () =>
      setTimeout(() => {
        axios.get('/api/v1/memo/last10').then((response) => {
          if (response.data === getMemoData) {
            return;
          } else {
            getMemoData = response.data;
            setMemoList(response.data.map((row) => <MemoItem key={row.key} mode="read" writer={row.writer} date={row.date} content={row.content} />));
          }
        });
        reloadMomoPost();
      }, 60000);

    reloadMomoPost();
  }

  return (
    <div className="memo-wrap">
      <div id="memo-title">Memo</div>
      {/* 새로운 포스트 */}
      <MemoItem
        mode="write"
        writerList={props.writerList}
        saveOnClick={() => {
          // 리스트가 다시 불러와질 수 있도록 처리
          setMemoList(null);
        }}
      />
      {memoList}
    </div>
  );
};

export default MemoPost;
