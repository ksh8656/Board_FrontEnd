import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

function Home() {
    const { auth } = useContext(AuthContext);  // ✅ 로그인 상태 확인
    const navigate = useNavigate();

    const gotoBoardList = () => {
        if (auth?.token) {  
            navigate("/bbslist");  
        } else {
            navigate("/login");  // ✅ 로그인 창으로 바로 이동
        }
    };

    return (
        <div className="container mt-5">
            <div className="jumbotron">
                <h1 className="display-4">
                    <span style={{ fontSize: "1.2em" }}>헬</span>
                    <span style={{ fontSize: "0.8em" }}>스를</span>
                    <span style={{ fontSize: "1.2em" }}>사</span>
                    <span style={{ fontSize: "0.8em" }}>랑하는 사람들의</span>
                    <span style={{ fontSize: "1.2em" }}>모</span>
                    <span style={{ fontSize: "0.8em" }}>임</span>
                </h1>

                <p className="lead">
                    그날의 운동 기록, 다른 사람들의 운동량 확인, 자유로운 글적기가 가능한 커뮤니티입니다.
                </p>
                <hr className="my-4" />
                <p>오늘 하루를 기록해봐~!</p>

                {/* ✅ 버튼 클릭 시 로그인 여부 확인 후 이동 */}
                <button onClick={gotoBoardList} className="btn btn-primary btn-lg">
                    {auth?.token ? "게시판 가기" : "로그인하기"}
                </button>
            </div>
        </div>
    );
}

export default Home;

