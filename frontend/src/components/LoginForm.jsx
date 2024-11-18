import { useState } from "react";
import TextInput from "./TextInput";
import axios from "axios";

const LoginForm = () => {
  const [userID, setUserID] = useState("");
  const [passwd, setPasswd] = useState("");
  const [userName, setUserName] = useState("");
  const [jwt, setJwt] = useState("");

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const [loginError, setLoginError] = useState("");
  const [authError, setAuthError] = useState("");

  const handleUserIDChange = (e) => {
    setUserID(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPasswd(e.target.value);
  };

  const handleLoginClick = () => {
    axios
      .post("http://localhost:8080/login", {
        userID,
        passwd,
      })
      .then((res) => {
        console.log(res);
        setLoginSuccess(true);
        setJwt(res.data.token);
      })
      .catch((error) => {
        console.log(error);
        setLoginError(error.response.data.error);
      });
  };

  const handleSecretClick = () => {
    if (loginSuccess) {
      axios
        .get("http://localhost:8080/secret", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((res) => {
          setAuthSuccess(true);
          setUserName(res.data.username);
        })
        .catch((error) => {
          setAuthError(error.response.data.msg);
        });
    }
  };

  return (
    <>
      <TextInput
        name="userid"
        id="userid"
        placeholder="User ID"
        onChange={handleUserIDChange}
      >
        User ID:
      </TextInput>
      <TextInput
        name="passwd"
        id="passwd"
        placeholder="Password"
        onChange={handlePasswordChange}
      >
        Password:
      </TextInput>
      <button onClick={handleLoginClick}>Login</button> <br />
      <button onClick={handleSecretClick}>Show Your User Name</button>
      <p>{loginSuccess ? "Logged In!" : loginError}</p>
      <p>{authSuccess ? userName : authError}</p>
    </>
  );
};

export default LoginForm;
