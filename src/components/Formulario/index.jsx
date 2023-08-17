import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";

export default function Formulario(props) {
  function verificaErro(nome, erro, valor) {
    if (erro.includes(nome)) {
      if (valor !== "") return `Digite um ${nome} válido`;
      else return "Obrigatório";
    } else return "";
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={`repeat(${props.grid}, 1fr)`}
      gap={2}
    >
      {/* Mapeamento dos campos */}
      {props.campos.map((campo) => (
        <Box gridColumn={campo.gridColumn} key={campo.name}>
          {campo.select ? (
            <FormControl size="small" fullWidth>
              <InputLabel>{campo.label}</InputLabel>
              <Select
                name={campo.name}
                key={campo.name}
                multiple
                value={campo.value}
                onChange={campo.onChange}
                input={<OutlinedInput label={campo.label} />}
                renderValue={(juntar) => juntar.join(", ")}
                disabled={props.disabled || campo.disabled}
                error={props.erro.includes(campo.name)}
              >
                {campo.select.map((nivel, reservatorio) => (
                  <MenuItem
                    key={(nivel, reservatorio)}
                    value={nivel}
                    onClick={() => {
                      const newValue = campo.value.includes(nivel)
                        ? campo.value.filter((value) => value !== nivel)
                        : [...campo.value, nivel];
                      campo.onChange({
                        target: { name: campo.name, value: newValue },
                      });
                    }}
                    selected={campo.value.includes(nivel)}
                  >
                    <Checkbox checked={campo.value.includes(nivel)} />
                    <ListItemText primary={nivel} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {props.erro.includes(campo.name) ? "Obrigatório" : ""}
              </FormHelperText>
            </FormControl>
          ) : campo.selectUni ? (
            <FormControl size="small" fullWidth>
              <InputLabel>{campo.label}</InputLabel>
              <Select
                key={campo.name}
                name={campo.name}
                value={campo.value}
                label={campo.label}
                onChange={campo.onChange}
                disabled={props.disabled || campo.disabled}
                error={props.erro.includes(campo.name)}
              >
                {campo.selectUni.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {props.erro.includes(campo.name) ? "Obrigatório" : ""}
              </FormHelperText>
            </FormControl>
          ) : (
            <TextField
              fullWidth
              key={campo.key}
              type={campo.type}
              id={campo.name}
              label={campo.label}
              name={campo.name}
              value={campo.value}
              onChange={campo.onChange}
              disabled={props.disabled || campo.disabled}
              error={props.erro.includes(campo.name)}
              helperText={verificaErro(campo.name, props.erro, campo.value)}
              size="small"
            />
          )}
        </Box>
      ))}
    </Box>
  );
}
