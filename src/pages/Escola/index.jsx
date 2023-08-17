import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import $ from "jquery";
import "jquery-mask-plugin";
import { Breadcrumb, Spin, Button, Tabs } from "antd";
import Formulario from "../../components/Formulario";
import { EscolaContext } from "../../common/context/Escola";
import OpNivelEnsino from "../../services/GET/options/OpNivelEnsino";
import Cookies from "js-cookie";
import TabelaReservatorio from "./pages/TabelaReservatorio";
import Mensagem from "../../components/Mensagem";
import { MensagemContext } from "../../common/context/Mensagem";
import TabelaEdificacao from "./pages/TabelaEdificacao";

// Abas internas para Reservatório e Edificação------------
const itemsTab = [
  {
    key: "1",
    label: "Reservatórios",
    children: <TabelaReservatorio />,
  },
  {
    key: "2",
    label: "Edificações",
    children: <TabelaEdificacao />,
  },
];
//---------------------------------------------------------

const Escola = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [opNivel, setOpNivel] = useState();
  const [inicio, setInicio] = useState(useLocation());

  // Obtendo os estados e funções do contexto Escola-------
  const {
    nivel,
    setNivel,
    onSubmit,
    enviado,
    editar,
    setEditar,
    setcontroleUseEffect,
    dados,
    setDados,
    erro,
    setErro,
    desabilitarLogradouro,
    desabilitarBairro,
    validarCNPJ,
    isLoading,
  } = useContext(EscolaContext);
  //-------------------------------------------------------

  // Obtendo os estados e funções do contexto Mensagem-----
  const { erroMensagem, textoMensagem, severity } = useContext(MensagemContext);
  //-------------------------------------------------------

  // Carregar as opções de nível de ensino-----------------
  async function options() {
    const responseNivelEnsino = await OpNivelEnsino();
    setOpNivel(responseNivelEnsino);
  }

  useEffect(() => {
    options();
  }, [opNivel]);
  //-------------------------------------------------------

  // Função para lidar com a mudança de valores nos campos do formulário
  function onChangeGeral(event, campo) {
    const erroAtualizado = [...erro];
    var index = erroAtualizado.indexOf(campo);
    if (index > -1) {
      erroAtualizado.splice(index, 1);
    }
    setErro(erroAtualizado);
    setDados({ ...dados, [campo]: event.target.value });
  }
  //-------------------------------------------------------

  // Função para remover o erro do campo "nivel"-----------
  function tiraErroNivel() {
    const erroAtualizado = [...erro];
    var index = erroAtualizado.indexOf("nivel");
    if (index > -1) {
      erroAtualizado.splice(index, 1);
    }
    setErro(erroAtualizado);
  }

  useLayoutEffect(() => {
    if (inicio.pathname === "/escolas/escola") {
      options();
      setcontroleUseEffect(true);
      setInicio("");
    }
  }, []);

  // Configuração dos campos do formulário-----------------
  const campos = [
    {
      label: "Nome",
      name: "nome",
      gridColumn: "span 6",
      value: dados.nome,
      onChange: (event) => onChangeGeral(event, "nome"),
    },
    {
      label: "CNPJ",
      name: "cnpj",
      gridColumn: "span 3",
      value: dados.cnpj,
      onChange: (event) => {
        onChangeGeral(event, "cnpj");
        validarCNPJ(event, "cnpj");
      },
    },
    {
      label: "Telefone",
      name: "telefone",
      gridColumn: "span 3",
      value: dados.telefone,
      onChange: (event) => onChangeGeral(event, "telefone"),
    },
    {
      label: "E-mail",
      name: "email",
      gridColumn: "span 6",
      value: dados.email,
      onChange: (event) => onChangeGeral(event, "email"),
    },
    {
      label: "Níveis de Ensino",
      name: "nivel",
      gridColumn: "span 3",
      value: nivel,
      select: opNivel,
      onChange: (event) => {
        setNivel(event.target.value);
        tiraErroNivel();
      },
    },
    {
      label: "CEP",
      name: "CEP",
      gridColumn: " 1 / span 3",
      value: dados.cep,
      onChange: (event) => onChangeGeral(event, "cep"),
    },
    {
      label: "Logradouro",
      name: "logradouro",
      gridColumn: "span 6",
      value: dados.logradouro,
      disabled: desabilitarLogradouro,
      onChange: (event) => onChangeGeral(event, "logradouro"),
    },
    {
      label: "Número",
      name: "numero",
      gridColumn: "span 3",
      value: dados.numero,
      onChange: (event) => onChangeGeral(event, "numero"),
    },
    {
      label: "Complemento",
      name: "complemento",
      gridColumn: "span 3",
      value: dados.complemento,
      onChange: (event) => onChangeGeral(event, "complemento"),
    },
    {
      label: "Bairro",
      name: "bairro",
      gridColumn: "span 3",
      value: dados.bairro,
      disabled: desabilitarBairro,
      onChange: (event) => onChangeGeral(event, "bairro"),
    },
    {
      label: "Cidade",
      name: "cidade",
      gridColumn: "span 3",
      value: dados.cidade,
      disabled: true,
      onChange: (event) => onChangeGeral(event, "cidade"),
    },
    {
      label: "Estado",
      name: "estado",
      gridColumn: "span 3",
      value: dados.estado,
      disabled: true,
      onChange: (event) => onChangeGeral(event, "estado"),
    },
  ];
  //-------------------------------------------------------

  // NÃO FUNCIONA NO VITE Máscara de input usando jQuery---
  $(() => {
    $("#cnpj").mask("00.000.000/0000-00");
    dados.telefone.replace(/\D/g, "").length === 11
      ? $("#telefone").mask("(00) 00000-0000")
      : $("#telefone").mask("(00) 0000-00009");

    $("#CEP").mask("00000-000");
  });
  //-------------------------------------------------------

  // Função para obter a aba ativa interna na página-------
  function navInterna() {
    if (location.pathname === "/escolas/escola/tabela-edificacao") {
      return abas[1].id;
    }
    return abas[0].id;
  }
  //-------------------------------------------------------
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);
  //-------------------------------------------------------

  return (
    <>
      <Breadcrumb
        style={{ margin: "1rem 0" }}
        items={[{ title: "Home" }, { title: "Escolas" }, { title: "Escola" }]}
      />

      <div style={{ padding: "2rem", minHeight: "80vh", background: "#fff" }}>
        {loading ? (
          <Spin size="large" style={{ paddingTop: "20rem" }}>
            <div className="content" />
          </Spin>
        ) : (
          <div>
            <form onSubmit={onSubmit}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "2rem",
                }}
              >
                <h1>Cadastro de Escolas</h1>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <Button
                    onClick={() => {
                      navigate("/escolas");
                      Cookies.remove("idEscola");
                      setDados((prevDados) => ({
                        ...prevDados,
                        bairro: "",
                        logradouro: "",
                        cidade: "",
                        estado: "",
                      }));
                    }}
                  >
                    Voltar
                  </Button>

                  {enviado && (
                    <Button
                      onClick={() => {
                        setEditar(!editar);
                      }}
                    >
                      {editar ? "Cancelar" : "Editar"}
                    </Button>
                  )}

                  {(!enviado || editar) && (
                    <Button type="primary" htmlType="submit" disabled={!editar}>
                      {!enviado ? "Cadastrar" : "Salvar"}
                    </Button>
                  )}
                </div>
              </div>

              <Formulario
                campos={campos}
                disabled={!editar}
                grid={12}
                erro={erro}
              />
            </form>

            {!enviado ? (
              <div />
            ) : (
              <Tabs
                type="card"
                style={{ paddingTop: "2rem" }}
                items={itemsTab}
              />
            )}
          </div>
        )}

        <Mensagem
          sucesso={!erroMensagem}
          mensagem={textoMensagem}
          severity={severity}
        />
      </div>
    </>
  );
};

export default Escola;
