import React from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Spin } from "antd";
import Tabela from "../../../../components/Tabela";
import { useNavigate } from "react-router-dom";
import { AreaUmidaContext } from "../../../../common/context/AreaUmida";
import Mensagem from "../../../../components/Mensagem";
import ListaAreaUmida from "../../../../services/GET/ListaAreaUmida";
import DeletarAreaUmida from "../../../../services/DELETE/DeletarAreaUmida";
import Cookies from "js-cookie";

function TabelaAreaUmida() {
  const navigate = useNavigate();
  const [lista, setLista] = React.useState([]);
  const [keyTabela, setKeyTabela] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [deletarAu, setDeletarAu] = React.useState(true);

  const {
    setEditarAreaUmida,
    setControleUseEffectAreaUmida,
    setErro,
    openConfirmacao,
    setConfirmacao,
    handleClickSalvar,
    setHandClickSalvar,
    loading,
    setLoading,
  } = React.useContext(AreaUmidaContext);

  const cabecalho = [
    { field: "tipo_area_umida", headerName: "Tipo", flex: 1 },
    {
      field: "quant_equipamentos",
      headerName: "Quantidade de Equipamentos",
      flex: 1,
    },
    { field: "status", headerName: "Status", flex: 1 },

    {
      field: "actions",
      headerName: "Ações",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <Popconfirm
          placement="leftTop"
          title="Tem certeza que deseja excluir"
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

  async function fetchTabelaAndUpdate() {
    const tabela = await ListaAreaUmida(Cookies.get("idEdificio"));
    setLista(tabela);
    setTimeout(() => {
      setKeyTabela((oldKey) => oldKey + 1);
    }, 0);
    setIsLoading(false);
    setLoading(false);
  }

  React.useEffect(() => {
    fetchTabelaAndUpdate();
  }, []);

  React.useEffect(() => {
    fetchTabelaAndUpdate();
  }, [deletarAu, loading]);

  function handleEditar(params) {
    navigate("/edificacao/area-umida");
    Cookies.set("idAreaUmida", params.id);
    setControleUseEffectAreaUmida(true);
    setEditarAreaUmida(false);
  }

  function handleAdicionar() {
    navigate("/edificacao/area-umida");
    Cookies.remove("idAreaUmida");
    // setControleUseEffectAreaUmida(true);
    setErro([]);
  }

  async function deletar() {
    const response = await DeletarAreaUmida(Cookies.get("idAreaUmida"));
    setConfirmacao(!openConfirmacao);
    setKeyTabela((oldKey) => oldKey + 1);
    setIsLoading(true);
    setLoading(true);
    setDeletarAu(!deletarAu);
  }

  function handleExcluir(id) {
    setConfirmacao(!openConfirmacao);
    Cookies.set("idAreaUmida", id);
  }

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
        <h2>Área Úmida</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdicionar}
        >
          Adicionar
        </Button>
      </div>

      {isLoading ? (
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

      <Mensagem />
    </>
  );
}

export default TabelaAreaUmida;
