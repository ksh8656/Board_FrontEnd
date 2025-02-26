import axios from "axios";

// ✅ Axios 인스턴스 생성
const api = axios.create({
    baseURL: "http://localhost:8989", // ✅ 백엔드 서버 주소
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ 요청을 보낼 때 자동으로 JWT 토큰 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("bbs_access_token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
