import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "react-js-pagination";
import axiosInstance from "../utils/axiosInstance";  
import { AuthContext } from "../context/AuthProvider"; 
import { getRankColor } from "../utils/utils";

import "../../css/bbslist.css";
import "../../css/page.css";

function BbsList() {
  const { auth } = useContext(AuthContext); // ✅ 로그인 여부 확인
  const navigate = useNavigate();
  
  const [bbsList, setBbsList] = useState([]);
  const [choiceVal, setChoiceVal] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCnt, setTotalCnt] = useState(0);

  // ✅ 로그인되지 않은 사용자는 로그인 페이지로 이동
  useEffect(() => {
    if (!auth?.token) {
      alert("로그인한 사용자만 글을 확인할 수 있습니다!");
      navigate("/login"); // 로그인 페이지로 이동
    } else {
      getBbsList(1);
    }
  }, [auth, navigate]);

  // ✅ 게시글 전체 조회 (JWT 포함)
  const getBbsList = async (page) => {
    try {
      const response = await axiosInstance.get("/board/list", {
        params: { page: page - 1 },
      });

      setBbsList(response.data.content);
      setPageSize(response.data.pageable?.pageSize || 10);
      setTotalPages(response.data.totalPages);
      setTotalCnt(response.data.totalElements);
    } catch (error) {
      
    }
  };

  const handleLike = async (boardId) => {
    
  
    if (!boardId) {
      return; // 🚨 boardId가 없으면 API 호출 방지
    }
  
    try {
      await axiosInstance.put(`/board/${boardId}/like`); // ✅ 백엔드 API 호출
      setBbsList((prevList) =>
        prevList.map((bbs) =>
          bbs.id === boardId ? { ...bbs, likeCount: bbs.likeCount + 1 } : bbs
        )
      );
    } catch (error) {
      
    }
  };
  

  // ✅ 게시글 검색
  const search = async () => {
    try {
      const response = await axiosInstance.get("/board/search", {
        params: {
          page: page - 1,  // ✅ 0부터 시작하는 페이지 인덱스
          title: choiceVal === "title" ? searchVal : "",
          content: choiceVal === "content" ? searchVal : "",
          writerName: choiceVal === "writer" ? searchVal : "",
        },
      });
  
      setBbsList(response.data.content);
      setTotalCnt(response.data.totalElements);
    } catch (error) {
      
    }
  };
  

  const changeChoice = (event) => setChoiceVal(event.target.value);
  const changeSearch = (event) => setSearchVal(event.target.value);
  const changePage = (page) => {
    setPage(page);
    getBbsList(page);
  };

  return (
    <div>
      {/* 검색 */}
      <table className="search">
        <tbody>
          <tr>
            <td>
              <select className="custom-select" value={choiceVal} onChange={changeChoice}>
                <option>검색 옵션 선택</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="writer">작성자</option>
              </select>
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="검색어"
                value={searchVal}
                onChange={changeSearch}
              />
            </td>
            <td>
              <button type="button" className="btn btn-outline-secondary" onClick={search}>
                <i className="fas fa-search"></i> 검색
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <br />

      <table className="table table-hover">
        <thead>
          <tr>
            <th className="col-1">번호</th>
            <th className="col-7">제목</th>
            <th className="col-3">작성자</th>
            <th className="col-1">좋아요</th>
          </tr>
        </thead>
        <tbody>
          {bbsList.map((bbs, idx) => (
            <TableRow obj={bbs} key={idx} cnt={idx + 1} handleLike={handleLike} />
          ))}
        </tbody>
      </table>

      <Pagination
        className="pagination"
        activePage={page}
        itemsCountPerPage={pageSize}
        totalItemsCount={totalCnt}
        pageRangeDisplayed={totalPages}
        prevPageText={"‹"}
        nextPageText={"›"}
        onChange={changePage}
      />

      <div className="my-5 d-flex justify-content-center">
        <Link className="btn btn-outline-secondary" to="/bbswrite">
          <i className="fas fa-pen"></i> &nbsp; 글쓰기
        </Link>
      </div>
    </div>
  );
}

/* ✅ 글 목록 테이블 행 컴포넌트 */
function TableRow({ obj, cnt, handleLike }) {

  return (
    <tr>
      <th>{cnt}</th>
      <td>
        <Link to={`/bbsdetail/${obj.boardId || obj.id}`} className="bbs-title-link">
          <span className="underline bbs-title">{obj.title}</span>
        </Link>
      </td>
      <td style={{ color: getRankColor(obj.rank) }}>
        {obj.writer || "알 수 없음"}
      </td>
      <td style={{ textAlign: "center" }}>
        <button className="btn btn-outline-danger btn-sm" onClick={() => handleLike(obj.boardId || obj.id)}>
          ❤️ {obj.likeCount}
        </button>
      </td>
    </tr>
  );
}


export default BbsList;

