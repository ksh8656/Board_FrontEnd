import { useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";

function Logout() {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("bbs_access_token");
        localStorage.removeItem("user_email");

        alert("성공적으로 로그아웃 되었습니다 🔒");
        setAuth(null);
        
        navigate("/");
    }, []);

    return null;
}

export default Logout;

