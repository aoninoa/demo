import { useState } from "react";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <LoginForm />
    </>
  );
};

export default App;
