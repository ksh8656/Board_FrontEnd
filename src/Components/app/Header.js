import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { getRankColor } from "../utils/utils";

function Header() {
  const { auth } = useContext(AuthContext);

  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark sticky-top">
        <div className="container">
          <div
            className="navbar-collapse collapse justify-content-between"
            id="navbar-content"
          >
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <i className="fas fa-home"></i> Home
                </Link>
              </li>

              <li className="nav-item dropdown">
                <div
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  게시판
                </div>

                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <Link className="dropdown-item" to="/bbslist">글목록</Link>
                  <Link className="dropdown-item" to="/bbswrite">글추가</Link>
                </div>
              </li>
            </ul>

            <ul className="navbar-nav ml-auto">
              {auth?.token ? ( // ✅ 로그인한 경우만 렌더링
                <>
                  <li className="nav-item">
                    <Link 
                      className="nav-link" 
                      to="/exercise-stats" 
                      style={{ color: getRankColor(auth.rank) }} // ✅ rank 색상 적용
                    >
                      <i className="fas fa-user"></i> {auth.email} 님 반갑습니다
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/logout">
                      <i className="fas fa-sign-out-alt"></i> 로그아웃
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">로그인</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/join">회원가입</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;


