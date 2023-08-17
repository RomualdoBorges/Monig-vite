import React from "react";
import { alpha, styled } from "@mui/material/styles";
import { DataGrid, gridClasses, ptBR } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: "rgba(202, 197, 197, 0.37)", //theme.palette.grey[100],
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "#e8e8e8",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
  [`& .${gridClasses.row}.odd`]: {
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
        "@media (hover: none)": {
          backgroundColor: "#e8e8e8",
        },
      },
    },
  },
  [`& .${gridClasses.row}.principal`]: {
    background: "#61b9d4",
  },
}));

export default function Tabela(props) {
  return (
    <Box
      m="2%"
      display="flex"
      height="400px"
      width="100%"
      margin="0" // Victor
      //className={classes.tableContainer}
      sx={{
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: "#transparent",
          fontWeight: "bold",
          fontSize: "16px", // Victor
          borderRight: "1px solid #ccc", // Adiciona a linha vertical
        },
        "& .name-column-cell": {
          color: "#ffffff",
        },
        "& .MuiDataGrid-cell": {
          borderRight: "1px solid #ccc",
          fontSize: "14px",
          // Adiciona a linha vertical
        },
        "& .MuiDataGrid-footerContainer": {
          backgroundColor: "transparent",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: "transparent",
        },
      }}
    >
      <StripedDataGrid
        rows={props.corpo || []}
        columns={props.cabecalho}
        disableRowSelectionOnClick
        getRowClassName={(params) =>
          params.row.principal
            ? "principal"
            : params.indexRelativeToCurrentPage % 2 === 0
            ? "even"
            : "odd"
        }
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        onRowClick={props.onRowClick}
        sx={{
          boxShadow: 0,
          borderColor: "2px solid rgba(202, 197, 197, 0.37)",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
            textDecoration: "underline",
            cursor: "pointer",
          },
          //borderRight: "1px solid #ccc",
        }}
      />
    </Box>
  );
}
