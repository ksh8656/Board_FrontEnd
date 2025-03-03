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

      alert("댓글이 성공적으로 등록되었습니다!");

      setContent(""); // ✅ 입력 필드 초기화

      // ✅ 댓글 즉시 업데이트
      if (getCommentListRef && getCommentListRef.current) {
        getCommentListRef.current(1);
      }
    } catch (error) {
      alert("댓글 등록에 실패했습니다.");
    }
  };

    return (
      <div className="comment-write-container">
        {/* ✅ 상단 영역만 이동하도록 별도 div 추가 */}
        <div style={{ marginLeft: "110px" }}>
          <div className="my-1 d-flex align-items-center">
            {/* 프로필 이미지 */}
            <div className="profile-wrapper" style={{ backgroundColor: getRankColor(auth.rank) }}>
              <img src="/images/profile-placeholder.png" alt="프로필 이미지" className="profile-img" />
            </div>
    
            {/* 이메일 (가변 크기 적용) */}
            <span className="comment-id mx-3" style={{ color: getRankColor(auth.rank), flexGrow: 1 }}>
              {auth.email}
            </span>
    
            {/* 댓글 추가 버튼 (오른쪽 정렬) */}
            <div style={{ marginRight: "100px" }}>
            <button className="btn btn-outline-secondary"  onClick={createComment}>
              <i className="fas fa-comment-dots"></i> 댓글 추가
            </button>
            </div>
          </div>
        </div>
    
        {/* ✅ 하단 영역 (textarea) - 영향을 받지 않도록 유지 */}
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
