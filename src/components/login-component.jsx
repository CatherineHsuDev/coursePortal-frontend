import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import React, { useState, useEffect } from "react";

const LoginComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleGoogleCredential = async (response) => {
    const credential = response.credential;

    try {
      const res = await AuthService.googleLogin(credential);

      // 1. 跟一般登入一樣，整包存進 localStorage
      localStorage.setItem("user", JSON.stringify(res.data));

      // 2. 跟一般登入一樣，用 AuthService.getCurrentUser() 更新 state
      setCurrentUser(AuthService.getCurrentUser());

      // 3. 導到 /profile
      navigate("/profile");
    } catch (err) {
      console.log(err);
      setMessage("Google 登入失敗");
    }
  };

  // 登入系統按鈕的後續流程
  const handleLogin = async () => {
    try {
      let response = await AuthService.login(email, password);

      // dev tool > application > localstorage
      localStorage.setItem("user", JSON.stringify(response.data));
      window.alert("登入成功。您現在將被重新導向到個人資料頁面。");

      // setCurrentUser(AuthService.getCurrentUser()); 會使用
      // localStorage.setItem("user", JSON.stringify(response.data)); 的資料
      setCurrentUser(AuthService.getCurrentUser());
      navigate("/profile");
    } catch (e) {
      console.log(e);

      setMessage(e.response.data);
    }
  };

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleLoginDiv"),
      { size: "large" }
    );
  }, []);

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {message && <div className="alert alert-danger">{message}</div>}
        <div className="form-group">
          <label htmlFor="username">電子信箱：</label>
          <input
            onChange={handleEmail}
            type="text"
            className="form-control"
            name="email"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">密碼：</label>
          <input
            onChange={handlePassword}
            type="password"
            className="form-control"
            name="password"
          />
        </div>
        <br />
        <div className="form-group">
          <button onClick={handleLogin} className="btn btn-primary btn-block">
            <span>登入系統</span>
          </button>
        </div>

        <div id="googleLoginDiv" className="mt-3 btn px-0"></div>
      </div>
    </div>
  );
};

export default LoginComponent;
