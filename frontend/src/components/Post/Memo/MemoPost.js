import { useState } from 'react';
import MemoItem from './MemoItem';
import './MemoPost.css';

const MemoPost = () => {
  console.log('Load Memo Post');
  // 메모 포스트 리스트
  const [memoList, setMemoList] = useState(null);

  return (
    <div className="memo-wrap">
      <div id="memo-title">Memo</div>
      {/* 새로운 포스트 */}
      <MemoItem
        mode="write"
        saveOnClick={() => {
          // 리스트가 다시 불러와질 수 있도록 처리
          setMemoList(null);
        }}
      />
      <MemoItem mode="read" writer={'작성자'} contents={'테스트 문구'} />
    </div>
  );
};

export default MemoPost;
