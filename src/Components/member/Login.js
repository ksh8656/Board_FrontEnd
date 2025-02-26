import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";

function Login() {
    const { setAuth } = useContext(AuthContext); // ✅ 로그인 상태 저장
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        const req = { email, password };

        try {
            const resp = await axios.post("http://localhost:8989/user/login", req);

            console.log("[Login.js] login() success :D", resp.data);

            alert(`${resp.data.email}님, 성공적으로 로그인 되었습니다 🔐`);

            // ✅ JWT 토큰 및 이메일 저장
            localStorage.setItem("bbs_access_token", resp.data.token);
            localStorage.setItem("user_email", resp.data.email);
            localStorage.setItem("user_rank", resp.data.rank);

            // ✅ axios 기본 Authorization 헤더 설정 (자동 인증 요청)
            axios.defaults.headers.common["Authorization"] = `Bearer ${resp.data.token}`;

            // ✅ auth 상태 업데이트 (객체로 저장)
            setAuth({ token: resp.data.token, email: resp.data.email, rank: resp.data.rank });

            // ✅ 로그인 후 게시판으로 이동
            navigate("/bbslist");
        } catch (err) {
            console.error("[Login.js] login() error :<", err);

            // ✅ 에러 메시지 개선
            let errorMessage = "서버 오류가 발생했습니다.";
            if (err.response) {
                if (err.response.status === 401) {
                    errorMessage = "⚠️ 이메일 또는 비밀번호가 잘못되었습니다.";
                } else {
                    errorMessage = `⚠️ 오류 발생: ${err.response.data}`;
                }
            }

            alert(errorMessage);
        }
    };

    return (
        <div>
            <table className="table">
                <tbody>
                    <tr>
                        <th className="col-3">이메일</th>
                        <td>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                size="50px"
                                placeholder="이메일 입력"
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>비밀번호</th>
                        <td>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                size="50px"
                                placeholder="비밀번호 입력"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />

            <div className="my-1 d-flex justify-content-center">
                <button className="btn btn-outline-secondary" onClick={login}>
                    <i className="fas fa-sign-in-alt"></i> 로그인
                </button>
            </div>
        </div>
    );
}

export default Login;

