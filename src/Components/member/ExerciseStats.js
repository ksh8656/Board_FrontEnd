import React, { useState } from "react";
import ExerciseChart from "./ExerciseRankTable";  
import { useAuth } from "../context/AuthProvider";  // ✅ useAuth() import
import ExerciseRankTable from "./ExerciseRankTable";

const ExerciseStats = () => {
  const { auth } = useAuth();  // ✅ useAuth() 사용
  const [exerciseType, setExerciseType] = useState("BENCH_PRESS");

  return (
    <div>
      {/* 선택한 운동의 평균 운동량 그래프 표시 */}
      <ExerciseRankTable userEmail={auth?.email} exerciseType={exerciseType} />
    </div>
  );
};

export default ExerciseStats;



