import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  let location = useLocation();
  const navigate = useNavigate();
  return (
    <div>
      <div id="head-box">
        <span
          id="navlink-home"
          className="navlink-to-rest"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            if (location.pathname === '/') {
              window.location.reload();
            } else {
              navigate('/');
            }
          }}
        >
          Token Briefing
        </span>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <NavLink to="/settings" className={'navlink-to-reset'} style={{ fontFamily: 'NanumGothic' }}>
          설정
        </NavLink>
        &nbsp;&nbsp;|&nbsp;&nbsp;{' '}
        <a href="/api/v1/client/download/win/setup" className={'navlink-to-reset'} style={{ fontFamily: 'NanumGothic' }}>
          다운로드
        </a>
      </div>
      <Outlet />
    </div>
  );
};

export default Header;
