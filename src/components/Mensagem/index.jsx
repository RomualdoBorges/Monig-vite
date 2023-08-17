import React from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { MensagemContext } from "../../common/context/Mensagem";
// Importe apenas os componentes que você está usando

export default function Mensagem({ sucesso = true, mensagem }) {
  const { abrirSnackbar, setAbrirSnackbar, severity } =
    React.useContext(MensagemContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAbrirSnackbar(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={abrirSnackbar}
      onClose={handleClose}
      autoHideDuration={5000}
    >
      <Alert onClose={handleClose} severity={severity}>
        {mensagem}
      </Alert>
    </Snackbar>
  );
}
