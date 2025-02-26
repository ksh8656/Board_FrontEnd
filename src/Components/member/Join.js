import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

function Join() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");
    const [checkPwd, setCheckPwd] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [benchMax, setBenchMax] = useState("");
    const [deadliftMax, setDeadliftMax] = useState("");
    const [squatMax, setSquatMax] = useState("");
    const [emailCheckMessage, setEmailCheckMessage] = useState(""); // 이메일 중복 체크 결과

    const navigate = useNavigate();

    const changeEmail = (event) => setEmail(event.target.value);
    const changeName = (event) => setName(event.target.value);
    const changePwd = (event) => setPwd(event.target.value);
    const changeCheckPwd = (event) => setCheckPwd(event.target.value);
    const changeHeight = (event) => setHeight(event.target.value);
    const changeWeight = (event) => setWeight(event.target.value);
    const changeBenchMax = (event) => setBenchMax(event.target.value);
    const changeDeadliftMax = (event) => setDeadliftMax(event.target.value);
    const changeSquatMax = (event) => setSquatMax(event.target.value);

    /* 🛠 이메일 중복 체크 */
    const checkEmailDuplicate = async () => {
		if (!email) {
			alert("이메일을 입력하세요.");
			return;
		}
	
		try {
			console.log("이메일 중복 확인 요청 시작:", email);
	
			const resp = await axios.get(`http://localhost:8989/user/checkEmail`, {
				params: { email }  
			});
	
			console.log("이메일 중복 확인 응답:", resp.data); // ✅ 여기서 확인
	
			// 🔹 응답이 boolean 값이면 변환
			if (typeof resp.data === "boolean") {
				setEmailCheckMessage(resp.data ? "이미 사용 중인 이메일입니다." : "사용 가능한 이메일입니다.");
			} else {
				setEmailCheckMessage("응답이 잘못되었습니다.");
			}
		} catch (err) {
			console.error("이메일 중복 확인 오류:", err);
			setEmailCheckMessage("중복 확인 중 오류 발생");
		}
	};
	
	

    /* 🛠 회원가입 요청 */
    const join = async () => {
        if (pwd !== checkPwd) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        const req = {
            email: email,
            password: pwd,
            username: name,
            height: Number(height),
            weight: Number(weight),
            benchMax: Number(benchMax),
            deadliftMax: Number(deadliftMax),
            squatMax: Number(squatMax)
        };

        try {
            const resp = await axios.post("http://localhost:8989/user/register", req);
            console.log("[Join.js] join() success :D", resp.data);
            alert(`${resp.data.username}님 회원가입을 축하드립니다 🎊`);
            navigate("/login");
        } catch (err) {
            console.log("[Join.js] join() error :<", err);
            alert(err.response?.data || "회원가입 중 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <table className="table">
                <tbody>
                    <tr>
                        <th className="col-2">이메일</th>
                        <td>
                            <input type="text" value={email} onChange={changeEmail} size="50px" /> &nbsp;
                            <button className="btn btn-outline-primary" onClick={checkEmailDuplicate}>
                                중복 확인
                            </button>
                            <span style={{ marginLeft: "10px", color: emailCheckMessage.includes("사용 가능") ? "green" : "red" }}>
                                {emailCheckMessage}
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <th>이름</th>
                        <td>
                            <input type="text" value={name} onChange={changeName} size="50px" />
                        </td>
                    </tr>

                    <tr>
                        <th>비밀번호</th>
                        <td>
                            <input type="password" value={pwd} onChange={changePwd} size="50px" />
                        </td>
                    </tr>

                    <tr>
                        <th>비밀번호 확인</th>
                        <td>
                            <input type="password" value={checkPwd} onChange={changeCheckPwd} size="50px" />
                        </td>
                    </tr>

                    <tr>
                        <th>키 (cm)</th>
                        <td>
                            <input type="number" value={height} onChange={changeHeight} size="50px" />
                        </td>
                    </tr>

                    <tr>
                        <th>몸무게 (kg)</th>
                        <td>
                            <input type="number" value={weight} onChange={changeWeight} size="50px" />
                        </td>
                    </tr>

                    <tr>
                        <th>벤치프레스 최대 중량 (kg)</th>
                        <td>
                            <input type="number" value={benchMax} onChange={changeBenchMax} size="50px" />
                        </td>
                    </tr>

                    <tr>
                        <th>데드리프트 최대 중량 (kg)</th>
                        <td>
                            <input type="number" value={deadliftMax} onChange={changeDeadliftMax} size="50px" />
                        </td>
                    </tr>

                    <tr>
                        <th>스쿼트 최대 중량 (kg)</th>
                        <td>
                            <input type="number" value={squatMax} onChange={changeSquatMax} size="50px" />
                        </td>
                    </tr>
                </tbody>
            </table><br />

            <div className="my-3 d-flex justify-content-center">
                <button className="btn btn-outline-secondary" onClick={join}>
                    <i className="fas fa-user-plus"></i> 회원가입
                </button>
            </div>
        </div>
    );
}

export default Join;

