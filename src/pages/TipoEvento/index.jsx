import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb, Button, Modal, Popconfirm, Spin } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Tabela from "../../components/Tabela";
import Mensagem from "../../components/Mensagem";
import { MensagemContext } from "../../common/context/Mensagem";
import Formulario from "../../components/Formulario";

const TipoEvento = () => {
  const [loading, setLoading] = useState(true);
  const [keyTabela, setKeyTabela] = useState(0);
  const [lista, setLista] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  // Obtendo os estados e funções do contexto Mensagem------
  const { erroMensagem, textoMensagem, setAbrirSnackbar, setTextoMensagem } =
    useContext(MensagemContext);
  //--------------------------------------------------------

  // Função para criar uma nova escola----------------------
  function handleNew() {
    setOpenModal(!openModal);
    console.log("Novo tipo de Evento");
  }
  //--------------------------------------------------------

  // Configuração da coluna e ações da tabela---------------
  const cabecalho = [
    { field: "tipo", headerName: "Tipo de Evento", flex: 1 },
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
          }}
          okText="Sim"
          cancelText="Cancelar"
        >
          <Button icon={<DeleteOutlined />} />
        </Popconfirm>,
      ],
    },
  ];
  //--------------------------------------------------------

  // Função para lidar com a ação de exclusão na tabela-----
  function handleExcluir() {}
  //--------------------------------------------------------

  // Função assíncrona para exclusão de escola--------------
  async function deletar() {}
  //--------------------------------------------------------

  //// Função para salvar o ID no cookie e navegar para a página de edição
  function handleClickRow() {}
  //--------------------------------------------------------

  // Configurações dos campos do formulário-----------------
  const campos = [];
  //--------------------------------------------------------

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Breadcrumb
        style={{ margin: "1rem 0" }}
        items={[{ title: "Configurações" }, { title: "Tipo de Evento" }]}
      />

      <div style={{ padding: "2rem", minHeight: "80vh", background: "#fff" }}>
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
              <h1>Tipo de Evento</h1>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleNew}
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

      <Modal
        open={openModal}
        onCancel={() => setOpenModal(!openModal)}
        footer={[
          <Button key="back" onClick={() => setOpenModal(!openModal)}>
            Voltar
          </Button>,
          <Button key="submit" type="primary" htmlType="submit">
            Salvar
          </Button>,
        ]}
      >
        <form style={{ padding: "2rem 0 1rem 0" }}>
          <Formulario campos={campos} grid={3} />
        </form>
      </Modal>

      <Mensagem sucesso={!erroMensagem} mensagem={textoMensagem} />
    </>
  );
};

export default TipoEvento;
