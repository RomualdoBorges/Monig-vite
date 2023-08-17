import AtualizarHidrometro from "../../services/PUT/AtualizarHidrometro";
import CadastroHidrometro from "../../services/POST/CadastroHidrometro";
import Cookies from "js-cookie";
import HidrometroCadastrado from "../../services/GET/HidrometroCadastrado";
import { MensagemContext } from "./Mensagem";
import React from "react";
import { object, string } from "yup";

export const HidrometroContext = React.createContext();
HidrometroContext.displayName = "Hidrometro";

export const HidrometroProvider = ({ children }) => {
  const [dados, setDados] = React.useState({
    hidrometro: "",
  });

  // Estados Gerais
  const [openModal, setOpenModal] = React.useState(false);
  const [openConfirmacao, setConfirmacao] = React.useState(false);
  const [recuperar, setRecuperar] = React.useState();
  const [controleUseEffectHidrometro, setControleUseEffectHidrometro] =
    React.useState(true);
  const [editarHidrometro, setEditarHidrometro] = React.useState(true);
  const [erro, setErro] = React.useState(["", ""]);
  const [loading, setLoading] = React.useState(true);

  const { setErroMensagem, setTextoMensagem, setAbrirSnackbar, setSeverity } =
    React.useContext(MensagemContext);

  // RECUPERAR INFORMAÇÕES
  React.useEffect(() => {
    async function RecuperarHidrometro() {
      const idHidrometro = Cookies.get("idHidrometro");
      let response = { status: false };

      try {
        if (idHidrometro !== undefined) {
          response = await HidrometroCadastrado(idHidrometro);
        } else {
          response = { status: false };
        }

        if (response.status) {
          const hidrometro = response.hidrometro;
          setDados((prevDados) => ({
            ...prevDados,
            hidrometro: hidrometro.hidrometro,
          }));
          setEditarHidrometro(false);
        } else {
          setDados((prevDados) => ({
            ...prevDados,
            hidrometro: "",
          }));
          setEditarHidrometro(true);
          setRecuperar(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (controleUseEffectHidrometro) {
      setLoading(true);
      RecuperarHidrometro();
      setControleUseEffectHidrometro(!controleUseEffectHidrometro);
    }
  }, [controleUseEffectHidrometro]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!(await validate())) {
      setLoading(false);
      setTextoMensagem("Falha ao cadastrar: Preencha os campos corretamente!");
      setSeverity("error");
      setErroMensagem(true);
      setAbrirSnackbar(true);
      return;
    }

    setErro("");

    const idEdificio = Cookies.get("idEdificio");
    const idHidrometro = Cookies.get("idHidrometro");

    if (!idHidrometro) {
      const response = await CadastroHidrometro({
        ...dados,
        fk_edificios: idEdificio,
      });

      if (response && response.status) {
        setAbrirSnackbar(true);
        setSeverity("success");
        setTextoMensagem("Cadastro realizado!");
        setOpenModal(false);
        setErroMensagem(false);
        setDados((prevDados) => ({
          ...prevDados,
          hidrometro: response.hidrometro,
        }));
      } else {
        setAbrirSnackbar(true);
        setSeverity("error");
        setTextoMensagem("Cadastro não realizado!");
        setErroMensagem(true);
      }
    } else {
      const response = await AtualizarHidrometro({
        ...dados,
        id: idHidrometro,
        fk_edificios: idEdificio,
      });
      console.log({
        ...dados,
        id: idHidrometro,
        fk_edificios: idEdificio,
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
      hidrometro: string("hidrometro").required("hidrometro"),
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
    <HidrometroContext.Provider
      value={{
        dados,
        setDados,
        openModal,
        setOpenModal,
        onSubmit,
        erro,
        setErro,
        controleUseEffectHidrometro,
        setControleUseEffectHidrometro,
        openConfirmacao,
        setConfirmacao,
        loading,
        setLoading,
      }}
    >
      {children}
    </HidrometroContext.Provider>
  );
};
