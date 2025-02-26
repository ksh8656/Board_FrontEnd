import axios from "axios";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";
import { getRankColor } from "../utils/utils"; // ✅ rank 색상 적용



function CommentWrite({ getCommentListRef }) {
  const { headers } = useContext(HttpHeadersContext);
  const { auth } = useContext(AuthContext);
  const { boardId } = useParams();
  const [content, setContent] = useState("");

  const createComment = async () => {
    if (!content.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8989/board/${boardId}/comment/write`,
        { content },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      console.log("[CommentWrite.js] createComment() success :D", response.data);
      alert("댓글이 성공적으로 등록되었습니다!");

      setContent(""); // ✅ 입력 필드 초기화

      // ✅ 댓글 즉시 업데이트
      if (getCommentListRef && getCommentListRef.current) {
        getCommentListRef.current(1);
      }
    } catch (error) {
      console.error("[CommentWrite.js] createComment() error :<", error);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  return (
    <div className="comment-write-container">
      {/* ✅ 상단 영역 (프로필 이미지, 댓글 작성자) */}
      <div className="my-1 d-flex align-items-center">
        <div className="profile-wrapper" style={{ backgroundColor: getRankColor(auth.rank) }}>
          <img src="/images/profile-placeholder.png" alt="프로필 이미지" className="profile-img" />
        </div>
        <div className="col-7">
          <span className="comment-id" style={{ color: getRankColor(auth.rank) }}>
            {auth.email}
          </span>
        </div>
        <div className="col-2 d-flex justify-content-end">
          <button className="btn btn-outline-secondary" onClick={createComment}>
            <i className="fas fa-comment-dots"></i> 댓글 추가
          </button>
        </div>
      </div>

      {/* ✅ 하단 영역 (댓글 입력 칸) */}
      <div className="my-3 d-flex justify-content-center">
        <textarea
          className="col-10"
          rows="1"
          placeholder="댓글을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
  
}

export default CommentWrite;
