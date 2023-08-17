import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb, Button, Spin, Tabs } from "antd";
import { EdificioContext } from "../../common/context/Edificio";
import { AreaUmidaContext } from "../../common/context/AreaUmida";
import { MensagemContext } from "../../common/context/Mensagem";
import { useNavigate } from "react-router-dom";
import Formulario from "../../components/Formulario";
import Mensagem from "../../components/Mensagem";
import OpTipoAreaUmida from "../../services/GET/options/OpTipoAreaUmida";
import OpOperacaoAreaUmida from "../../services/GET/options/OpOperacaoAreaUmida";
import Equipamentos from "./page/Equipamentos";
import Cookies from "js-cookie";

const abas = [{ key: "1", label: "Equipamentos", children: <Equipamentos /> }];

const AreaUmida = () => {
  const navigate = useNavigate();
  const [opTipoAreaUmida, setOpTipoAreaUmida] = useState();
  const [opOperacaoAreaUmida, setOpOperacaoAreaUmida] = useState();

  // Obtendo os estados e funções do contexto Edifício-----------
  const { nome } = useContext(EdificioContext);
  //-------------------------------------------------------------

  // Obtendo os estados e funções do contexto Area Umida---------
  const {
    tipo_area_umida,
    setTipoAreaUmida,
    status_area_umida,
    setStatus,
    operacao_area_umida,
    setOperacao,
    enviado,
    editarAreaUmida,
    setEditarAreaUmida,
    onSubmit,
    dados,
    setDados,
    erro,
    setErro,
    handleClickSalvar,
    setHandClickSalvar,
    loading,
  } = useContext(AreaUmidaContext);
  //-------------------------------------------------------------

  // Obtendo os estados e funções do contexto Mensagem-----------
  const { setAbrirSnackbar, erroMensagem, textoMensagem, severity } =
    useContext(MensagemContext);
  //-------------------------------------------------------------

  // Carregar as opções de Tipo e Operação da Área Úmida---------
  async function options() {
    const responseTipoAreaUmida = await OpTipoAreaUmida();
    const responseOperacaoAreaUmida = await OpOperacaoAreaUmida();
    setOpTipoAreaUmida(responseTipoAreaUmida);
    setOpOperacaoAreaUmida(responseOperacaoAreaUmida);
  }

  useEffect(() => {
    options();
  }, []);
  //-------------------------------------------------------------

  // Função para retornar a página "/escola/edificacao"----------
  function handleVoltar() {
    navigate("/escola/edificacao");
    Cookies.remove("idAreaUmida");
    setHandClickSalvar(true);
    setErro(["", ""]);
  }
  //-------------------------------------------------------------

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
  //-------------------------------------------------------------

  // Função para remover o erro relacionado ao campo 'tipo' ao selecionar as opções
  function tiraErroTipo() {
    const erroAtualizado = [...erro];
    var index = erroAtualizado.indexOf("tipo_area_umida");
    if (index > -1) {
      erroAtualizado.splice(index, 1);
    }
    setErro(erroAtualizado);
  }
  //-------------------------------------------------------------

  //Função para remover o erro relacionado ao campo 'status' ao selecionar as opções
  function tiraErroStatus() {
    const erroAtualizado = [...erro];
    var index = erroAtualizado.indexOf("status_area_umida");
    if (index > -1) {
      erroAtualizado.splice(index, 1);
    }
    setErro(erroAtualizado);
  }
  //-------------------------------------------------------------

  //Função para remover o erro relacionado ao campo 'operacao' ao selecionar as opções
  function tiraErroOperacao() {
    const erroAtualizado = [...erro];
    var index = erroAtualizado.indexOf("operacao_area_umida");
    if (index > -1) {
      erroAtualizado.splice(index, 1);
    }
    setErro(erroAtualizado);
  }
  //-------------------------------------------------------------

  // Configuração dos campos do formulário-----------------------
  const campos = [
    {
      label: "Tipo",
      name: "tipo_area_umida",
      gridColumn: "span 4",
      value: tipo_area_umida,
      selectUni: opTipoAreaUmida,
      onChange: (event) => {
        setTipoAreaUmida(event.target.value);
        tiraErroTipo();
      },
    },
    {
      label: "Nome da Área Úmida",
      name: "nome_area_umida",
      gridColumn: "span 8",
      value: dados.nome_area_umida,
      onChange: (event) => onChangeGeral(event, "nome_area_umida"),
    },
    {
      label: "Localização",
      name: "localizacao_area_umida",
      gridColumn: "span 4",
      value: dados.localizacao_area_umida,
      onChange: (event) => onChangeGeral(event, "localizacao_area_umida"),
    },
    {
      label: "Status",
      name: "status_area_umida",
      gridColumn: "span 4",
      value: status_area_umida,
      selectUni: ["Aberto", "Fechado"],
      onChange: (event) => {
        setStatus(event.target.value);
        tiraErroStatus();
      },
    },
    {
      label: "Operação",
      name: "operacao_area_umida",
      gridColumn: "span 4",
      value: operacao_area_umida,
      selectUni: opOperacaoAreaUmida,
      onChange: (event) => {
        setOperacao(event.target.value);
        tiraErroOperacao();
      },
    },
  ];
  //-------------------------------------------------------------

  return (
    <>
      <Breadcrumb
        style={{ margin: "1rem 0" }}
        items={[
          { title: "Home" },
          { title: "..." },
          { title: "Edificações" },
          { title: "Área Úmida" },
        ]}
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
                <h1>Área Úmida / {nome}</h1>

                <div style={{ display: "flex", gap: "1rem" }}>
                  {(!enviado || !editarAreaUmida) === true && (
                    <Button onClick={handleVoltar}>Voltar</Button>
                  )}

                  {(!enviado || editarAreaUmida) && (
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={!editarAreaUmida}
                      onClick={() => {
                        setAbrirSnackbar(true);
                      }}
                    >
                      {!enviado ? "Cadastrar" : "Salvar"}
                    </Button>
                  )}

                  {enviado && (
                    <Button
                      onClick={() => setEditarAreaUmida(!editarAreaUmida)}
                    >
                      {editarAreaUmida ? "Cancelar" : "Editar"}
                    </Button>
                  )}
                </div>
              </div>

              <Formulario
                campos={campos}
                grid={12}
                disabled={!editarAreaUmida}
                erro={erro}
              />
            </form>

            {!enviado ? (
              <div />
            ) : (
              <Tabs type="card" style={{ paddingTop: "2rem" }} items={abas} />
            )}
          </div>
        )}
      </div>
      <Mensagem
        sucesso={!erroMensagem}
        mensagem={textoMensagem}
        severity={severity}
      />
    </>
  );
};

export default AreaUmida;
