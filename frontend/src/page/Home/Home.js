import axios from 'axios';
import { useState } from 'react';
import MemoPost from '../../components/Post/Memo/MemoPost';
import TokenPost from '../../components/Post/Toekn/TokenPost';
import useTitle from '../../function/useTitle';
import './Home.css';

const Home = () => {
  useTitle('Token Briefing');
  const [writerList, setWriterList] = useState(null);

  // 작성자 리스트가 비어있으면 불러오기
  if (writerList === null) {
    axios.get('/api/v1/writer/all_writer').then((response) => {
      setWriterList(response.data.map((row) => <option value={row.name}>{row.name}</option>));
    });
  }

  Notification.requestPermission();

  return (
    <div id="total-container">
      <div className="memo-container">
        <MemoPost writerList={writerList} />
      </div>
      <div className="token-container">
        <TokenPost writerList={writerList} />
      </div>
    </div>
  );
};

export default Home;
