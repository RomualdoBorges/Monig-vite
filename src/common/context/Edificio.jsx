import React from "react";
import CadastroEdificios from "../../services/POST/CadastroEdificio";
import { MensagemContext } from "./Mensagem";
import Cookies from "js-cookie";
import AtualizarEdificio from "../../services/PUT/AtualizarEdificio";
import EdificioCadastrado from "../../services/GET/EdificioCadastrado";
import { object, string } from "yup";
import { useNavigate } from "react-router-dom";

export const EdificioContext = React.createContext();
EdificioContext.displayName = "Edificio";

export const EdificioProvider = ({ children }) => {
  // Estados do Formulário
  const [id, setId] = React.useState("");
  const navigate = useNavigate();

  const [dados, setDados] = React.useState({
    nome_do_edificio: "",
    cnpj_edificio: "",
    cep_edificio: "",
    logradouro_edificio: "",
    numero_edificio: "",
    complemento_edificio: "",
    bairro_edificio: "",
    cidade_edificio: "",
    estado_edificio: "",
    area_total_edificio: "",
    pavimentos_edificio: "",
  });
  const [reservatorio_edificacao, setReservatorioEdificacao] = React.useState(
    []
  );

  const nome = dados.nome_do_edificio;

  const [agua_de_reuso, setAgua_de_reuso] = React.useState(false);
  const [erro, setErro] = React.useState(["", ""]);
  const [error, setError] = React.useState();
  const [enviado, setEnviado] = React.useState(false);
  const [editar, setEditar] = React.useState(
    Cookies.get("idEdificio") ? false : true
  );
  const [openConfirmacao, setConfirmacao] = React.useState(false);
  const [controleUseEffectEdificio, setcontroleUseEffectEdificio] =
    React.useState(true);
  const [recuperar, setRecuperar] = React.useState();
  const { setErroMensagem, setTextoMensagem, setAbrirSnackbar, setSeverity } =
    React.useContext(MensagemContext);

  const [edPrincipal, setEdPrincipal] = React.useState(false);

  // Estado do Loading
  const [isLoading, setIsLoading] = React.useState(true);

  //CNPJ
  function validarCNPJ(cnpj) {
    dados.cnpj_edificio = cnpj;

    if (
      dados.cnpj_edificio &&
      dados.cnpj_edificio.target &&
      dados.cnpj_edificio.target.value
    ) {
      cnpj = dados.cnpj_edificio.target.value.replace(/[^\d]+/g, "");
    } else {
      if (typeof cnpj === "string") {
        cnpj = cnpj.replace(/[^\d]+/g, "");
      } else {
        return false;
      }
    }

    // VERIFICAR SE É VAZIO
    if (cnpj.length === 0) {
      setErro([
        "cnpj_edificio",
        ...erro.filter((err) => err !== "cnpj_edificio"),
      ]);
      return true;
    }

    // Verifica se todos os dígitos são iguais, o que torna o CNPJ inválido
    if (/^(\d)\1+$/.test(cnpj)) {
      setErro([
        "cnpj_edificio",
        ...erro.filter((err) => err !== "cnpj_edificio"),
      ]);
      return true;
    }

    // Calcula o primeiro dígito verificador
    let soma = 0;
    let peso = 2;
    for (let i = 11; i >= 0; i--) {
      soma = soma + cnpj.charAt(i) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    let digito = 11 - (soma % 11);
    let primeiroDigito = digito > 9 ? 0 : digito;

    // Calcula o segundo dígito verificador
    soma = 0;
    peso = 2;
    for (let i = 12; i >= 0; i--) {
      soma = soma + cnpj.charAt(i) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    digito = 11 - (soma % 11);
    let segundoDigito = digito > 9 ? 0 : digito;

    // Verifica se os dígitos calculados são iguais aos dígitos informados
    if (
      parseInt(cnpj.charAt(12)) === primeiroDigito &&
      parseInt(cnpj.charAt(13)) === segundoDigito
    ) {
      if (erro.includes("cnpj")) {
        setErro(erro.filter((err) => err !== "cnpj"));
      }
      return false;
    } else {
      setErro([
        "cnpj_edificio",
        ...erro.filter((err) => err !== "cnpj_edificio"),
      ]);
      return true;
    }
  }

  // RECUPERAR INFORMAÇÕES DO BANCO
  React.useEffect(() => {
    async function RecuperarEdificio() {
      const idEdificio = Cookies.get("idEdificio");
      let response = { status: false };

      try {
        if (!!idEdificio) {
          response = await EdificioCadastrado(idEdificio);
        } else {
          response = { status: false };
        }

        //Estados
        if (response.status) {
          const edificio = response.edificio;

          setDados((prevDados) => ({
            ...prevDados,
            nome_do_edificio: edificio.nome_do_edificio,
            cnpj_edificio: edificio.cnpj_edificio,
            cep_edificio: edificio.cep_edificio,
            logradouro_edificio: edificio.logradouro_edificio,
            numero_edificio: edificio.numero_edificio,
            cidade_edificio: edificio.cidade_edificio,
            estado_edificio: edificio.estado_edificio,
            area_total_edificio: edificio.area_total_edificio,
            pavimentos_edificio: edificio.pavimentos_edificio,
            capacidade_reuso_m3_edificio: edificio.capacidade_reuso_m3_edificio,
          }));
          setId(edificio.id);
          setEditar(false);
          setEnviado(true);
          setAgua_de_reuso(edificio.agua_de_reuso);
          setReservatorioEdificacao(edificio.reservatorio);
        } else {
          setDados({
            nome_do_edificio: "",
            cnpj_edificio: "",
            cep_edificio: "",
            logradouro_edificio: "",
            numero_edificio: "",
            complemento_edificio: "",
            bairro_edificio: "",
            cidade_edificio: "",
            estado_edificio: "",
            area_total_edificio: "",
            pavimentos_edificio: "",
            capacidade_reuso_m3_edificio: "",
          });
          setAgua_de_reuso(false);
          setReservatorioEdificacao([]);
          setEditar(true);
          setEnviado(false);
        }
      } catch (error) {
        console.error("Erro ao recuperar a edificação:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (controleUseEffectEdificio) {
      setIsLoading(true);
      RecuperarEdificio();
      setcontroleUseEffectEdificio(false);
    }
  }, [controleUseEffectEdificio]);

  /************************************** CEP ***********************************************/
  const [desabilitarLogradouro, setDesabilitarLogradouro] =
    React.useState(true);
  const [desabilitarBairro, setDesabilitarBairro] = React.useState(true);
  React.useEffect(() => {
    async function checkCEP() {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${dados.cep_edificio.replace(
            /\D/g,
            ""
          )}/json/`
        );
        const data = await response.json();
        if (data.erro === "true") {
          setDados((prevDados) => ({
            ...prevDados,
            logradouro_edificio: "",
            bairro_edificio: "",
            cidade_edificio: "",
            estado_edificio: "",
          }));
          setErro(["cep_edificio"]);
        } else {
          setDados((prevDados) => ({
            ...prevDados,
            logradouro_edificio: data.logradouro,
            bairro_edificio: data.bairro,
            cidade_edificio: data.localidade,
            estado_edificio: data.uf,
          }));
          if (data.logradouro === "") {
            setDesabilitarLogradouro(false);
          } else {
            setDesabilitarLogradouro(true);
          }
          if (data.bairro === "") {
            setDesabilitarBairro(false);
          } else {
            setDesabilitarBairro(true);
          }
        }
      } catch (error) {
        setError(false);
      }
    }
    if (dados.cep_edificio !== undefined) {
      if (dados.cep_edificio.length === 9) {
        checkCEP();
      }
    }
  }, [dados.cep_edificio]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!(await validate())) {
      setIsLoading(false);
      setTextoMensagem("Falha ao cadastrar: Preencha os campos corretamente!");
      // setErroMensagem(true);
      setSeverity("error");
      setAbrirSnackbar(true);
      return;
    }

    setErro(["", ""]);

    const idEdificio = Cookies.get("idEdificio");
    const idEscola = Cookies.get("idEscola");
    if (!idEdificio) {
      const dadosAEnviar = {
        ...dados,
        fk_escola: idEscola,
        agua_de_reuso: agua_de_reuso,
        reservatorio: reservatorio_edificacao,
      };
      const response = await CadastroEdificios(dadosAEnviar);
      if (response && response.status) {
        setEnviado(true);
        setEditar(false);
        setAbrirSnackbar(true);
        setSeverity("success");
        setTextoMensagem("Cadastro realizado!");
        setId(idEdificio);
        Cookies.set("idEdificio", response.id);
      } else {
        setAbrirSnackbar(true);
        setSeverity("error");
        setTextoMensagem("Cadastro não realizado!");
      }
    } else {
      const dadosAEnviar = {
        ...dados,
        fk_escola: idEscola,
        agua_de_reuso: agua_de_reuso,
        reservatorio: reservatorio_edificacao,
      };
      const response = await AtualizarEdificio(dadosAEnviar);
      if (response && response.status) {
        setEditar(false);
        setAbrirSnackbar(true);
        setErroMensagem(false);
        setSeverity("success");
        setTextoMensagem("Cadastro atualizado!");
        setcontroleUseEffectEdificio(true);
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
      nome_do_edificio: string("nome_do_edificio").required("nome_do_edificio"),
      cnpj_edificio: string("cnpj_edificio").required("cnpj_edificio"),
      cep_edificio: string("cep_edificio").required("cep_edificio"),
      logradouro_edificio: string("logradouro_edificio").required(
        "logradouro_edificio"
      ),
      numero_edificio: string("numero_edificio").required("numero_edificio"),
      cidade_edificio: string("cidade_edificio").required("cidade_edificio"),
      estado_edificio: string("estado_edificio").required("estado_edificio"),
    });

    try {
      await schema.validate(dados, { abortEarly: false });
      return true;
    } catch (err) {
      setErro(err.errors);
    }
  }

  return (
    <EdificioContext.Provider
      value={{
        onSubmit,
        editar,
        setEditar,
        enviado,
        setEnviado,
        controleUseEffectEdificio,
        setcontroleUseEffectEdificio,
        agua_de_reuso,
        setAgua_de_reuso,
        dados,
        setDados,
        erro,
        setErro,
        nome,
        openConfirmacao,
        setConfirmacao,
        desabilitarLogradouro,
        desabilitarBairro,
        validarCNPJ,
        reservatorio_edificacao,
        setReservatorioEdificacao,
        edPrincipal,
        setEdPrincipal,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </EdificioContext.Provider>
  );
};
