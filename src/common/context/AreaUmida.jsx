import AtualizarAreaUmida from "../../services/PUT/AtualizarAreaUmida";
import AreaUmidaCadastrada from "../../services/GET/AreaUmidaCadastrada";
import React from "react";
import Cookies from "js-cookie";
import CadastroAreaUmida from "../../services/POST/CadastroAreaUmida";
import { MensagemContext } from "./Mensagem";
import { object, string } from "yup";
import { useNavigate } from "react-router-dom";

export const AreaUmidaContext = React.createContext();
AreaUmidaContext.displayName = "Area Umida";

export const AreaUmidaProvider = ({ children }) => {
  const [dados, setDados] = React.useState({
    nome_area_umida: "",
    localizacao_area_umida: "",
  });

  const [tipo_area_umida, setTipoAreaUmida] = React.useState();
  const [status_area_umida, setStatus] = React.useState("");
  const [operacao_area_umida, setOperacao] = React.useState();

  // Estados dos Botões
  const [enviado, setEnviado] = React.useState(false);
  const [editarAreaUmida, setEditarAreaUmida] = React.useState(true);
  const [controleUseEffectAreaUmida, setControleUseEffectAreaUmida] =
    React.useState(true);
  const [recuperar, setRecuperar] = React.useState();
  const [erro, setErro] = React.useState(["", ""]);
  const [handleClickSalvar, setHandClickSalvar] = React.useState(true);
  const [openConfirmacao, setConfirmacao] = React.useState(false);

  // Estados dos Loading
  const [loading, setLoading] = React.useState(true);

  const navigate = useNavigate();

  const {
    setErroMensagem,
    setTextoMensagem,
    setAbrirSnackbar,
    erroMensagem,
    textoMensagem,
    setSeverity,
  } = React.useContext(MensagemContext);

  //RECUPERAR INFORMAÇÕES
  React.useEffect(() => {
    async function RecuperarAreaUmida() {
      const idAreaUmida = Cookies.get("idAreaUmida");
      let response = { status: false };

      try {
        if (idAreaUmida !== undefined) {
          response = await AreaUmidaCadastrada(idAreaUmida);
        } else {
          response = { status: false };
        }

        if (response.status) {
          const areaUmida = response.area_umida;
          setDados((prevDados) => ({
            ...prevDados,
            nome_area_umida: areaUmida.nome_area_umida,
            localizacao_area_umida: areaUmida.localizacao_area_umida,
          }));
          if (areaUmida.status_area_umida) {
            setStatus("Aberto");
          } else {
            setStatus("Fechado");
          }

          setOperacao(areaUmida.operacao_area_umida);
          setTipoAreaUmida(areaUmida.tipo_area_umida);
          setEditarAreaUmida(false);
          setEnviado(true);
        } else {
          setDados((prevDados) => ({
            ...prevDados,
            localizacao_area_umida: "",
            nome_area_umida: "",
          }));
          setStatus("");
          setOperacao("");
          setTipoAreaUmida("");
          setEditarAreaUmida(true);
          setEnviado(false);
        }
      } catch (error) {
        console.error("Erro ao recuperar o reservatório:", error);
      } finally {
        setLoading(false);
      }
    }

    if (controleUseEffectAreaUmida) {
      setLoading(true);
      RecuperarAreaUmida();
      setControleUseEffectAreaUmida(false);
    }
  }, [controleUseEffectAreaUmida]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!(await validate())) {
      setLoading(false);
      setTextoMensagem("Falha ao cadastrar: Preencha os campos corretamente!");
      setSeverity("error");
      setAbrirSnackbar(true);
      return;
    }

    setErro("");

    const idEdificio = Cookies.get("idEdificio");
    const idAreaUmida = Cookies.get("idAreaUmida");
    if (!idAreaUmida) {
      const response = await CadastroAreaUmida({
        ...dados,
        fk_edificios: idEdificio,
        status_area_umida: status_area_umida,
        operacao_area_umida: operacao_area_umida,
        tipo_area_umida: tipo_area_umida,
      });

      if (response && response.status) {
        Cookies.set("idAreaUmida", response.id);
        setEnviado(true);
        setHandClickSalvar(true);
        setAbrirSnackbar(true);
        setSeverity("success");
        setTextoMensagem("Cadastro realizado!");
        setEditarAreaUmida(false);
        setErroMensagem(false);
      } else {
        setAbrirSnackbar(true);
        setSeverity("error");
        setTextoMensagem("Cadastro não realizado!");
        setErroMensagem(true);
      }
    } else {
      const response = await AtualizarAreaUmida({
        ...dados,
        fk_edificios: idEdificio,
        status_area_umida: status_area_umida,
        operacao_area_umida: operacao_area_umida,
        tipo_area_umida: tipo_area_umida,
      });

      if (response && response.status) {
        setEditarAreaUmida(false);
        setAbrirSnackbar(true);
        setErroMensagem(false);
        setSeverity("success");
        setTextoMensagem("Cadastro atualizado!");
        setHandClickSalvar(true);
      } else {
        setAbrirSnackbar(true);
        setErroMensagem(true);
        setSeverity("error");
        setTextoMensagem("Cadastro não realizado!");
      }
    }
    setLoading(false);
  };

  async function validate() {
    let schema = object({
      localizacao_area_umida: string("localizacao_area_umida").required(
        "localizacao_area_umida"
      ),
      nome_area_umida: string("nome_area_umida").required("nome_area_umida"),
    });

    try {
      await schema.validate(dados, { abortEarly: false });
      if (
        tipo_area_umida.length === 0 &&
        status_area_umida.length === 0 &&
        operacao_area_umida.length
      ) {
        setErro(["tipo_area_umida"]);
        setErro(["status_area_umida"]);
        setErro(["operacao_area_umida"]);
        return false;
      } else if (
        tipo_area_umida.length === 0 &&
        status_area_umida.length !== 0 &&
        operacao_area_umida !== 0
      ) {
        setErro(["tipo_area_umida"]);
        return false;
      } else if (
        tipo_area_umida.length !== 0 &&
        status_area_umida.length === 0 &&
        operacao_area_umida !== 0
      ) {
        setErro(["status_area_umida"]);
        return false;
      } else if (
        tipo_area_umida.length !== 0 &&
        status_area_umida.length !== 0 &&
        operacao_area_umida === 0
      ) {
        setErro(["operacao_area_umida"]);
        return false;
      } else {
        return true;
      }
      // return true
    } catch (err) {
      setErro(err.errors);
      if (
        tipo_area_umida.length === 0 &&
        status_area_umida.length === 0 &&
        operacao_area_umida === 0
      ) {
        setErro([
          ...err.errors,
          "tipo_area_umida",
          "status_area_umida",
          "operacao_area_umida",
        ]);
        return false;
      } else if (
        tipo_area_umida.length === 0 &&
        status_area_umida.length !== 0 &&
        operacao_area_umida !== 0
      ) {
        setErro([...err.errors, "tipo_area_umida"]);
        return false;
      } else if (
        tipo_area_umida.length !== 0 &&
        status_area_umida.length === 0 &&
        operacao_area_umida !== 0
      ) {
        setErro([...err.errors, "status_area_umida"]);
        return false;
      } else if (
        tipo_area_umida.length !== 0 &&
        status_area_umida.length !== 0 &&
        operacao_area_umida === 0
      ) {
        setErro([...err.errors, "operacao_area_umida"]);
        return false;
      }
    }
  }

  return (
    <AreaUmidaContext.Provider
      value={{
        enviado,
        dados,
        setDados,
        tipo_area_umida,
        setTipoAreaUmida,
        status_area_umida,
        setStatus,
        operacao_area_umida,
        setOperacao,
        setEnviado,
        editarAreaUmida,
        setEditarAreaUmida,
        onSubmit,
        controleUseEffectAreaUmida,
        setControleUseEffectAreaUmida,
        erro,
        setErro,
        erroMensagem,
        textoMensagem,
        openConfirmacao,
        handleClickSalvar,
        setHandClickSalvar,
        setConfirmacao,
        loading,
        setLoading,
      }}
    >
      {children}
    </AreaUmidaContext.Provider>
  );
};
