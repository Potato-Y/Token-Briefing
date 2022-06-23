import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './page/Home/Home';
import Post from './page/Post/Post';
import Setting from './page/Setting/Setting';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route index element={<Home />} />
        <Route path="/settings" element={<Setting />} />
        {/* 여기는 상세 게시글 */}
        <Route path="/post" element={<Post />}>
          <Route path=":id" element={<Post />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
