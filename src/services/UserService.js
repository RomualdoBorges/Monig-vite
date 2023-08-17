import { urlBase } from "./Config";

export default async function fazerPostDeJSON(dados) {
  const url = `${urlBase}/api/v1/auth/login`;
  const data = dados;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {
        const reponseServidor = response;
        return response.json();
      } else {
        throw new Error(
          "A resposta do servidor não foi bem-sucedida. Código de status: " +
            response
        );
      }
    })
    .then((data) => {
      return {
        autenticado: true,
        servidor: data,
      };
    })
    .catch((error) => {
      console.error("Erro ao fazer post de JSON:", error);
      return { autenticado: false };
    });
}
