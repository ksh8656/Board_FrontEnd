import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import Comment from "./Comment";
import { AuthContext } from "../context/AuthProvider"; // ✅ auth 가져오기


function CommentList({ boardId, getCommentListRef }) {
  const { auth } = useContext(AuthContext); // ✅ auth 사용 가능하도록 설정
  const [page, setPage] = useState(1);
  const [commentList, setCommentList] = useState([]); // ✅ 초기값을 빈 배열([])로 설정
  const [totalCnt, setTotalCnt] = useState(0); // ✅ 초기값을 0으로 설정

  const changePage = (page) => {
    setPage(page);
    getCommentList(page);
    getCommentListRef.current(page);
  };

  const getCommentList = async (page) => {
    try {
      const response = await axios.get(
        `http://localhost:8989/board/${boardId}/comment/list`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
          params: { page: page - 1, size: 5 }, // ✅ size=5 추가
        }
      );

      
      setTotalCnt(response.data.totalElements || 0);

      // ✅ 기존 리스트를 비운 후 새 리스트 추가 (React가 상태 변화를 감지하도록 강제)
      setCommentList([]);
      setTimeout(() => {
        setCommentList([...response.data.content]);
      }, 100);
      
    } catch (error) {
      setCommentList([]);
      setTotalCnt(0);
    }
  };


  useEffect(() => {
    if (getCommentListRef) {
      getCommentListRef.current = getCommentList; // ✅ props.getCommentListRef 사용
    }
    getCommentList(1);
  }, [boardId]);

  return (
    <>
      <Pagination
        activePage={page}
        itemsCountPerPage={5}
        totalItemsCount={totalCnt} // ✅ undefined 방지 (totalCnt의 기본값을 0으로 설정)
        pageRangeDisplayed={5}
        prevPageText={"‹"}
        nextPageText={"›"}
        onChange={changePage}
      />

      {commentList.map((comment, idx) => (
        <div className="my-5" key={comment.id || idx}>
          <Comment obj={comment} key={comment.id || idx} page={page} getCommentList={getCommentListRef.current} />
        </div>
      ))}
    </>
  );
}

export default CommentList;



