// Imports dos módulos e componentes necessários
import React from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Spin } from "antd";
import Cookies from "js-cookie";
import Mensagem from "../../../../components/Mensagem";
import ListaEdificios from "../../../../services/GET/ListaEdificios";
import Tabela from "../../../../components/Tabela";
import { EdificioContext } from "../../../../common/context/Edificio";
import { useNavigate, useLocation } from "react-router-dom";
import { MensagemContext } from "../../../../common/context/Mensagem";
import DeletarEdificio from "../../../../services/DELETE/DeletarEdificio";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Switch } from "@mui/material";
import AtualizarEdificioPrincipal from "../../../../services/PUT/AtualizarEdificioPrincipal";
//---------------------------------------------------------

export default function TabelaEdificacao() {
  const navigate = useNavigate();
  const [lista, setLista] = React.useState([]);
  const [keyTabela, setKeyTabela] = React.useState(0);
  const [deletarEdificio, setDeletarEdificio] = React.useState(true);
  const [location, setLocation] = React.useState(useLocation());
  const [isLoading, setIsLoading] = React.useState(false);

  // Obtendo os estados e funções do contexto Edifício
  const {
    setcontroleUseEffectEdificio,
    controleUseEffectEdificio,
    setEditar,
    setConfirmacao,
    openConfirmacao,
    setErro,
    edPrincipal,
    setEdPrincipal,
  } = React.useContext(EdificioContext);
  //-------------------------------------------------------

  // Obtendo os estados e funções do contexto Mensagem
  const { erroMensagem, textoMensagem } = React.useContext(MensagemContext);
  //-------------------------------------------------------

  // Função para definir se uma edificação é a principal
  async function definirPrincipal(id, value) {
    const atualizar = await AtualizarEdificioPrincipal({
      id: id,
      principal: value,
    });
  }
  //-------------------------------------------------------

  // Configuração da coluna e ações da tabela
  const cabecalho = [
    { field: "nome", headerName: "Nome do Edifício", flex: 1 },
    { field: "area_umida", headerName: "Áreas Úmidas", flex: 1 },
    { field: "populacao", headerName: "População", flex: 1 },
    {
      field: "principal",
      headerName: "Principal",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Switch
              checked={params.row.principal}
              onChange={() => {
                setEdPrincipal(!edPrincipal);
                definirPrincipal(params.row.id, true);
                fetchTabelaAndUpdate();
                console.log(keyTabela);
              }}
            />
          }
          label="Principal"
        />,
      ],
    },
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
  //-------------------------------------------------------

  // Função assíncrona para buscar a lista de edificações e atualizar o estado local
  async function fetchTabelaAndUpdate() {
    const tabela = await ListaEdificios(Cookies.get("idEscola"));
    setLista(tabela);
    setTimeout(() => {
      setKeyTabela((oldKey) => oldKey + 1);
    }, 0);
  }

  React.useEffect(() => {
    fetchTabelaAndUpdate();
  }, []);
  //-------------------------------------------------------

  // Efeito colateral que é disparado quando a rota muda, deleta um edificio
  React.useEffect(() => {
    fetchTabelaAndUpdate();
  }, [location.pathname, deletarEdificio, edPrincipal]);
  //-------------------------------------------------------

  // Função para tratar a edição de uma edificação
  function handleEditar(params) {
    setcontroleUseEffectEdificio(!controleUseEffectEdificio);
    setErro([]);
    Cookies.set("idEdificio", params.id);
    navigate("/escola/edificacao");
    setEditar(false);
  }
  //-------------------------------------------------------

  // Função para tratar o evento de adicionar uma nova edificação
  function handleNew() {
    setcontroleUseEffectEdificio(!controleUseEffectEdificio);
    setErro([]);
    Cookies.remove("idEdificio");
    navigate("/escola/edificacao");
  }
  //-------------------------------------------------------

  // Função assíncrona para excluir uma edificação
  async function deletar() {
    const response = await DeletarEdificio(Cookies.get("idEdificio"));
    setConfirmacao(!openConfirmacao);
    setDeletarEdificio(!deletarEdificio);
  }
  //-------------------------------------------------------

  // Função para tratar o evento de exclusão de uma edificação
  function handleExcluir(id) {
    setConfirmacao(!openConfirmacao);
    setTimeout(() => {
      setKeyTabela((oldKey) => oldKey + 1);
    }, 0);
    Cookies.set("idEdificio", id);
  }
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
        <h2>Edificações</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleNew}>
          Adicionar
        </Button>
      </div>

      {isLoading ? (
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

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "start",
          gap: "1rem",
        }}
      ></div>

      <Mensagem sucesso={!erroMensagem} mensagem={textoMensagem} />
    </>
  );
}
