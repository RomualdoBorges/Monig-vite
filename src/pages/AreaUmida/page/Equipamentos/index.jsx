import React from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Popconfirm, Spin } from "antd";
import { EquipamentosContext } from "../../../../common/context/Equipamentos";
import { MensagemContext } from "../../../../common/context/Mensagem";
import Tabela from "../../../../components/Tabela";
import Formulario from "../../../../components/Formulario";
import Mensagem from "../../../../components/Mensagem";
import Cookies from "js-cookie";
import OpEquipamentos from "../../../../services/GET/options/OpEquipamentos";
import ListaEquipamentos from "../../../../services/GET/ListaEquipamentos";
import DeletarEquipamentos from "../../../../services/DELETE/DeletarEquipamento";

function Equipamentos() {
  const [salvarClick, setSalvarClick] = React.useState(true);
  const [keyTabela, setKeyTabela] = React.useState(0);
  const [lista, setLista] = React.useState([]);
  const [opequipamentos, setOpEquipamentos] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [deletarEquip, setDeletarEquip] = React.useState(true);

  // Obtendo os estados e funções do cotnexto Equipamentos
  const {
    tipo,
    setTipo,
    descricao,
    setDescricao,
    openModal,
    setOpenModal,
    onSubmit,
    setControleUseEffectEquipamento,
    controleUseEffectEquipamento,
    dados,
    setDados,
    erro,
    setErro,
    setEnviado,
    openConfirmacao,
    setConfirmacao,
    isLoading,
    setIsLoading,
  } = React.useContext(EquipamentosContext);
  //-------------------------------------------------------------

  // Obtendo os estados e funções do contexto Mensagem
  const { setAbrirSnackbar, erroMensagem, textoMensagem } =
    React.useContext(MensagemContext);
  //-------------------------------------------------------------

  // Configuração da coluna e ações da tabela
  const cabecalho = [
    { field: "tipo_equipamento", headerName: "Tipo", flex: 1 },
    { field: "quantTotal", headerName: "Quantidade Total", flex: 1 },
    { field: "quantProblema", headerName: "Quantidade Problema", flex: 1 },
    { field: "quantInutil", headerName: "Quantidade Inutilizada", flex: 1 },
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

  //Carregar as opções de Tipo e Operação da Área Úmida
  async function options() {
    const responseEquipamentos = await OpEquipamentos(
      Cookies.get("idAreaUmida")
    );
    setOpEquipamentos(responseEquipamentos.tipoequipamentos);
  }

  React.useEffect(() => {
    options();
  }, [opequipamentos]);
  //-------------------------------------------------------------

  // Função assíncrona para buscar a lista de reservatórios e atualizar o estado local
  async function fetchTabelaAndUpdate() {
    const tabela = await ListaEquipamentos(Cookies.get("idAreaUmida"));
    setLista(tabela);
    setTimeout(() => {
      setKeyTabela((oldKey) => oldKey + 1);
      setSalvarClick(false);
    }, 0);
    setLoading(false);
    setIsLoading(false);
  }

  React.useEffect(() => {
    fetchTabelaAndUpdate();
  }, []);

  React.useEffect(() => {
    fetchTabelaAndUpdate();
  }, [deletarEquip, isLoading]);
  //-------------------------------------------------------------

  // Função para tratar a edição de um reservatório
  function handleEditar(params) {
    Cookies.set("idEquipamento", params.id);
    setControleUseEffectEquipamento(!controleUseEffectEquipamento);
    setOpenModal(!openModal);
  }
  //-------------------------------------------------------------

  //-------------------------------------------------------------
  function handleVoltar() {
    fetchTabelaAndUpdate();
    Cookies.remove("idEquipamento");
    setControleUseEffectEquipamento(!controleUseEffectEquipamento);
    setOpenModal(!openModal);
  }
  //-------------------------------------------------------------

  //Função para adicionar um novo Reservatório
  function handleNew() {
    options();
    setOpenModal(!openModal);
    Cookies.remove("idEquipamento");
    setControleUseEffectEquipamento(!controleUseEffectEquipamento);
  }
  //-------------------------------------------------------------

  //-------------------------------------------------------------
  function handleSalvar() {
    fetchTabelaAndUpdate();
    setSalvarClick(true);
    setAbrirSnackbar(true);
    setControleUseEffectEquipamento(!controleUseEffectEquipamento);
  }
  //-------------------------------------------------------------

  //Função assíncrona para excluir um reservatório
  async function deletar() {
    const response = await DeletarEquipamentos(Cookies.get("idEquipamento"));
    fetchTabelaAndUpdate();
    setConfirmacao(!openConfirmacao);
    setDeletarEquip(!deletarEquip);
  }
  //-------------------------------------------------------------

  //Função para exclusão de um Reservatório
  function handleExcluir(id) {
    setConfirmacao(!openConfirmacao);
    Cookies.set("idEquipamento", id);
  }
  //-------------------------------------------------------------

  //-------------------------------------------------------------
  function cancelarExclusao() {
    setConfirmacao(!openConfirmacao);
    fetchTabelaAndUpdate();
  }
  //-------------------------------------------------------------

  //Função para tratar a mudança de valor em campos do formulario
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

  //-------------------------------------------------------------
  function tiraErroTipo() {
    const erroAtualizado = [...erro];
    var index = erroAtualizado.indexOf("tipo");
    if (index > -1) {
      erroAtualizado.splice(index, 1);
    }
    setErro(erroAtualizado);
  }
  //-------------------------------------------------------------

  //Configuração dos campos do formulário
  const campos = [
    {
      label: "Tipo",
      name: "tipo",
      gridColumn: "span 3",
      value: tipo,
      selectUni: opequipamentos,
      onChange: (event) => {
        setTipo(event.target.value);
        tiraErroTipo();
      },
    },
    {
      label: "Quant. Total",
      name: "quantTotal",
      type: "number",
      gridColumn: "span 3",
      value: dados.quantTotal,
      onChange: (event) => onChangeGeral(event, "quantTotal"),
    },
    {
      label: "Quant. com Problema",
      name: "quantProblema",
      type: "number",
      gridColumn: "span 3",
      value: dados.quantProblema,
      onChange: (event) => onChangeGeral(event, "quantProblema"),
    },
    {
      label: "Quant. Inutilizadas",
      name: "quantInutil",
      type: "number",
      gridColumn: "span 3",
      value: dados.quantInutil,
      onChange: (event) => onChangeGeral(event, "quantInutil"),
    },
  ];
  //-------------------------------------------------------------
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
        <h2>Equipamentos</h2>

        <Button type="primary" icon={<PlusOutlined />} onClick={handleNew}>
          Adicionar
        </Button>
      </div>

      {isLoading ? (
        <Spin>
          <div className="content" />
        </Spin>
      ) : (
        <Tabela
          key={keyTabela}
          cabecalho={cabecalho}
          corpo={lista}
          onRowClick={handleEditar}
          excluir={handleExcluir}
        />
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

export default Equipamentos;
