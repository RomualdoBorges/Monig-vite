import React from "react";
import { MensagemContext } from "./Mensagem";
import { object, string } from "yup";
import Cookies from "js-cookie";
import CadastroReservatorio from "../../services/POST/CadastroReservatorio";
import ReservatorioCadastrado from "../../services/GET/ReservatorioCadastrado";
import AtualizarReservatorio from "../../services/PUT/AtualizarReservatorio";

export const ReservatorioContext = React.createContext();
ReservatorioContext.displayName = "Reservatorio";

export const ReservatorioProvider = ({ children }) => {
  const [dados, setDados] = React.useState({
    nome: "",
  });

  //Estados Gerais
  const [erro, setErro] = React.useState(["", ""]);
  const [enviado, setEnviado] = React.useState(false);
  const [editar, setEditar] = React.useState(
    Cookies.get("idEdificio") ? false : true
  );
  const [openConfirmacao, setConfirmacao] = React.useState(false);
  const [controleUseEffectReservatorio, setControleUseEffectReservatorio] =
    React.useState(true);
  const [openModal, setOpenModal] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const { setErroMensagem, setTextoMensagem, setAbrirSnackbar, setSeverity } =
    React.useContext(MensagemContext);

  // RECUPERAR INFORMAÇÕES
  React.useEffect(() => {
    async function RecuperarReservatorio() {
      const idReservatorio = Cookies.get("idReservatorio");
      let response = { status: false };

      try {
        if (!!idReservatorio) {
          response = await ReservatorioCadastrado(idReservatorio);
        } else {
          response = { status: false };
        }
        //Estados
        if (response.status) {
          const reservatorio = response.reservatorio;
          setDados((prevDados) => ({
            ...prevDados,
            nome: reservatorio.nome_do_reservatorio,
          }));
          setEditar(false);
          setEnviado(true);
        } else {
          setDados((prevDados) => ({
            ...prevDados,
            nome: "",
          }));
          setEditar(true);
          setEnviado(false);
        }
      } catch (error) {
        console.error("Erro ao recuperar o reservatório:", error);
      } finally {
        setLoading(false);
      }
    }

    if (controleUseEffectReservatorio) {
      setLoading(true);
      RecuperarReservatorio();
      setControleUseEffectReservatorio(false);
    }
  }, [controleUseEffectReservatorio]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!(await validate())) {
      setLoading(false);
      setAbrirSnackbar(true);
      setSeverity("error");
      setTextoMensagem("Falha ao cadastrar: Preencha os campos corretamente!");
      return;
    }

    setErro("");

    const idEscola = Cookies.get("idEscola");
    const idReservatorio = Cookies.get("idReservatorio");

    if (!idReservatorio) {
      const response = await CadastroReservatorio({
        ...dados,
        fk_escola: idEscola,
      });

      if (response && response.status) {
        setOpenModal(false);
        // setErroMensagem(false);
        setAbrirSnackbar(true);
        setSeverity("success");
        setTextoMensagem("Cadastro realizado!");
        setDados((prevDados) => ({
          ...prevDados,
          nome: response.nome_do_reservatorio,
        }));
      } else {
        setAbrirSnackbar(true);
        setSeverity("error");
        setTextoMensagem("Cadastro não realizado");
        // setErroMensagem(true);
      }
    } else {
      const response = await AtualizarReservatorio({
        ...dados,
        id: idReservatorio,
        fk_escola: idEscola,
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
    setLoading(false);
  };

  async function validate() {
    let schema = object({
      nome: string("nome").required("nome"),
    });

    try {
      await schema.validate(dados, { abortEarly: false });
      return true;
    } catch (err) {
      setErro(err.errors);
      return false;
    }
  }

  return (
    <ReservatorioContext.Provider
      value={{
        dados,
        setDados,
        openModal,
        setOpenModal,
        openConfirmacao,
        setConfirmacao,
        controleUseEffectReservatorio,
        setControleUseEffectReservatorio,
        erro,
        setErro,
        onSubmit,
        enviado,
        setEnviado,
        editar,
        setEditar,
        loading,
        setLoading,
      }}
    >
      {children}
    </ReservatorioContext.Provider>
  );
};
