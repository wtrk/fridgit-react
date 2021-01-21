import React from "react";
import { NavLink } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import datatableTheme from "assets/css/datatable-theme.js";
import "./Clients.css";

const ClientsList = () => {
  const data = [
    [
      "Unilever Levant S.A.R.L.",
      "Dolphin Bldg. Fattal Holding, Jisr El Wati, Sin El FIl, Beirut, Lebanon",
      "+961-3-105 784",
      "baker.sibai@unilever.com",
    ],
    [
      "Fattal Food & Beverages - Neo Comet",
      "4th Floor, KFF Food & Beverage Bldg, Dany Chamoun Street-Jisr El Wati, Sin El Fil, PO Box 110-773 Riad El Solh, Beirut/Lebanon",
      "+961-1-512000",
      "yara.abdelAhad@fattal.com.lb",
    ],
    [
      "Unilever Levant S.A.R.L.",
      "Dolphin Bldg. Fattal Holding, Jisr El Wati, Sin El FIl, Beirut, Lebanon",
      "+961-3-105 784",
      "baker.sibai@unilever.com",
    ],
    [
      "Fattal Food & Beverages - Neo Comet",
      "4th Floor, KFF Food & Beverage Bldg, Dany Chamoun Street-Jisr El Wati, Sin El Fil, PO Box 110-773 Riad El Solh, Beirut/Lebanon",
      "+961-1-512000",
      "yara.abdelAhad@fattal.com.lb",
    ],
    [
      "Unilever Levant S.A.R.L.",
      "Dolphin Bldg. Fattal Holding, Jisr El Wati, Sin El FIl, Beirut, Lebanon",
      "+961-3-105 784",
      "baker.sibai@unilever.com",
    ],
    [
      "Fattal Food & Beverages - Neo Comet",
      "4th Floor, KFF Food & Beverage Bldg, Dany Chamoun Street-Jisr El Wati, Sin El Fil, PO Box 110-773 Riad El Solh, Beirut/Lebanon",
      "+961-1-512000",
      "yara.abdelAhad@fattal.com.lb",
    ],
    [
      "Unilever Levant S.A.R.L.",
      "Dolphin Bldg. Fattal Holding, Jisr El Wati, Sin El FIl, Beirut, Lebanon",
      "+961-3-105 784",
      "baker.sibai@unilever.com",
    ],
    [
      "Fattal Food & Beverages - Neo Comet",
      "4th Floor, KFF Food & Beverage Bldg, Dany Chamoun Street-Jisr El Wati, Sin El Fil, PO Box 110-773 Riad El Solh, Beirut/Lebanon",
      "+961-1-512000",
      "yara.abdelAhad@fattal.com.lb",
    ],
    [
      "Unilever Levant S.A.R.L.",
      "Dolphin Bldg. Fattal Holding, Jisr El Wati, Sin El FIl, Beirut, Lebanon",
      "+961-3-105 784",
      "baker.sibai@unilever.com",
    ],
    [
      "Fattal Food & Beverages - Neo Comet",
      "4th Floor, KFF Food & Beverage Bldg, Dany Chamoun Street-Jisr El Wati, Sin El Fil, PO Box 110-773 Riad El Solh, Beirut/Lebanon",
      "+961-1-512000",
      "yara.abdelAhad@fattal.com.lb",
    ],
  ];

  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "standard",
  };
  const columns = [
    {
      name: "Company",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <NavLink to="./Clients">{value}</NavLink>;
        },
      },
    },
    { name: "Address" },
    { name: "Phone" },
    {
      name: "Email",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <a href={"mailto:" + value}>{value}</a>;
        },
      },
    },
  ];
  const top100Films = [];
  return (
    <Container maxWidth="xl">
      <Autocomplete
        multiple
        id="tags-filled"
        options={top100Films.map((option) => option.title)}
        defaultValue={[]}
        freeSolo
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            label=""
            placeholder="Search Data"
          />
        )}
      />
      <MuiThemeProvider theme={datatableTheme}>
      <MUIDataTable
        title=""
        data={data}
        columns={columns}
        options={options}
        className="dataTableContainer"
      />
      </MuiThemeProvider>
    </Container>
  );
};

export default ClientsList;
