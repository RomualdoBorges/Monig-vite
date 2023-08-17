import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import PaginaPadrao from "./components/PaginaPadrao";
import Home from "./pages/Home";
import Escolas from "./pages/Escolas";
import { EscolaProvider } from "./common/context/Escola";
import { EdificioProvider } from "./common/context/Edificio";
import { AreaUmidaProvider } from "./common/context/AreaUmida";
import { MensagemProvider } from "./common/context/Mensagem";
import Escola from "./pages/Escola";
import { ReservatorioProvider } from "./common/context/Reservatorio";
import { PopulacaoProvider } from "./common/context/Populacao";
import { HidrometroProvider } from "./common/context/Hidrometro";
import { EquipamentosProvider } from "./common/context/Equipamentos";
import Edificacao from "./pages/Edificio";
import Cookies from "js-cookie";
import AuthTokenValid from "./services/GET/AuthTokenValid";
import Login from "./pages/Login";
import AreaUmida from "./pages/AreaUmida";
import TipoEvento from "./pages/TipoEvento";

const AuthRoute = ({ element: Component, ...rest }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = Cookies.get("token");
      if (!!token) {
        const isValid = await AuthTokenValid(token);
        if (isValid.ok) {
          setAuthenticated(true);
        } else {
          navigate("/login", { replace: true }); // Redirecionar para a tela de login
        }
      } else {
        navigate("/login", { replace: true }); // Redirecionar para a tela de login
      }
    };

    checkAuthentication();
  }, []);

  return authenticated ? <Component {...rest} /> : null; // Renderizar null para evitar renderizar o componente de forma temporária
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <MensagemProvider>
        <EscolaProvider>
          <EdificioProvider>
            <AreaUmidaProvider>
              <ReservatorioProvider>
                <PopulacaoProvider>
                  <HidrometroProvider>
                    <EquipamentosProvider>
                      <Routes>
                        <Route
                          path="/"
                          element={
                            <AuthRoute element={() => <PaginaPadrao />} />
                          }
                        >
                          <Route index element={<Home />} />
                          <Route
                            path="/dashboard"
                            element={<div>Dashboard</div>}
                          />
                          <Route path="/escolas" element={<Escolas />} />
                          <Route path="/escolas/escola" element={<Escola />} />
                          <Route
                            path="/escola/edificacao"
                            element={<Edificacao />}
                          />
                          <Route
                            path="/edificacao/area-umida"
                            element={<AreaUmida />}
                          />
                          <Route path="/eventos" element={<div>eventos</div>} />
                          <Route path="/usuario" element={<div>usuario</div>} />
                          <Route path="/tipo_evento" element={<TipoEvento />} />
                        </Route>
                        <Route path="/login" element={<Login />} />
                      </Routes>
                    </EquipamentosProvider>
                  </HidrometroProvider>
                </PopulacaoProvider>
              </ReservatorioProvider>
            </AreaUmidaProvider>
          </EdificioProvider>
        </EscolaProvider>
      </MensagemProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
