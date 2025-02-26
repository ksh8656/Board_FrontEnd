import axios from "axios";
import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";
import { getRankColor } from "../utils/utils"; // ✅ rank 색상 적용

function Comment({ obj: comment, getCommentList, page }) {
  const { auth } = useContext(AuthContext);
  const { headers } = useContext(HttpHeadersContext);
  const { boardId } = useParams(); // ✅ URL에서 boardId 가져오기

  const commentId = comment.id; // ✅ 백엔드 필드명 확인
  const [show, setShow] = useState(false);
  const [content, setContent] = useState(comment.content);

  const changeContent = (event) => setContent(event.target.value);

  /* ✅ 댓글 수정 */
  const updateComment = async () => {
    const req = { content };

    try {
      const response = await axios.patch(
        `http://localhost:8989/board/${boardId}/comment/${commentId}`,
        req,
        { headers }
      );

      console.log("[Comment.js] updateComment() success :D", response.data);
      alert("댓글이 수정되었습니다!");
      getCommentList(page); // ✅ 댓글 목록 갱신
      setShow(false);
    } catch (error) {
      console.error("[Comment.js] updateComment() error :<", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  /* ✅ 댓글 삭제 */
  const deleteComment = async () => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await axios.delete(
        `http://localhost:8989/board/${boardId}/comment/${commentId}`,
        { headers }
      );

      console.log("[Comment.js] deleteComment() success :D");
      alert("댓글이 삭제되었습니다!");
      getCommentList(page); // ✅ 삭제 후 목록 갱신
    } catch (error) {
      console.error("[Comment.js] deleteComment() error :<", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="comment-container">
      {/* ✅ 댓글 작성자 정보 */}
      <div className="my-1 d-flex justify-content-center">
        <div className="col-1">
          <img
            src="/images/profile-placeholder.png"
            alt="프로필 이미지"
            className="profile-img"
          />
        </div>
        <div className="col-5">
          <div className="row">
            {/* ✅ 작성자의 rank에 맞는 색상 적용 */}
            <span className="comment-id" style={{ color: getRankColor(comment.rank) }}>
              {comment.writerEmail}
            </span>
          </div>
          <div className="row">
            <span>{comment.createdAt}</span>
          </div>
        </div>

        <div className="col-4 d-flex justify-content-end">
          {/* ✅ 자신이 작성한 댓글인 경우에만 수정 & 삭제 버튼 표시 */}
          {auth.email === comment.writerEmail && (
            <>
              <button className="btn btn-outline-secondary" onClick={() => setShow(!show)}>
                <i className="fas fa-edit"></i> 수정
              </button>{" "}
              &nbsp;
              <button className="btn btn-outline-danger" onClick={deleteComment}>
                <i className="fas fa-trash-alt"></i> 삭제
              </button>
            </>
          )}
        </div>
      </div>

      {/* ✅ 댓글 수정 입력 필드 */}
      {show ? (
        <>
          <div className="my-3 d-flex justify-content-center">
            <textarea
              className="col-10"
              rows="5"
              value={content}
              onChange={changeContent}
            ></textarea>
          </div>
          <div className="my-1 d-flex justify-content-center">
            <button className="btn btn-dark" onClick={updateComment}>
              <i className="fas fa-edit"></i> 수정 완료
            </button>
          </div>
        </>
      ) : (
        <>
          {/* ✅ 댓글 내용 */}
          <div className="my-3 d-flex justify-content-center">
            <div className="col-10 comment">{content}</div>
          </div>
        </>
      )}
    </div>
  );
}

export default Comment;
