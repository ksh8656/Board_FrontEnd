import { Routes, Route } from "react-router-dom";

import Home from "../app/Home"
import BbsList from "../bbs/BbsList"
import BbsWrite from "../bbs/BbsWrite"
import BbsDetail from "../bbs/BbsDetail"
import BbsUpdate from "../bbs/BbsUpdate"
import Join from "../member/Join"
import Login from "../member/Login"
import Logout from "../member/Logout"
import ExerciseStats from "../member/ExerciseStats";  



function Router() {

	return (
			<Routes>
				<Route path="/" element={<Home />}></Route>

				<Route path="/bbslist" element={<BbsList />}></Route>
				<Route path="/bbswrite" element={<BbsWrite />}></Route>
				<Route path="/bbsdetail/:boardId" element={<BbsDetail />}></Route>
				<Route path="/bbsupdate/:boardId" element={<BbsUpdate />} />

				<Route path="/login" element={<Login />}></Route>
				<Route path="/join" element={<Join />}></Route>
				<Route path="/exercise-stats" element={<ExerciseStats />} />
				<Route path="/logout" element={<Logout />}></Route>
			</Routes>
	);
}

export default Router;