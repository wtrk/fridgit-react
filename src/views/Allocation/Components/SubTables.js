import React, { Fragment,useState } from "react";
import {
  AppBar,
  Typography,
  Grid,
  Button,
  Toolbar,
  IconButton,
} from "@material-ui/core";
import { Close, Save } from "@material-ui/icons";
import CustomInput from "components/CustomInput/CustomInput.js";
import { makeStyles } from "@material-ui/core/styles";
import CustomToolbar from "CustomToolbar";

import MUIDataTable from "mui-datatables";


const options = {
    filterType: "dropdown",
    onRowsDelete: null,
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return <CustomToolbar />;
    },
  };

  const useStyles = makeStyles((theme) => ({
    appBar: {
      position: "relative",
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    formControl: {
      minWidth: "100%",
    },
  }));
const SubTables = (props) => {
    const [open, setOpen] = useState(false); //for modal
    const [modal_Title, setmodal_Title] = useState("Add"); //modal title
    const classes = useStyles(); //custom css
    

  return (
    <Fragment>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => props.setOpenDialog(false)}
            aria-label="close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {modal_Title + " Allocation Rule"}
          </Typography>
        </Toolbar>
      </AppBar>

      <div style={{ padding: "10px 30px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <CustomInput
              labelText="Code"
              id="dob"
              formControlProps={{
                fullWidth: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomInput
              labelText="Name"
              id="position"
              formControlProps={{
                fullWidth: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomInput
              labelText="Name"
              id="Supplier"
              formControlProps={{
                fullWidth: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <MUIDataTable
              title="City"
              data={[{ name: "ksa" }, { name: "uae" }]}
              columns={[
                {
                  name: "name",
                  label: "Name",
                },
              ]}
              options={options}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <MUIDataTable
              title="Neighbourhood"
              data={[{ name: "abha" }, { name: "Jeddah" }]}
              columns={[
                {
                  name: "name",
                  label: "Name",
                },
              ]}
              options={options}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <MUIDataTable
              title="Customer"
              data={[{ name: "test customer" }, { name: "customer 2" }]}
              columns={[
                {
                  name: "name",
                  label: "Name",
                },
              ]}
              options={options}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <MUIDataTable
              title="Operation"
              data={[{ name: "Jedda" }, { name: "Jeddah" }]}
              columns={[
                {
                  name: "name",
                  label: "Name",
                },
              ]}
              options={options}
            />
          </Grid>

        
<Grid item xs={12} className="clientTables">
  <Button
    variant="contained"
    color="primary"
    size="large"
    className="btn btn--save"
    onClick={() => props.setOpenDialog(false)}
    startIcon={<Save />}
  >
    Save
  </Button>
  <Button
    variant="outlined"
    color="primary"
    size="large"
    className="btn btn--save"
    onClick={() => props.setOpenDialog(false)}
    startIcon={<Close />}
  >
    Close
  </Button>
</Grid>
        </Grid>
      </div>
    </Fragment>
  );
};

export default SubTables;
