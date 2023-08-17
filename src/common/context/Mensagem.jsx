import React from "react";

export const MensagemContext = React.createContext();
MensagemContext.displayName = "Mensagem";

export const MensagemProvider = ({ children }) => {
  const [abrirSnackbar, setAbrirSnackbar] = React.useState(false);
  const [erroMensagem, setErroMensagem] = React.useState(false);
  const [textoMensagem, setTextoMensagem] = React.useState("");
  const [mensagem, setMensagem] = React.useState(true);
  const [severity, setSeverity] = React.useState('success');

  return (
    <MensagemContext.Provider
      value={{
        abrirSnackbar,
        setAbrirSnackbar,
        erroMensagem,
        setErroMensagem,
        mensagem,
        setMensagem,
        textoMensagem,
        setTextoMensagem,
        severity, 
        setSeverity
      }}
    >
      {children}
    </MensagemContext.Provider>
  );
};
