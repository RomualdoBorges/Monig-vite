import AtualizacaoPopulacao from "../../services/PUT/AtualizarPopulacao";
import CadastroPopulacao from "../../services/POST/CadastroPopulacao";
import Cookies from "js-cookie";
import PopulacaoCadastrada from "../../services/GET/PopulacaoCadastrada";
import { MensagemContext } from "./Mensagem";
import React from "react";
import { object, setLocale, string } from "yup";

export const PopulacaoContext = React.createContext();
PopulacaoContext.displayName = "Populacao";

export const PopulacaoProvider = ({ children }) => {
  const [dados, setDados] = React.useState({
    alunos: "",
    funcionarios: "",
  });
  const [nivel, setNivel] = React.useState([]);
  const [periodo, setPeriodo] = React.useState([]);

  // Estados Gerais
  const [openModal, setOpenModal] = React.useState(false);
  const [openConfirmacao, setConfirmacao] = React.useState(false);
  const [recuperar, setRecuperar] = React.useState();
  const [controleUseEffectPopulacao, setControleUseEffectPopulacao] =
    React.useState(true);
  const [editarPopulacao, setEditarPopulacao] = React.useState(true);
  const [erro, setErro] = React.useState(["", ""]);
  const [isLoading, setIsLoading] = React.useState(true);

  const { setErroMensagem, setTextoMensagem, setAbrirSnackbar, setSeverity } =
    React.useContext(MensagemContext);

  // RECUPERAR INFORMAÇÕES
  React.useEffect(() => {
    const idPopulacao = Cookies.get("idPopulacao");

    async function RecuperarPopulacao() {
      try {
        setIsLoading(true);
        const populacao = await PopulacaoCadastrada(idPopulacao);
        setDados((prevDados) => ({
          ...prevDados,
          alunos: populacao.alunos,
          funcionarios: populacao.funcionarios,
        }));
        setNivel(populacao.nivel);
        setPeriodo(populacao.periodo);
      } catch (error) {
        console.error("Erro ao recuperar a população:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (idPopulacao !== undefined && controleUseEffectPopulacao) {
      RecuperarPopulacao();
      setRecuperar(RecuperarPopulacao);
      setEditarPopulacao(true);
      setControleUseEffectPopulacao(false);
    } else if (idPopulacao === undefined && controleUseEffectPopulacao) {
      setNivel([]);
      setPeriodo([]);
      setDados((prevDados) => ({
        ...prevDados,
        alunos: "",
        funcionarios: "",
      }));
      setEditarPopulacao(true);
      setControleUseEffectPopulacao(false);
      setRecuperar(null);
    }
  }, [controleUseEffectPopulacao, recuperar]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!(await validate())) {
      setIsLoading(false);
      setTextoMensagem("Falha ao cadastrar: Preencha os campos corretamente!");
      setSeverity("error");
      setAbrirSnackbar(true);
      setErroMensagem(true);
      return;
    }

    setErro("");

    const idEdificio = Cookies.get("idEdificio");
    const idPopulacao = Cookies.get("idPopulacao");

    if (!idPopulacao) {
      const response = await CadastroPopulacao({
        ...dados,
        fk_edificios: idEdificio,
        nivel: nivel,
        periodo: periodo,
      });

      if (response && response.status) {
        setOpenModal(false);
        setErroMensagem(false);
        setNivel([]);
        setPeriodo([]);
        setAbrirSnackbar(true);
        setSeverity("success");
        setTextoMensagem("Cadastro realizado!");
        setDados((prevDados) => ({
          ...prevDados,
          alunos: "",
          funcionarios: "",
        }));
      } else {
        setAbrirSnackbar(true);
        setSeverity("error");
        setTextoMensagem("Cadastro não realizado!");
        setErroMensagem(true);
      }
    } else {
      const response = await AtualizacaoPopulacao({
        ...dados,
        id: idPopulacao,
        fk_edificios: idEdificio,
        nivel: nivel,
        periodo: periodo,
      });

      console.log({
        ...dados,
        id: idPopulacao,
        fk_edificios: idEdificio,
        nivel: nivel,
        periodo: periodo,
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
      alunos: string("alunos").required("alunos"),
      funcionarios: string("funcionarios").required("funcionarios"),
    });

    try {
      await schema.validate(dados, { abortEarly: false });
      if (nivel.length === 0 && periodo.length === 0) {
        setErro(["nivel"]);
        setErro(["periodo"]);
        return false;
      } else if (nivel.length === 0 && periodo.length !== 0) {
        setErro(["nivel"]);
        return false;
      } else if (nivel.length !== 0 && periodo.length === 0) {
        setErro(["periodo"]);
        return false;
      } else {
        return true;
      }
    } catch (err) {
      setErro(err.errors);
      if (periodo.length === 0 && nivel.length === 0) {
        setErro([...err.errors, "periodo", "nivel"]);
      } else if (periodo.length === 0 && nivel.length !== 0) {
        setErro([...err.errors, "periodo"]);
      } else if (periodo.length !== 0 && nivel.length === 0) {
        setErro([...err.errors, "nivel"]);
      }
    }
  }

  return (
    <PopulacaoContext.Provider
      value={{
        nivel,
        setNivel,
        periodo,
        setPeriodo,
        openModal,
        setOpenModal,
        onSubmit,
        controleUseEffectPopulacao,
        setControleUseEffectPopulacao,
        dados,
        setDados,
        erro,
        setErro,
        openConfirmacao,
        setConfirmacao,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </PopulacaoContext.Provider>
  );
};
