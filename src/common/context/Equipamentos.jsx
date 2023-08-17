import AtualizarEquipamento from "../../services/PUT/AtualizarEquipamento";
import Cookies from "js-cookie";
import CadastroEquipamento from "../../services/POST/CadastroEquipamento";
import EquipamentoCadastrado from "../../services/GET/EquipamentoCadastrado";
import { MensagemContext } from "./Mensagem";
import React from "react";
import { object, string } from "yup";

export const EquipamentosContext = React.createContext();
EquipamentosContext.displayName = "Equipamentos";

export const EquipamentosProvider = ({ children }) => {
  const [dados, setDados] = React.useState({
    quantTotal: "",
    quantProblema: "",
    quantInutil: "",
  });
  const [tipo, setTipo] = React.useState([]);
  //const [descricao, setDescricao] = React.useState([])

  // Estados Gerais
  const [openModal, setOpenModal] = React.useState(false);
  const [recuperar, setRecuperar] = React.useState();
  const [controleUseEffectEquipamento, setControleUseEffectEquipamento] =
    React.useState(true);
  const [editar, setEditar] = React.useState(true);
  const [openConfirmacao, setConfirmacao] = React.useState(false);
  const [erro, setErro] = React.useState(["", ""]);
  const [enviado, setEnviado] = React.useState(false);
  const { setErroMensagem, setTextoMensagem, setAbrirSnackbar, setSeverity } =
    React.useContext(MensagemContext);
  const [isLoading, setIsLoading] = React.useState(true);

  // RECUPERAR INFORMAÇÕES
  React.useEffect(() => {
    async function RecuperarEquipamento() {
      const idEquipamento = Cookies.get("idEquipamento");
      let response = { status: false };

      try {
        if (!!idEquipamento) {
          response = await EquipamentoCadastrado(idEquipamento);
        } else {
          response = { status: false };
        }

        if (!!response && response.status) {
          const equipamento = response.equipamento;
          setDados((prevDados) => ({
            ...prevDados,
            quantTotal: equipamento.quantTotal,
            quantProblema: equipamento.quantProblema,
            quantInutil: equipamento.quantInutil,
          }));
          setTipo(equipamento.tipo_equipamento);
          //setDescricao(equipamento.descricao_equipamento)
        } else {
          setTipo([]);
          setDados((prevDados) => ({
            ...prevDados,
            quantTotal: "",
            quantProblema: "",
            quantInutil: "",
          }));
          //setDescricao("")
          setTipo("");
          setEditar(true);
          setControleUseEffectEquipamento(false);
          setRecuperar(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (controleUseEffectEquipamento) {
      RecuperarEquipamento();
      setEditar(true);
      setControleUseEffectEquipamento(false);
    }
  }, [controleUseEffectEquipamento]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!(await validate())) {
      setIsLoading(false);
      setTextoMensagem("Falha ao cadastrar: Preencha os campos corretamente!");
      setSeverity("error");
      setErroMensagem(true);
      setAbrirSnackbar(true);
      return;
    }

    setErro("");

    const idAreaUmida = Cookies.get("idAreaUmida");
    const idEquipamento = Cookies.get("idEquipamento");

    if (!idEquipamento) {
      const response = await CadastroEquipamento({
        ...dados,
        fk_area_umida: idAreaUmida,
        tipo_equipamento: tipo,
        // descricao_equipamento: descricao
      });

      if (response && response.status) {
        setAbrirSnackbar(true);
        setSeverity("success");
        setTextoMensagem("Cadastro realizado!");
        setOpenModal(false);
        setErroMensagem(false);
        setTipo([]);
        //setDescricao([])
        setDados((prevDados) => ({
          ...prevDados,
          quantTotal: "",
          quantProblema: "",
          quantInutil: "",
        }));
      } else {
        setAbrirSnackbar(true);
        setSeverity("error");
        setTextoMensagem("Cadastro não realizado!");
        setErroMensagem(true);
      }
    } else {
      console.log({
        ...dados,
        id: idEquipamento,
        fk_area_umida: idAreaUmida,
        tipo_equipamento: tipo,
      });
      const response = await AtualizarEquipamento({
        ...dados,
        id: idEquipamento,
        fk_area_umida: idAreaUmida,
        tipo_equipamento: tipo,
        //descricao_equipamento: descricao
      });

      if (response && response.status) {
        setAbrirSnackbar(true);
        setErroMensagem(false);
        setSeverity("success");
        setTextoMensagem("Cadastro atualizado!");
        setOpenModal(false);
      } else {
        setAbrirSnackbar(true);
        setErroMensagem(true);
        setSeverity("error");
        setTextoMensagem("Cadastro não atualizado!");
      }
    }
    setIsLoading(false);
  };

  async function validate() {
    let schema = object({
      quantTotal: string("quantTotal").required("quantTotal"),
    });

    try {
      await schema.validate(dados, { abortEarly: false });
      if (tipo.length === 0) {
        setErro(["tipo"]);
        return false;
      } else {
        return true;
      }
    } catch (err) {
      setErro(err.errors);
      if (tipo.length === 0) setErro([...err.errors, "tipo"]);
      return false;
    }
  }

  return (
    <EquipamentosContext.Provider
      value={{
        tipo,
        setTipo,
        //descricao,
        //setDescricao,
        openModal,
        setOpenModal,
        onSubmit,
        controleUseEffectEquipamento,
        setControleUseEffectEquipamento,
        erro,
        setErro,
        dados,
        setDados,
        editar,
        setEnviado,
        openConfirmacao,
        setConfirmacao,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </EquipamentosContext.Provider>
  );
};
