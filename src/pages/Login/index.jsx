import React, { useEffect, useState } from "react";
import { validarEmail, validarSenha } from "../../Utils/validadores";
import fazerPostDeJSON from "../../services/UserService";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { TextField } from "@mui/material";
import { Button } from "antd";
import Imagem from "../../assets/img1.jpg";
import Logo from "../../assets/logo.svg";

const Login = ({ isOpen, onRequestClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const cookieOptions = {
    secure: true, // necessário se a aplicação estiver em HTTPS
    sameSite: "none", // permite compartilhar entre diferentes domínios
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // expira em 1 dia
  };

  useEffect(() => {
    if (location.pathname === "/login") {
      Cookies.remove("idEscola");
      Cookies.remove("idEdificio");
      Cookies.remove("idReservatorio");
      Cookies.remove("idAreaUmida");
      Cookies.remove("idEquipamento");
    }
  }, []);

  //  Lembrar de pesquisar sobre como conseguir a chave de acesso que vem do banco
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fazerPostDeJSON(form);
      if (response.autenticado === true) {
        const chaveDeAcesso = response.servidor.user.access;
        // console.log(chaveDeAcesso);
        Cookies.set("token", chaveDeAcesso, cookieOptions);
        navigate("/"); // navegar para home
      } else {
        alert("Usuário ou senha inválidos.");
      }
      setLoading(false);
    } catch (err) {
      alert("Algo deu errado com o Login" + err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const validadorInput = () => {
    const inputValido = validarEmail(form.email) && validarSenha(form.senha);
    return inputValido;
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <img
        src={Imagem}
        alt="Imagem de água"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />

      <div
        style={{
          display: "Flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          position: "relative",
        }}
      >
        <div
          style={{
            backgroundColor: "#001529",
            padding: "20px",
            borderRadius: "8px",
            width: "300px",
          }}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{
              maxWidth: "100%",
              marginBottom: "10px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />

          <hr style={{ borderColor: "white", margin: "20px 0" }} />

          <form>
            <h3 style={{ color: "white", marginBottom: "20px" }}>
              Efetue o Login:
            </h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              <TextField
                placeholder="Digite seu e-mail"
                type="email"
                name="email"
                onChange={handleChange}
                InputProps={{ style: { backgroundColor: "#e6e6e6" } }}
              />
              <TextField
                placeholder="Digite sua senha"
                type="password"
                name="senha"
                onChange={handleChange}
                InputProps={{ style: { backgroundColor: "#e6e6e6" } }}
              />
              <Button
                size="large"
                type="primary"
                onClick={handleSubmit}
                disabled={loading === true || !validadorInput()}
                style={{ color: "white" }}
              >
                Entrar
              </Button>
            </div>
            <div style={{ marginTop: "20px" }}>
              <p style={{ color: "white" }}>Não possui conta?</p>
              <a style={{ color: "white", textDecoration: "underline" }}>
                Cadastrar
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
