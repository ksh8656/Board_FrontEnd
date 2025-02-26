//rank에 따른 색상 매핑 함수 추가
export const getRankColor = (rank) => {
  const rankColors = {
    "빨": "red",
    "주": "orange",
    "노": "yellow",
    "초": "green",
    "파": "blue",
    "남": "navy",
    "보": "purple"
  };
  return rankColors[rank] || "white"; // 기본값은 흰색
};