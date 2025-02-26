import axios from "axios";

// ✅ Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: "http://localhost:8989", // 🛠️ 백엔드 API 주소
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ 요청 인터셉터: JWT 자동 추가
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("bbs_access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터: 인증 에러 처리
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            localStorage.removeItem("bbs_access_token");
            localStorage.removeItem("user_email");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;


