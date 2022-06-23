import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const goSetting = () => {
    navigate('/settings');
  };

  return (
    <div>
      <div id="head-box">
        <NavLink to="/" id="navlink-home" className={'navlink-to-reset'}>
          Token-Briefing
        </NavLink>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <NavLink to="/settings" className={'navlink-to-reset'}>
          설정
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default Header;
