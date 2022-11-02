import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import About from './page/About/AboutPage';
import Home from './page/Home/Home';
import NotFound from './page/NotFound';
import Post from './page/Post/Post';
import Setting from './page/Setting/Setting';

function App() {
  return (
    <div className="wrap">
      <Header />
      <div className="item-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Setting />} />
          {/* 여기는 상세 게시글 */}
          <Route path="/post" element={<Post />}>
            <Route path=":id" element={<Post />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
