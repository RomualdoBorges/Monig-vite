import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Popconfirm, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { ReservatorioContext } from "../../../../common/context/Reservatorio";
import Tabela from "../../../../components/Tabela";
import Cookies from "js-cookie";
import Formulario from "../../../../components/Formulario";
import ListaReservatorio from "../../../../services/GET/ListaReservatorio";
import DeletarReservatorio from "../../../../services/DELETE/DeletarReservatorio";
import { MensagemContext } from "../../../../common/context/Mensagem";
import Mensagem from "../../../../components/Mensagem";

function TabelaReservatorio() {
  const [keyTabela, setKeyTabela] = useState(0);
  const [lista, setLista] = useState([]);
  const [salvarClick, setSalvarClick] = useState(true);

  // Obtendo os estados e funções do cotnexto Reservatório-
  const {
    dados,
    setDados,
    openModal,
    setOpenModal,
    controleUseEffectReservatorio,
    setControleUseEffectReservatorio,
    erro,
    setErro,
    onSubmit,
    loading,
    setLoading,
  } = useContext(ReservatorioContext);
  //-------------------------------------------------------

  // Obtendo os estados e funções do contexto Mensagem-----
  const { setAbrirSnackbar, erroMensagem, textoMensagem } =
    useContext(MensagemContext);
  //-------------------------------------------------------

  // Configuração da coluna e ações da tabela--------------
  const cabecalho = [
    {
      field: "nome_do_reservatorio",
      headerName: "Nome do Reservatório",
      flex: 1,
    },
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
  //-------------------------------------------------------

  // Função assíncrona para buscar a lista de reservatórios e atualizar o estado local
  async function fetchTabelaAndUpdate() {
    const tabela = await ListaReservatorio(Cookies.get("idEscola"));
    setLista(tabela);
    setTimeout(() => {
      setKeyTabela((oldKey) => oldKey + 1);
      setSalvarClick(false);
    }, 0);
  }
  //-------------------------------------------------------

  // Efeito colateral que é disparado apenas uma vez quando o componente é montado
  useEffect(() => {
    fetchTabelaAndUpdate();
  }, []);
  //-------------------------------------------------------

  // Função para tratar a edição de um reservatório--------
  function handleEditar(params) {
    setOpenModal(!openModal);
    setErro([]);

    setControleUseEffectReservatorio(!controleUseEffectReservatorio);
    Cookies.set("idReservatorio", params.id);
  }
  //-------------------------------------------------------

  // Função para adicionar um novo Reservatório------------
  function handleNew() {
    setControleUseEffectReservatorio(!controleUseEffectReservatorio);
    setOpenModal(() => setOpenModal(true));
    setErro([]);
    Cookies.remove("idReservatorio");
  }
  //-------------------------------------------------------

  // Função assíncrona para excluir um reservatório--------
  async function deletar() {
    const remove = await DeletarReservatorio(Cookies.get("idReservatorio"));
    Cookies.remove("idReservatorio");
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }
  //-------------------------------------------------------

  // Efeito colateral que é disparado apenas quando deleta reservatório
  useEffect(() => {
    fetchTabelaAndUpdate();
  }, [loading]);
  //-------------------------------------------------------

  // Função para exclusão de um Reservatório---------------
  function handleExcluir(id) {
    setTimeout(() => {
      setKeyTabela((oldKey) => oldKey + 1);
    }, 0);

    Cookies.set("idReservatorio", id);
  }
  //-------------------------------------------------------

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
  //-------------------------------------------------------

  // Configuração dos campos do formulário-----------------
  const campos = [
    {
      label: "Nome do Reservatório",
      name: "nome",
      gridColumn: "span 8",
      value: dados.nome,
      onChange: (event) => onChangeGeral(event, "nome"),
    },
  ];
  //-------------------------------------------------------

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
        <h2>Reservatórios</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleNew}>
          Adicionar
        </Button>
      </div>

      {loading ? (
        <Spin size="large" style={{ paddingTop: "5rem" }}>
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
          <Formulario campos={campos} grid={8} erro={erro} />
        </form>
      </Modal>

      <Mensagem sucesso={!erroMensagem} mensagem={textoMensagem} />
    </>
  );
}

export default TabelaReservatorio;
