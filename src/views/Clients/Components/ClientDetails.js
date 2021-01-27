import React, { useEffect, useState } from "react";
import {
  TextField,
  AppBar,
  Typography,
  Button,
  Grid,
  Toolbar
} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { Close, Save, ArrowBackIosOutlined } from "@material-ui/icons";
import "../Clients.css";

const Clients = (props) => {
  const optionsContact = {
    filterType: "checkbox",
    rowsPerPage: 3,
  };
  const columnsContact = [
    {
      name: "_id",
      options: {
        display: false,
      },
    },
    { name: "name", label: "Entity Name" },
    { name: "phone", label: "Phone" },
    { name: "address", label: "Address" },
    { name: "email", label: "Email" },
    { name: "position", label: "Position" },
  ];

  const columnsLegalInfo = [
    {
      name: "_id",
      options: {
        display: false,
      },
    },
    { name: "name", label: "Entity Name" },
    { name: "nickname", label: "Nickname" },
    { name: "cr_number", label: "CR #" },
    { name: "vat_number", label: "VAT #" },
    { name: "vat_percentage", label: "VAT %" },
  ];

  const optionsLegalInfo = {
    filterType: "checkbox",
    rowsPerPage: 3,
  };

  return (
    <>
    <AppBar>
      <Toolbar>
        <Close onClick={props.handleClose} className="btnIcon" />
        <Typography variant="h6"> &nbsp; Client Details</Typography>
      </Toolbar>
    </AppBar>
    <div style={{ padding: "80px 30px 0" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <div className="clientProfile" >
            <img src={require("../../../assets/img/sidebar-2.jpg")} alt="" />
            <form className="clientProfile__form" noValidate autoComplete="off">
              <TextField
                label="Company"
                defaultValue={props.data.company}
                fullWidth
              />
              <TextField
                label="Address"
                defaultValue={props.data.address}
                fullWidth
              />
              <TextField label="Phone" defaultValue={props.data.phone} fullWidth />
              <TextField
                label="Email"
                defaultValue={props.data.email}
                fullWidth
              />
            </form>
          </div>
        </Grid>
        <Grid item xs={12} md={8} className="clientTables">
          <MUIDataTable
            title={"LEGAL INFO"}
            data={props.data.legals}
            columns={columnsLegalInfo}
            options={optionsLegalInfo}
            fullWidth
          />
          <MUIDataTable
            title={"CONTACT"}
            data={props.data.contacts}
            columns={columnsContact}
            options={optionsContact}
            fullWidth
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
              onClick={props.handleClose}
              startIcon={<ArrowBackIosOutlined />}
            >
              Back
            </Button>
          </NavLink>
        </Grid>
      </Grid>
    </div>
    </>
  );
};

export default Clients;
