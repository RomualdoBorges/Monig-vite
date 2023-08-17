import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Popconfirm, Spin } from "antd";
import React, { useContext } from "react";
import Tabela from "../../../../components/Tabela";
import { PopulacaoContext } from "../../../../common/context/Populacao";
import { MensagemContext } from "../../../../common/context/Mensagem";
import ListaPopulacao from "../../../../services/GET/ListaPopulacao";
import OpNivelEnsinoPopulacao from "../../../../services/GET/options/OpNivelEnsinoPopulacao";
import Cookies from "js-cookie";
import DeletarPopulacao from "../../../../services/DELETE/DeletarPopulacao";
import Formulario from "../../../../components/Formulario";
import Mensagem from "../../../../components/Mensagem";

function Populacao() {
  const [opNivelPopulacao, setOpNivelPopulacao] = React.useState("");
  const [keyTabela, setKeyTabela] = React.useState(0);
  const [salvarClick, setSalvarClick] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [lista, setLista] = React.useState([]);
  const [deletarPop, setDeletarPop] = React.useState(true);

  const {
    nivel,
    setNivel,
    periodo,
    setPeriodo,
    openModal,
    setOpenModal,
    onSubmit,
    setControleUseEffectPopulacao,
    controleUseEffectPopulacao,
    dados,
    setDados,
    erro,
    setErro,
    openConfirmacao,
    setConfirmacao,
    isLoading,
    setIsLoading,
  } = useContext(PopulacaoContext);

  const { setAbrirSnackbar, erroMensagem, textoMensagem, setTextoMensagem } =
    useContext(MensagemContext);

  // Configuração da coluna e ações da tabela--------------------
  const cabecalho = [
    { field: "nivel", headerName: "Nivel", flex: 1 },
    { field: "periodo", headerName: "Periodo", flex: 1 },
    { field: "alunos", headerName: "Alunos", flex: 1 },
    { field: "funcionarios", headerName: "Funcionarios", flex: 1 },
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
          <Button icon={<DeleteOutlined />} />
        </Popconfirm>,
      ],
    },
  ];
  //-------------------------------------------------------------

  // Carregar as opções de Tipo e Operação da Equipamentos-------
  async function options() {
    const responseOpNivelPopulacao = await OpNivelEnsinoPopulacao();
    setOpNivelPopulacao(responseOpNivelPopulacao);
  }

  React.useEffect(() => {
    options();
  }, [opNivelPopulacao]);
  //-------------------------------------------------------------

  // Função assíncrona para buscar a lista de reservatórios e atualizar o estado local
  async function fetchTabelaAndUpdate() {
    const tabela = await ListaPopulacao(Cookies.get("idEdificio"));
    setLista(tabela);
    setTimeout(() => {
      setKeyTabela((oldKey) => oldKey + 1);
      setSalvarClick(false);
    }, 0);
  }

  React.useEffect(() => {
    fetchTabelaAndUpdate();
  }, []);

  React.useEffect(() => {
    fetchTabelaAndUpdate();
  }, [deletarPop, isLoading]);
  //-------------------------------------------------------------

  // Função para tratar a edição de um equipamentos--------------
  function handleEditar(params) {
    setOpenModal(!openModal);
    Cookies.set("idPopulacao", params.id);
    setControleUseEffectPopulacao(!controleUseEffectPopulacao);
  }
  //-------------------------------------------------------------

  // Função para adicionar um nova população
  function handleNew() {
    options();
    setOpenModal(!openModal);
    Cookies.remove("idPopulacao");
    setControleUseEffectPopulacao(!controleUseEffectPopulacao);
  }
  //------------------------------------

  function handleSalvar() {
    setAbrirSnackbar(true);
    setSalvarClick(true);
  }

  function handleVoltar() {
    setOpenModal(!openModal);
    Cookies.remove("idPopulacao");
    setControleUseEffectPopulacao(!controleUseEffectPopulacao);
  }

  // Função assíncrona para excluir um população-----------------
  async function deletar() {
    const response = await DeletarPopulacao(Cookies.get("idPopulacao"));
    setConfirmacao(!openConfirmacao);
    Cookies.remove("idPopulacao");
    setKeyTabela((oldKey) => oldKey + 1);
    setDeletarPop(!deletarPop);
    setTextoMensagem("População excluida!");
  }
  //-------------------------------------------------------------

  // Função para exclusão de um população------------------------
  function handleExcluir(id) {
    setConfirmacao(!openConfirmacao);
    Cookies.set("idPopulacao", id);
  }
  //-------------------------------------------------------------

  // Função para tratar a mudança de valor em campos do formulario
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

  function tiraErroNivel() {
    const erroAtualizado = [...erro];
    var index = erroAtualizado.indexOf("nivel");
    if (index > -1) {
      erroAtualizado.splice(index, 1);
    }
    setErro(erroAtualizado);
  }

  function tiraErroPeriodo() {
    const erroAtualizado = [...erro];
    var index = erroAtualizado.indexOf("periodo");
    if (index > -1) {
      erroAtualizado.splice(index, 1);
    }
    setErro(erroAtualizado);
  }

  const campos = [
    {
      label: "Níveis de Ensino",
      name: "nivel",
      gridColumn: "span 3",
      value: nivel,
      selectUni: opNivelPopulacao,
      onChange: (event) => {
        setNivel(event.target.value);
        tiraErroNivel();
      },
    },
    {
      label: "Período",
      name: "periodo",
      gridColumn: "span 3",
      value: periodo,
      selectUni: ["Manhã", "Tarde", "Noite", "Integral"],
      onChange: (event) => {
        setPeriodo(event.target.value);
        tiraErroPeriodo();
      },
    },
    {
      label: "Quant. de Alunos",
      name: "alunos",
      type: "number",
      gridColumn: "span 3",
      value: dados.alunos,
      onChange: (event) => onChangeGeral(event, "alunos"),
    },
    {
      label: "Quant. de Funcionários",
      name: "funcionarios",
      type: "number",
      gridColumn: "span 3",
      value: dados.funcionarios,
      onChange: (event) => onChangeGeral(event, "funcionarios"),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "2rem",
        }}
      >
        <h2>População</h2>

        <Button type="primary" icon={<PlusOutlined />} onClick={handleNew}>
          Adicionar
        </Button>
      </div>

      {loading ? (
        <Spin>
          <div className="content" />
        </Spin>
      ) : (
        <div style={{ height: "100%" }}>
          <Tabela
            key={keyTabela}
            cabecalho={cabecalho}
            corpo={lista}
            onRowClick={handleEditar}
            excluir={handleExcluir}
          />
        </div>
      )}

      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={[
          <Button key="back" onClick={() => setOpenModal(false)}>
            Voltar
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            onClick={onSubmit}
          >
            Salvar
          </Button>,
        ]}
      >
        <form style={{ padding: "2rem 0 1rem 0" }}>
          <Formulario campos={campos} grid={3} erro={erro} />
        </form>
      </Modal>

      <Mensagem sucesso={!erroMensagem} mensagem={textoMensagem} />
    </>
  );
}

export default Populacao;
