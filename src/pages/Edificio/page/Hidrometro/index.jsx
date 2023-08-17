import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Popconfirm, Spin } from "antd";
import React from "react";
import Tabela from "../../../../components/Tabela";
import Formulario from "../../../../components/Formulario";
import Mensagem from "../../../../components/Mensagem";
import { HidrometroContext } from "../../../../common/context/Hidrometro";
import { MensagemContext } from "../../../../common/context/Mensagem";
import ListaHidrometro from "../../../../services/GET/ListaHidrometro";
import Cookies from "js-cookie";
import DeletarHidrometro from "../../../../services/DELETE/DeletarHidrometro";

function Hidrometro() {
  const [salvarClick, setSalvarClick] = React.useState(true);
  const [keyTabela, setKeyTabela] = React.useState(0);
  const [lista, setLista] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deletarHidro, setDeletarHidro] = React.useState(true);

  const {
    dados,
    setDados,
    openModal,
    setOpenModal,
    onSubmit,
    erro,
    setErro,
    openConfirmacao,
    setConfirmacao,
    controleUseEffectHidrometro,
    setControleUseEffectHidrometro,
    loading,
    setLoading,
  } = React.useContext(HidrometroContext);

  const { setAbrirSnackbar, erroMensagem, textoMensagem, setTextoMensagem } =
    React.useContext(MensagemContext);

  // Configuração da coluna e ações da tabela
  const cabecalho = [
    { field: "hidrometro", headerName: "Hidrômetro", flex: 1 },
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
            deletarHidrometro();
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
  //----------------------

  //
  async function fetchTabelaAndUpdate() {
    const tabela = await ListaHidrometro(Cookies.get("idEdificio"));
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
  }, [deletarHidro, loading]);
  //-------------------------------

  //
  function handleNew() {
    Cookies.remove("idHidrometro");
    setControleUseEffectHidrometro(!controleUseEffectHidrometro);
    setOpenModal(!openModal);
    setErro([]);
  }
  //------------------

  //
  async function deletarHidrometro() {
    const response = await DeletarHidrometro(Cookies.get("idHidrometro"));
    setConfirmacao(!openConfirmacao);
    Cookies.remove("idHidrometro");
    setKeyTabela((oldKey) => oldKey + 1);
    setDeletarHidro(!deletarHidro);
    setTextoMensagem("Hidrômetro excluido!");
  }
  //-----------------------------

  //
  function handleExcluir(id) {
    setConfirmacao(!openConfirmacao);
    Cookies.set("idHidrometro", id);
  }
  //------------------------

  //
  function onChangeGeral(event, campo) {
    const erroAtualizado = [...erro];
    var index = erroAtualizado.indexOf(campo);
    if (index > -1) {
      erroAtualizado.splice(index, 1);
    }
    setErro(erroAtualizado);
    setDados({ ...dados, [campo]: event.target.value });
  }
  //----------------------

  //
  function handleEditar(params) {
    setErro([]);
    setControleUseEffectHidrometro(true);
    setOpenModal(!openModal);
    Cookies.set("idHidrometro", params.id);
  }
  //------------------------

  //
  const campos = [
    {
      label: "Hidrômetro",
      name: "hidrometro",
      gridColumn: "span 12",
      value: dados.hidrometro,
      onChange: (event) => onChangeGeral(event, "hidrometro"),
    },
  ];
  //-------------------------------------

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
        <h2>Hidrômetro</h2>
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

export default Hidrometro;
