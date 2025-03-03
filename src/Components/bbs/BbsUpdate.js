import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthProvider";

function BbsUpdate() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { boardId } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [exercise, setExercise] = useState("not");
  const [weight, setWeight] = useState("");
  const [existingFiles, setExistingFiles] = useState([]); // ✅ 기존 파일 목록
  const [newFiles, setNewFiles] = useState([]); // ✅ 새로 추가한 파일 목록

  useEffect(() => {
    if (!auth?.token) {
      alert("로그인이 필요합니다!");
      navigate("/login");
    } else {
      fetchBbsDetail();
    }
  }, [auth, navigate]);

  const fetchBbsDetail = async () => {
    try {
      const response = await axiosInstance.get(`/board/detail/${boardId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });


      setTitle(response.data.title);
      setContent(response.data.content);
      setExercise(response.data.exerciseLog?.exerciseType || "not");
      setWeight(response.data.exerciseLog?.weight || "");
      setExistingFiles(response.data.files || []);
    } catch (error) {
      alert("게시글을 불러오는 중 오류가 발생했습니다.");
      navigate(-1);
    }
  };

  // ✅ 파일 선택 핸들러
  const handleFileChange = (e) => {
    setNewFiles(Array.from(e.target.files)); // ✅ 새 파일 추가
  };

  // ✅ 게시글 수정 요청
  const updateBbs = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요.");
      return;
    }
  
    const formData = new FormData();
  
    // ✅ JSON 데이터 추가
    const boardData = {
      title,
      content,
      exerciseType: exercise.toUpperCase(),
      weight,
      writerEmail: auth.email, // ✅ 로그인된 사용자 이메일
    };
    formData.append("board", new Blob([JSON.stringify(boardData)], { type: "application/json" }));
  
    // ✅ 새 파일 추가
    if (newFiles.length > 0) {
      newFiles.forEach((file, index) => {
        formData.append("files", file);
      });
    } else {
    }
  
    try {
      await axiosInstance.put(`/board/${boardId}/update`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      alert("게시글이 수정되었습니다.");
      navigate(`/bbsdetail/${boardId}`);
    } catch (error) {
      alert("게시글 수정 중 오류가 발생했습니다.");
    }
  };
  

  return (
    <div>
      <h2>게시글 수정</h2>
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
          {/* 기존 파일 목록 */}
          <tr>
            <th className="table-primary">첨부된 파일</th>
            <td>
              {existingFiles.length > 0 ? (
                existingFiles.map((file) => (
                  <div key={file.id}>
                    <a href={file.fileUrl} download>{file.fileName}</a>
                  </div>
                ))
              ) : (
                <p>첨부된 파일 없음</p>
              )}
            </td>
          </tr>
          {/* 새 파일 업로드 */}
          <tr>
            <th className="table-primary">새로운 파일 추가</th>
            <td>
              <input type="file" className="form-control-file" multiple onChange={handleFileChange} />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="my-5 d-flex justify-content-center">
        <button className="btn btn-outline-secondary" onClick={updateBbs}>
          <i className="fas fa-edit"></i> 수정 완료
        </button>
      </div>
    </div>
  );
}

export default BbsUpdate;



