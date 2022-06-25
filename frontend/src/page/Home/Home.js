import MemoPost from '../../components/Post/Memo/MemoPost';
import TokenPost from '../../components/Post/Toekn/TokenPost';
import useTitle from '../../function/useTitle';
import './Home.css';

const Home = () => {
  useTitle('Token Briefing');

  return (
    <div id="total-container">
      <div className="memo-container">
        <MemoPost />
      </div>
      <div className="token-container">
        <TokenPost />
      </div>
    </div>
  );
};

export default Home;
