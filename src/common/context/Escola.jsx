// Imports dos módulos e componentes necessários
import React from "react";
import AtualizarEscola from "../../services/PUT/AtualizarEscola";
import CadastroEscola from "../../services/POST/CadastroEscola";
import Cookies from "js-cookie";
import EscolaCadastrada from "../../services/GET/EscolaCadastrada";
import { MensagemContext } from "./Mensagem";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
//-----------------------------------------------------------------------------

// Criação do contexto Escola
export const EscolaContext = React.createContext();
EscolaContext.displayName = "Escola";
//-----------------------------------------------------------------------------

export const EscolaProvider = ({ children }) => {
  const navigate = useNavigate();

  const [id, setId] = React.useState("");
  const [nivel, setNivel] = React.useState([]);
  const [dados, setDados] = React.useState({
    nome: "",
    cnpj: "",
    telefone: "",
    email: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [erro, setErro] = React.useState(["", ""]);
  const [error, setError] = React.useState();
  const [enviado, setEnviado] = React.useState(false);
  const [editar, setEditar] = React.useState(true);
  const [controleUseEffect, setcontroleUseEffect] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [desabilitarLogradouro, setDesabilitarLogradouro] =
    React.useState(true);
  const [desabilitarBairro, setDesabilitarBairro] = React.useState(true);

  const { setAbrirSnackbar, setErroMensagem, setTextoMensagem, setSeverity } =
    React.useContext(MensagemContext);

  // CNPJ
  function validarCNPJ(cnpj) {
    dados.cnpj = cnpj;
    //cnpj = dados.cnpj.target.value.replace(/[^\d]+/g, "");
    if (dados.cnpj && dados.cnpj.target && dados.cnpj.target.value) {
      // CNPJ está definido e possui um valor
      cnpj = dados.cnpj.target.value.replace(/[^\d]+/g, "");
    } else {
      if (typeof cnpj === "string") {
        cnpj = cnpj.replace(/[^\d]+/g, "");
      } else {
        return false;
      }
    }
    // VERIFICAR SE É VAZIO
    if (cnpj.length === 0) {
      // Limpe os erros relacionados ao CNPJ, caso existam
      if (erro.includes("cnpj")) {
        setErro(erro.filter((err) => err !== "cnpj"));
      }
      // Retona false para indicar que o CNPJ
      return false;
      // setErro(["cnpj", ...erro.filter((err) => err !== "cnpj")]);
    }

    // Verifica se todos os dígitos são iguais, o que torna o CNPJ inválido
    if (/^(\d)\1+$/.test(cnpj)) {
      setErro(["cnpj", ...erro.filter((err) => err !== "cnpj")]);
      return true;
    }
    // // Calcula o primeiro dígito verificador
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
    // // Verifica se os dígitos calculados são iguais aos dígitos informados
    if (
      parseInt(cnpj.charAt(12)) === primeiroDigito &&
      parseInt(cnpj.charAt(13)) === segundoDigito
    ) {
      if (erro.includes("cnpj")) {
        setErro(erro.filter((err) => err !== "cnpj"));
      }
      return false;
    } else {
      setErro(["cnpj", ...erro.filter((err) => err !== "cnpj")]);
      return true;
    }
  }

  /************************************** RECUPERANDO DADOS DO BANCO DE DADOS **********************************************/
  React.useEffect(() => {
    async function RecuperarEscola() {
      const idEscola = Cookies.get("idEscola");
      let response = { status: false };

      try {
        if (!!idEscola) {
          response = await EscolaCadastrada(idEscola);
        } else {
          response = { ok: false };
        }
        // Estados de controle
        if (response.status) {
          const escola = response.escola;
          setEnviado(true);
          setEditar(false); // Resolveu o problema da edição voltar sempre.
          setErroMensagem(false);
          setDados((prevDados) => ({
            ...prevDados,
            nome: escola.nome,
            cnpj: escola.cnpj,
            telefone: escola.telefone,
            email: escola.email,
            cep: escola.cep,
            logradouro: escola.logradouro,
            numero: escola.numero,
            complemento: escola.complemento,
            bairro: escola.bairro,
            cidade: escola.cidade,
            estado: escola.estado,
          }));
          setNivel(escola.nivel);
        } else {
          setDados((prevDados) => ({
            ...prevDados,
            nome: "",
            cnpj: "",
            telefone: "",
            email: "",
            cep: "",
            logradouro: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            estado: "",
          }));

          setEditar(true);
          setEnviado(false);
        }
      } catch (error) {
        console.error("Erro ao recuperar a escola:", error);
      } finally {
        setIsLoading(false); // Definido isLoading como false após a recuperação dos dados
      }
    }

    if (controleUseEffect) {
      setIsLoading(true); // Definido isLoading como true antes da recuperação dos dados
      RecuperarEscola();
      setcontroleUseEffect(false);
    }
  }, [controleUseEffect]);

  /************************************** CEP ***********************************************/
  React.useEffect(() => {
    async function checkCEP() {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${dados.cep.replace(/\D/g, "")}/json/`
        );
        const data = await response.json();
        if (data.erro === true) {
          setDados((prevDados) => ({
            ...prevDados,
            bairro: "",
            logradouro: "",
            cidade: "",
            estado: "",
          }));
          setErro(["CEP"]);

          setTimeout(() => {}, 1000);
        } else {
          setDados((prevDados) => ({
            ...prevDados,
            bairro: data.bairro,
            logradouro: data.logradouro,
            cidade: data.localidade,
            estado: data.uf,
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

          setErro(erro.filter((err) => err !== "CEP"));
        }
      } catch (error) {
        setError(false);
      }
    }
    if (dados.cep.length === 9) {
      checkCEP();
    }
  }, [dados.cep]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Definindo isLoading como true antes da submissão do formulário

    // Mensagem de erro está funcionando aqui!
    if (!(await validate())) {
      setIsLoading(false); // Definindo isLoading como false após a validação dos campos
      setTextoMensagem("Falha ao cadastrar: Preencha os campos corretamente!");
      setSeverity("error");
      setAbrirSnackbar(true);
      return;
    }
    setErro(["", ""]);

    /************************************** VERIFICAR ***********************************************/
    if (!enviado) {
      const dadosAEnviar = { ...dados, nivel };
      const response = await CadastroEscola(dadosAEnviar);

      if (response && response.status) {
        Cookies.set("idEscola", response.id);
        setEnviado(true);
        setEditar(false);
        setAbrirSnackbar(true);
        setSeverity("success");
        setTextoMensagem("Cadastro realizado!");
      } else {
        setAbrirSnackbar(true);
        setSeverity("error");
        setTextoMensagem("Cadastro não realizado!");
      }
    } else {
      const dadosAEnviar = { ...dados, nivel };
      const response = await AtualizarEscola(dadosAEnviar);
      if (response && response.status) {
        setEditar(false);
        setAbrirSnackbar(true);
        setErroMensagem(false);
        setSeverity("success");
        setTextoMensagem("Cadastro atualizado!");
      } else {
        setAbrirSnackbar(true);
        setErroMensagem(true);
        setSeverity("error");
        setTextoMensagem("Cadastro não atualizado!");
      }
    }
    setIsLoading(false); // Definindo isLoading como false após a conclusão da submissão do formulário
  };

  async function validate() {
    let schema = object({
      nome: string("nome").required("nome"),
      cep: string("CEP").required("CEP"),
      logradouro: string("logradouro").required("logradouro"),
      numero: string("numero").required("numero"),
      cidade: string("cidade").required("cidade"),
      estado: string("estado").required("estado"),
    });

    try {
      await schema.validate(dados, { abortEarly: false });

      if (nivel.length === 0 && validarCNPJ(dados.cnpj)) {
        setErro(["nivel", "cnpj"]);
        return false;
      } else if (nivel.length !== 0 && validarCNPJ(dados.cnpj)) {
        setErro(["cnpj"]);
        return false;
      } else if (nivel.length === 0 && !validarCNPJ(dados.cnpj)) {
        setErro(["nivel"]);
        return false;
      } else {
        return true;
      }
    } catch (err) {
      setErro(err.errors);

      if (nivel.length === 0 && validarCNPJ(dados.cnpj)) {
        setErro([...err.errors, "nivel", "cnpj"]);
      } else if (nivel.length !== 0 && validarCNPJ(dados.cnpj)) {
        setErro([...err.errors, "cnpj"]);
      } else if (nivel.length === 0 && !validarCNPJ(dados.cnpj)) {
        setErro([...err.errors, "nivel"]);
      }
      return false;
    }
  }

  return (
    <EscolaContext.Provider
      value={{
        id, // ACRESCENTADO
        setId,
        nivel,
        setNivel,
        onSubmit,
        enviado,
        setEnviado,
        editar,
        setEditar,
        controleUseEffect,
        setcontroleUseEffect,
        dados,
        setDados,
        erro,
        setErro,
        desabilitarLogradouro,
        desabilitarBairro,
        validarCNPJ,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </EscolaContext.Provider>
  );
};
