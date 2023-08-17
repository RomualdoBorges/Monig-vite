import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb, Button, Spin, Tabs } from "antd";
import Formulario from "../../components/Formulario";
import { EdificioContext } from "../../common/context/Edificio";
import { MensagemContext } from "../../common/context/Mensagem";
import OpReservatorioEdificacao from "../../services/GET/options/OpReservatorioEdificacao";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import $ from "jquery";
import "jquery-mask-plugin";
import { Box, FormControlLabel, Switch } from "@mui/material";
import Mensagem from "../../components/Mensagem";
import TabelaAreaUmida from "../../pages/Edificio/page/TabelaAreaUmida";
import Populacao from "../../pages/Edificio/page/Populacao";
import Hidrometro from "../../pages/Edificio/page/Hidrometro";

const itemsTab = [
  {
    key: "1",
    label: "Área Úmida",
    children: <TabelaAreaUmida />,
  },
  {
    key: "2",
    label: "População",
    children: <Populacao />,
  },
  {
    key: "3",
    label: "Hidrômetro",
    children: <Hidrometro />,
  },
];

const Edificacao = () => {
  // const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [keyTextField, setKeyTextField] = React.useState(0);
  const [opReservatorioEdificacao, setOpReservatorioEdificacao] =
    React.useState();

  // Obtendo os estados e funções do contexto Edifício-----
  const {
    agua_de_reuso,
    setAgua_de_reuso,
    onSubmit,
    editar,
    setEditar,
    enviado,
    setcontroleUseEffectEdificio,
    dados,
    setDados,
    erro,
    setErro,
    desabilitarLogradouro,
    desabilitarBairro,
    validarCNPJ,
    reservatorio_edificacao,
    setReservatorioEdificacao,
    isLoading,
    setIsLoading,
  } = useContext(EdificioContext);
  //-------------------------------------------------------

  // Obtendo os estados e funções do contexto Mensagem-----
  const { setAbrirSnackbar, erroMensagem, textoMensagem } =
    React.useContext(MensagemContext);
  //-------------------------------------------------------

  // Carregar as opções de reservatórios cadastrados-------
  async function options() {
    const responseReservatorioEdificacao = await OpReservatorioEdificacao(
      Cookies.get("idEscola")
    );
    setOpReservatorioEdificacao(responseReservatorioEdificacao);
  }

  React.useEffect(() => {
    options();
  }, []);
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

  // Função para remover o erro relacionado ao campo 'reservartórios' ao selecionar as opções
  function tiraErroReservatorios() {
    const erroAtualizado = [...erro];
    var index = erroAtualizado.indexOf("reservatorio_edificacao");
    if (index > -1) {
      erroAtualizado.splice(index, 1);
    }
    setErro(erroAtualizado);
  }
  //-------------------------------------------------------

  // Função para retornar a página '/escola/tabela-edificacao'
  function handleVoltar() {
    navigate("/escolas/escola");
  }
  //-------------------------------------------------------

  // Configuração dos campos do formulário-----------------
  const campos = [
    {
      label: "Nome da Edificação",
      name: "nome_do_edificio",
      gridColumn: "span 8",
      value: dados.nome_do_edificio,
      onChange: (event) => onChangeGeral(event, "nome_do_edificio"),
    },
    {
      label: "CNPJ",
      name: "cnpj_edificio",
      gridColumn: "span 4",
      value: dados.cnpj_edificio,
      onChange: (event) => {
        onChangeGeral(event, "cnpj_edificio");
        validarCNPJ(event, "cnpj_edificio");
      },
    },
    {
      label: "CEP",
      name: "cep_edificio",
      gridColumn: " 1 / span 3",
      value: dados.cep_edificio,
      onChange: (event) => onChangeGeral(event, "cep_edificio"),
    },
    {
      label: "Logradouro",
      name: "logradouro_edificio",
      gridColumn: "span 6",
      value: dados.logradouro_edificio,
      disabled: desabilitarLogradouro,
      onChange: (event) => onChangeGeral(event, "logradouro_edificio"),
    },
    {
      label: "Número",
      name: "numero_edificio",
      gridColumn: "span 3",
      value: dados.numero_edificio,
      onChange: (event) => onChangeGeral(event, "numero_edificio"),
    },
    {
      label: "Complemento",
      name: "complemento_edificio",
      gridColumn: "span 3",
      value: dados.complemento_edificio,
      onChange: (event) => onChangeGeral(event, "complemento_edificio"),
    },
    {
      label: "Bairro",
      name: "bairro",
      gridColumn: "span 3",
      value: dados.bairro_edificio,
      disabled: desabilitarBairro,
      onChange: (event) => onChangeGeral(event, "bairro"),
    },
    {
      label: "Cidade",
      name: "cidade_edificio",
      gridColumn: "span 3",
      disabled: true,
      value: dados.cidade_edificio,
      onChange: (event) => onChangeGeral(event, "cidade_edificio"),
    },
    {
      label: "Estado",
      name: "estado_edificio",
      gridColumn: "span 3",
      disabled: true,
      value: dados.estado_edificio,
      onChange: (event) => onChangeGeral(event, "estado_edificio"),
    },
    {
      label: "Área total (m³)",
      name: "area_total_edificio",
      gridColumn: "1 / span 3",
      value: dados.area_total_edificio,
      onChange: (event) => onChangeGeral(event, "area_total_edificio"),
    },
    {
      label: "Quant. de pavimentos",
      name: "pavimentos_edificio",
      gridColumn: "span 3",
      value: dados.pavimentos_edificio,
      onChange: (event) => onChangeGeral(event, "pavimentos_edificio"),
    },
    {
      label: "Reservatórios",
      name: "reservatorio_edificacao",
      gridColumn: "10 / span 3",
      value: reservatorio_edificacao,
      select: opReservatorioEdificacao,
      onChange: (event) => {
        setReservatorioEdificacao(event.target.value);
        tiraErroReservatorios();
      },
    },
  ];
  //-------------------------------------------------------

  // Máscara de input usando jQuery------------------------
  $(() => {
    $("#cnpj_edificio").mask("00.000.000/0000-00");
    $("#cep_edificio").mask("00000-000");
  });
  //-------------------------------------------------------

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  function handleClick(event) {
    event.preventDefault();
  }
  return (
    <>
      <Breadcrumb
        style={{ margin: "1rem 0" }}
        items={[
          { title: "Home" },
          { title: "..." },
          { title: "Escola" },
          { title: "Edificações" },
        ]}
      />

      <div style={{ padding: "2rem", minHeight: "80vh", background: "#fff" }}>
        {isLoading ? (
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
                <h1>Cadastro de Edificações</h1>

                <div style={{ display: "flex", gap: "1rem" }}>
                  {(!enviado || !editar) === true && (
                    <Button onClick={handleVoltar}>Voltar</Button>
                  )}

                  {(!enviado || editar) && (
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={!editar}
                      onClick={() => {
                        setAbrirSnackbar(true);
                        setTimeout(() => {
                          setKeyTextField((oldKey) => oldKey + 1);
                        }, 0);
                      }}
                    >
                      {!enviado ? "Cadastrar" : "Salvar"}
                    </Button>
                  )}

                  {enviado && (
                    <Button
                      htmlType="button"
                      onClick={() => {
                        setEditar(!editar);
                        setcontroleUseEffectEdificio(false);
                        setTimeout(() => {
                          setKeyTextField((oldKey) => oldKey + 1);
                        }, 0);
                      }}
                    >
                      {editar ? "Cancelar" : "Editar"}
                    </Button>
                  )}
                </div>
              </div>

              <Formulario
                campos={campos}
                grid={12}
                disabled={!editar}
                erro={erro}
              />

              <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gap={3}
                marginTop={-5}
              >
                <Box gridColumn="7 / span 4">
                  <FormControlLabel
                    disabled={!editar}
                    control={<Switch checked={agua_de_reuso} />}
                    label="Água de Reúso?"
                    name="agua_de_reuso"
                    value={agua_de_reuso}
                    onChange={() => {
                      setAgua_de_reuso(!agua_de_reuso);
                      if (agua_de_reuso) {
                        setDados((prevDados) => ({
                          ...prevDados,
                          capacidade_reuso_m3_edificio: null,
                        }));
                        setTimeout(() => {
                          setKeyTextField((oldKey) => oldKey + 1);
                        }, 0);
                      } else {
                        setTimeout(() => {
                          setKeyTextField((oldKey) => oldKey + 1);
                        }, 0);
                      }
                    }}
                  />
                </Box>
              </Box>
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
      </div>
      <Mensagem sucesso={!erroMensagem} mensagem={textoMensagem} />
    </>
  );
};

export default Edificacao;
