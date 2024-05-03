import React, { useState } from "react";
import logo from "./logo.svg";
import axios from "axios";
import "./App.css";
import Signup from "./Signup";
import Login from "./Login";

axios.defaults.baseURL = "http://localhost:3001";

function MyComponent() {
  const handleClick = () => {
    axios
      .get("/signup")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Conectar ao Backend</h1>
      <button onClick={handleClick}>Fetch Data</button>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  const handleLogout = async () => {
    try {
      await axios.get("/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setToken(null);
      // Redireciona para a tela de login
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };


  const handleToggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {token ? (
          <div>
            <p>Você está logado! bem vindo </p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : showLogin ? (
          <div>
            <Login setToken={setToken} />
            <button onClick={handleToggleForm}>Ir para Cadastro</button>
          </div>
        ) : (
          <div>
            <Signup setToken={setToken} />
            <button onClick={handleToggleForm}>Ir para Login</button>
          </div>
        )}
      </header>
      {token && <p>Token de autenticação: {token}</p>}
      <MyComponent />
    </div>
  );
}

export default App;
