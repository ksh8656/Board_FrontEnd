import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeader } from "../utils/auth";

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8989/user/profile", { headers: getAuthHeader() })
            .then(resp => setUser(resp.data))
            .catch(err => console.error("사용자 정보 조회 실패:", err));
    }, []);

    return (
        <div>
            <h2>사용자 정보</h2>
            {user ? (
                <div>
                    <p>이메일: {user.email}</p>
                    <p>이름: {user.username}</p>
                    <p>키: {user.height}cm</p>
                    <p>몸무게: {user.weight}kg</p>
                    <p>점수: {user.score}</p>
                    <p>랭크: {user.rank}</p>
                </div>
            ) : (
                <p>사용자 정보를 불러오는 중...</p>
            )}
        </div>
    );
}

export default Profile;
