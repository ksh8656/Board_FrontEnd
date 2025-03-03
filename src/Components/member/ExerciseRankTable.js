import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance"; // ✅ axiosInstance 가져오기
import { useAuth } from "../context/AuthProvider";

const ExerciseRankTable = () => {
  const { auth } = useAuth(); // 현재 로그인한 사용자 정보
  const [averageWeights, setAverageWeights] = useState([]);

  useEffect(() => {
    if (!auth?.email) return;

    // ✅ JWT 토큰이 포함된 요청 보내기
    axiosInstance.get(`/exercise/average-rank`, {
      params: { userEmail: auth.email },
    })
    .then(response => {
      setAverageWeights(response.data);
    })
    .catch(error => {
    
    });
  }, [auth?.email]);

  return (
    <div>
      <h3>{auth?.rank} 사용자들의 평균 운동량</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>운동 종목</th>
            <th>평균 무게 (kg)</th>
          </tr>
        </thead>
        <tbody>
          {averageWeights.map((data, idx) => (
            <tr key={idx}>
              <td>{data.exerciseType}</td>
              <td>{data.averageWeight.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExerciseRankTable;


