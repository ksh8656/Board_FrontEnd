import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CommentWrite from "../comment/CommentWrite";
import CommentList from "../comment/CommentList";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";
import "../../css/bbsdetail.css"; // 추가: 스타일 파일 import\


function BbsDetail() {
  const { headers, setHeaders } = useContext(HttpHeadersContext);
  const { auth, setAuth } = useContext(AuthContext);
  const [bbs, setBbs] = useState({});
  const [imageUrls, setImageUrls] = useState({}); // ✅ Blob URL 저장용 상태
  const { boardId } = useParams(); // 파라미터 가져오기
  const navigate = useNavigate();
  const getCommentListRef = useRef(null)



  {/* ✅ 댓글 목록을 갱신하는 함수 추가 */ }
  const getCommentList = (page = 1) => {
  };

  // ✅ 게시글 상세 정보 가져오기
  const getBbsDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8989/board/detail/${boardId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("bbs_access_token")}` }
      });

      setBbs(response.data);

      // ✅ 파일이 이미지면 Blob URL 생성
      if (response.data.files) {
        response.data.files.forEach((file) => {
          if (file.fileName.match(/\.(jpeg|jpg|png|gif)$/i)) {
            fetchImage(file.fileUrl, file.id);
          }
        });
      }
    } catch (error) {

    }
  };

  // ✅ 이미지 요청 (JWT 포함) 후 Blob URL 생성
  const fetchImage = async (fileUrl, fileId) => {
    try {
      const response = await axios.get(`http://localhost:8989${fileUrl}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("bbs_access_token")}` },
        responseType: "blob",
      });

      const imageUrl = URL.createObjectURL(response.data);
      setImageUrls((prev) => ({ ...prev, [fileId]: imageUrl }));
    } catch (error) {

    }
  };

  // ✅ 게시글 삭제
  const deleteBbs = async () => {
    try {
      const response = await axios.delete(`http://localhost:8989/board/${boardId}/delete`, { headers });



      if (response.status === 200) {
        alert("게시글을 성공적으로 삭제했습니다 :D");
        navigate("/bbslist");
      }
    } catch (error) {

    }
  };

  useEffect(() => {
    // ✅ JWT 토큰을 요청 헤더에 추가
    setHeaders({
      Authorization: `Bearer ${localStorage.getItem("bbs_access_token")}`
    });

    getBbsDetail();
  }, []);

  const updateBbs = {
    boardId: bbs.boardId,
    writerName: bbs.writerName,
    title: bbs.title,
    content: bbs.content,
    files: bbs.files
  };

  return (
    <div className="bbs-detail-container">
      <div>
        {/* ✅ 글 수정 및 삭제 버튼 */}
        <div className="my-3 d-flex justify-content-end">
          <Link className="btn btn-outline-secondary" to="/bbslist">
            <i className="fas fa-list"></i> 글목록
          </Link> &nbsp;

          {/* ✅ 작성자 본인만 수정 & 삭제 버튼 표시 */}
          {auth && bbs && auth.email === bbs.writer ? (
            <>
              <Link className="btn btn-outline-secondary" to={`/bbsupdate/${bbs.id}`} state={{ bbs: updateBbs }}>
                <i className="fas fa-edit"></i> 수정
              </Link> &nbsp;
              <button className="btn btn-outline-danger" onClick={deleteBbs}>
                <i className="fas fa-trash-alt"></i> 삭제
              </button>
            </>
          ) : null}
        </div>

        {/* ✅ 게시글 정보 */}
        <table className="table table-striped">
          <tbody>
            <tr>
              <th className="col-3">작성자</th>
              <td>{bbs.writer}</td>
            </tr>
            <tr>
              <th>제목</th>
              <td>{bbs.title}</td>
            </tr>
            <tr>
              <th>작성일</th>
              <td>{bbs.createdAt}</td>
            </tr>
            <tr>
              <th>좋아요</th>
              <td>{bbs.likeCount}</td>
            </tr>
            <tr>
              <th>내용</th>
              <td>{bbs.content}</td>
            </tr>
          </tbody>
        </table>

        {/* ✅ 운동 기록 표시 */}
        {bbs.exerciseLog && (
          <div className="exercise-log">
            <h3>운동 기록</h3>
            <p>운동 종류: {bbs.exerciseLog.exerciseType}</p>
            <p>무게: {bbs.exerciseLog.weight} kg</p>
          </div>
        )}

        {/* ✅ 파일 리스트 표시 */}
        <div>
          <h3>첨부된 파일</h3>
          {bbs.files &&
            bbs.files.map((file) => {
              const fileUrl = `http://localhost:8989${file.fileUrl}`;
              const isImage = file.fileName.match(/\.(jpeg|jpg|png|gif)$/i);

              return (
                <div key={file.id}>
                  {isImage ? (
                    // ✅ JWT 포함된 Blob URL로 이미지 표시
                    <a href={imageUrls[file.id]} target="_blank" rel="noopener noreferrer">
                      <img src={imageUrls[file.id]} alt={file.fileName} style={{ width: "200px", cursor: "pointer" }} />
                    </a>
                  ) : (
                    // ✅ 이미지가 아니면 다운로드
                    <a href={fileUrl} download>{file.fileName} (다운로드)</a>
                  )}
                </div>
              );
            })}
        </div>

        {/* ✅ 댓글 리스트 (getCommentList를 props로 넘김) */}
        <CommentList boardId={boardId} getCommentListRef={getCommentListRef} />

        {/* ✅ 댓글 작성 (getCommentListRef 전달) */}
        {auth ? <CommentWrite boardId={boardId} getCommentListRef={getCommentListRef} /> : null}


      </div>
    </div>
  );
}

export default BbsDetail;
