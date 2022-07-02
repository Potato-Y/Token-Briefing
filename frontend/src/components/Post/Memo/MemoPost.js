import { useState } from 'react';
import MemoItem from './MemoItem';
import './MemoPost.css';

const MemoPost = () => {
  // 메모 포스트 리스트
  alert('load');
  const [memoList, setMemoList] = useState(null);

  return (
    <div className="memo-wrap">
      <div id="memo-title">Memo</div>
      {/* 새로운 포스트 */}
      <MemoItem
        mode="write"
        saveOnClick={() => {
          setMemoList(null);
        }}
      />
      <MemoItem
        mode="read"
        writer={'작성자'}
        contents={
          '안녕하세요. 아무말이나 쓰고 있습니다. 앞으로도 잘 부탁드립니다.안녕하세요. 아무말이나 쓰고 있습니다. 앞으로도 잘 부탁드립니다.안녕하세요. 아무말이나 쓰고 있습니다. 앞으로도 잘 부탁드립니다.안녕하세요. 아무말이나 쓰고 있습니다. 앞으로도 잘 부탁드립니다.'
        }
      />
    </div>
  );
};

export default MemoPost;
