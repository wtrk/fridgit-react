import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";
import { Save, ArrowBackIosOutlined } from "@material-ui/icons";
import "./Clients.css";
import photo from "../../assets/img/sidebar-2.jpg";

const Clients = () => {

  const dataContact = [
    [
      "Baker El Sibaii",
      "+961 3 105 784",
      "Dolphin Bldg. Fattal Holding, Jisr El Wati, Sin El FIl, Beirut, Lebanon",
      "baker.sibai@unilever.com",
      "Supply Chain Manager",
    ],
    [
      "Baker El Sibaii",
      "+961 3 105 784",
      "Dolphin Bldg.ng, Jisr El Wati, Sin El FIl, Beirut, Lebanon",
      "baker.sibai@unilever.com",
      "Supply Chain Manager",
    ],
    [
      "Baker El Sibaii",
      "+961 3 105 784",
      "Dolphin Bldg. Fattal l FIl, Beirut, Lebanon",
      "baker.sibai@unilever.com",
      "Supply Chain Manager",
    ],
    [
      "Baker El Sibaii",
      "+961 3 105 784",
      "Dolphin Bldg. Fattal l FIl, Beirut, Lebanon",
      "baker.sibai@unilever.com",
      "Supply Chain Manager",
    ],
  ];

  const optionsContact = {
    filterType: "checkbox",
    rowsPerPage: 3,
  };
  const columnsContact = ["Name", "Phone", "Address", "Email", "Position"];

  const columnsLegalInfo = ["Entity Name", "Nickname", "CR#", "VAT#", "VAT %"];
  const dataLegalInfo = [
    ["Joe James", "JoeJames", "122321", "000876", "10"],
    ["John Walsh", "JohnWalsh", "122112", "000881", "10"],
    ["Bob Herm", "BobHerm", "124456", "000812", "13"],
    ["Bob Herm", "BobHerm", "123222", "000899", "10"],
  ];

  const optionsLegalInfo = {
    filterType: "checkbox",
    rowsPerPage: 3,
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <div class="clientProfile">
            <img src={photo} alt="" />
            <form className="clientProfile__form" noValidate autoComplete="off">
              <TextField
                label="Company"
                defaultValue="Unilever Levant S.A.R.L."
                fullWidth
              />
              <TextField
                label="Address"
                defaultValue="3rd Floor, Dolphin Building, Fouad Ammoun Street-Jisr El Wati, Sin El Fil PO Box 90-908 Beirut/ Lebanon"
                fullWidth
              />
              <TextField label="Phone" defaultValue="+961 1 497630" fullWidth />
              <TextField
                label="Email"
                defaultValue="Baker.Sibai@unilever.com"
                fullWidth
              />
            </form>
          </div>
        </Grid>
        <Grid item xs={12} md={8} className="clientTables">
          <MUIDataTable
            title={"LEGAL INFO"}
            data={dataLegalInfo}
            columns={columnsLegalInfo}
            options={optionsLegalInfo}
          />
          <MUIDataTable
            title={"CONTACT"}
            data={dataContact}
            columns={columnsContact}
            options={optionsContact}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            className="btn btn--save"
            startIcon={<Save />}
          >
            Save
          </Button>
          <NavLink to="./Clients_list">
            <Button
              variant="outlined"
              color="primary"
              size="large"
              className="btn btn--save"
              startIcon={<ArrowBackIosOutlined />}
            >
              Back
            </Button>
          </NavLink>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Clients;
