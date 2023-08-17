import React from "react";
import Cookies from "js-cookie";
import { Breadcrumb, Button, Popconfirm, Spin } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Tabela from "../../components/Tabela";
import ListaEscolas from "../../services/GET/ListaEscolas";
import DeletarEscola from "../../services/DELETE/DeletarEscola";
import { useNavigate } from "react-router-dom";
import { EscolaContext } from "../../common/context/Escola";
import { MensagemContext } from "../../common/context/Mensagem";
import Mensagem from "../../components/Mensagem";

const Escolas = () => {
  const [loading, setLoading] = React.useState(true);
  const [lista, setLista] = React.useState([]);
  const [keyTabela, setKeyTabela] = React.useState(0);
  const [openConfirmacao, setConfirmacao] = React.useState(false);
  const navigate = useNavigate();

  // Obtendo os estados e funções do contexto Escola-------
  const {
    setDados,
    setNivel,
    setEnviado,
    setEditar,
    controleUseEffect,
    setcontroleUseEffect,
    setErro,
  } = React.useContext(EscolaContext);
  //-------------------------------------------------------

  // Obtendo os estados e funções do contexto Mensagem-----
  const { setAbrirSnackbar, erroMensagem, textoMensagem, setTextoMensagem } =
    React.useContext(MensagemContext);
  //-------------------------------------------------------

  // Configuração da coluna e ações da tabela -------------
  const cabecalho = [
    { field: "nome", headerName: "Tipo", flex: 1 },
    {
      field: "actions",
      headerName: "Ações",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <Popconfirm
          placement="leftTop"
          title="Tem certeza que deseja excluir?"
          onConfirm={() => {
            handleExcluir(params.id);
            deletar();
            setAbrirSnackbar(true);
          }}
          okText="Sim"
          cancelText="Cancelar"
        >
          <Button icon={<DeleteOutlined />}></Button>
        </Popconfirm>,
      ],
    },
  ];
  //-------------------------------------------------------------

  // Efeito colateral para carregar as escolas após o componente montar
  const recuperarEscolas = async () => {
    try {
      const response = await ListaEscolas();

      setLista(response);
    } catch (error) {
      console.error("Erro ao carregar as escolas: ", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    recuperarEscolas();
  }, []);

  React.useEffect(() => {
    recuperarEscolas();
  }, [keyTabela]);
  //-------------------------------------------------------

  // Função para salvar o ID no cookie e navegar para a página de edição
  function handleClickRow(params) {
    setcontroleUseEffect(!controleUseEffect);
    Cookies.set("idEscola", params.id);
    setErro([]);
    setEditar(false);
    navigate("/escolas/escola");
  }
  //-------------------------------------------------------

  // Função assíncrona para exclusão de escola-------------
  async function deletar() {
    const response = await DeletarEscola(Cookies.get("idEscola"));
    Cookies.remove("idEscola");
    setTimeout(() => {
      setKeyTabela((oldKey) => oldKey + 1);
    }, 0);
    setTextoMensagem("Escola excluida!");
  }
  //-------------------------------------------------------

  // Função para lidar com a ação de exclusão na tabela----
  function handleExcluir(id) {
    setTimeout(() => {
      setKeyTabela((oldKey) => oldKey + 1);
    }, 0);
    // setConfirmacao(!openConfirmacao);
    Cookies.set("idEscola", id);
  }
  //-------------------------------------------------------

  // Função para criar uma nova escola---------------------
  function handleNovo() {
    navigate("/escolas/escola");
    Cookies.remove("idEscola");
    Cookies.remove("idEdificio");
    setDados((prevDados) => ({
      ...prevDados,
      nome: "",
      cnpj: "",
      telefone: "",
      email: "",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    }));
    setNivel([]);
    setErro([]);
    setEnviado(false);
    setEditar(true);
  }
  //-------------------------------------------------------

  return (
    <>
      <Breadcrumb
        style={{ margin: "1rem 0" }}
        items={[{ title: "Home" }, { title: "Escolas" }]}
      />

      <div
        style={{
          padding: "2rem",
          minHeight: "80vh",
          background: "#fff",
        }}
      >
        {loading ? (
          <Spin size="large" style={{ paddingTop: "20rem" }}>
            <div className="content" />
          </Spin>
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h1>Escolas Cadastradas</h1>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleNovo}
              >
                Adicionar
              </Button>
            </div>
            <div style={{ paddingTop: "2rem" }}>
              <Tabela
                key={keyTabela}
                cabecalho={cabecalho}
                corpo={lista}
                excluir={handleExcluir}
                onRowClick={handleClickRow}
              />
            </div>
          </div>
        )}
      </div>

      <Mensagem sucesso={!erroMensagem} mensagem={textoMensagem} />
    </>
  );
};
export default Escolas;
