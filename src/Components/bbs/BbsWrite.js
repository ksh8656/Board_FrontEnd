import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthProvider";

function BbsWrite() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ 입력값 상태 관리
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [exercise, setExercise] = useState("not");
  const [weight, setWeight] = useState("");
  const [file, setFile] = useState([]); // ✅ 파일을 배열로 관리

  // ✅ 게시글 작성 요청
  const createBbs = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    console.log("✅ JWT Token:", auth.token);
    console.log("✅ User Email:", localStorage.getItem("user_email"));
    console.log("✅ 선택한 파일 목록:", file);

    // ✅ FormData 객체 생성
    const formData = new FormData();

    // ✅ 게시글 데이터를 JSON으로 변환하여 추가
    const boardData = {
      title,
      content,
      exerciseType: exercise.toUpperCase(),
      weight,
      writerEmail: localStorage.getItem("user_email"),
    };
    formData.append("board", new Blob([JSON.stringify(boardData)], { type: "application/json" }));

    // ✅ 파일 추가
    if (file.length > 0) {
      file.forEach((file, index) => {
        formData.append("files", file);
        console.log(`📂 FormData에 추가된 파일 ${index + 1}:`, file.name);
      });
    } else {
      console.log("🚨 업로드할 파일이 없습니다.");
    }

    // ✅ FormData 내용 확인
    for (let pair of formData.entries()) {
      console.log(`📑 FormData 확인: ${pair[0]} =`, pair[1]);
    }

    try {
      const response = await axiosInstance.post("/board/write", formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("[BbsWrite.js] 게시글 등록 응답:", response.data);

      if (response.data.id) {
        // ✅ 생성된 게시글의 상세 페이지로 이동
        navigate(`/bbsdetail/${response.data.id}`);
      } else {
        alert("게시글을 생성했지만 ID를 가져올 수 없습니다.");
      }
    } catch (error) {
      console.error("❌ [BbsWrite.js] 게시글 작성 실패:", error);
      alert("게시글 등록에 실패했습니다.");
    }
  };

  return (
    <div>
      <h2>게시글 작성</h2>
      <table className="table">
        <tbody>
          <tr>
            <th className="table-primary">제목</th>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="제목 입력"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <th className="table-primary">내용</th>
            <td>
              <textarea
                className="form-control"
                rows="10"
                placeholder="내용 입력"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </td>
          </tr>
          {/* 운동 선택 */}
          <tr>
            <th className="table-primary">운동 선택</th>
            <td>
              <select className="form-control" value={exercise} onChange={(e) => setExercise(e.target.value)}>
                <option value="benchpress">벤치프레스</option>
                <option value="deadlift">데드리프트</option>
                <option value="squat">스쿼트</option>
                <option value="not">없음</option>
              </select>
            </td>
          </tr>
          {/* 운동 무게 */}
          <tr>
            <th className="table-primary">운동 무게 (kg)</th>
            <td>
              <input
                type="number"
                className="form-control"
                placeholder="무게 입력 (예: 100)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </td>
          </tr>
          {/* 파일 첨부 */}
          <tr>
            <th className="table-primary">파일 첨부</th>
            <td>
              <input
                type="file"
                className="form-control-file"
                onChange={(e) => setFile(Array.from(e.target.files))} // ✅ 여러 파일 처리 가능하도록 수정
                multiple // ✅ 다중 파일 업로드 가능
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="my-5 d-flex justify-content-center">
        <button className="btn btn-outline-secondary" onClick={createBbs}>
          <i className="fas fa-pen"></i> 등록하기
        </button>
      </div>
    </div>
  );
}

export default BbsWrite;






