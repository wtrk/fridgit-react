import React, { Fragment, useState } from "react";
import {
  AppBar,
  Typography,
  Grid,
  Toolbar,
  IconButton,
  Button,
  FormControl,
  NativeSelect,
} from "@material-ui/core";
import { Close,Save } from "@material-ui/icons";
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
    const [modal_Title, setmodal_Title] = useState("Add"); //modal title
    const classes = useStyles(); //custom css
    
  const add1RowInCity = () => {
    setCity([...city, { name: "" }]);
  };
  const [city, setCity] = useState([
    { name: "Jounieh" },
    { name: "Abha" },
  ]);
  const [citySelect, setCitySelect] = React.useState("");
  const handleChangeCitySelect = (event) => {
    setCitySelect(event.target.value);
  };

  const add1RowInNeighbourhood = () => {
    setNeighbourhood([...neighbourhood, { name: "" }]);
  };
  const [neighbourhood, setNeighbourhood] = useState([
    { name: "Example 1" },
    { name: "Example 2" },
  ]);
  const [neighbourhoodSelect, setNeighbourhoodSelect] = React.useState("");
  const handleChangeNeighbourhoodSelect = (event) => {
    setNeighbourhoodSelect(event.target.value);
  };


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
            {modal_Title + " Tier"}
          </Typography>
        </Toolbar>
      </AppBar>

      <div style={{ padding: "10px 30px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={5}>
            <CustomInput
              labelText="Code"
              id="dob"
              formControlProps={{
                fullWidth: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}></Grid>
          <Grid item xs={12} sm={5}>
            <CustomInput
              labelText="Name"
              id="Supplier"
              formControlProps={{
                fullWidth: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <MUIDataTable
              title="City"
              data={city}
              columns={[
                {
                  name: "name",
                  label: "Name",
                  options: {
                    filter: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                      if (value == "") {
                        return (
                          <div>
                            <FormControl className={classes.formControl}>
                              <NativeSelect
                                className={classes.selectEmpty}
                                value={citySelect}
                                name="citySelect"
                                onChange={handleChangeCitySelect}
                                inputProps={{
                                  "aria-label": "citySelect",
                                }}
                              >
                                <option value="" disabled>
                                  Select a name
                                </option>
                                <option value={1}>City 1</option>
                                <option value={2}>City 2</option>
                                <option value={3}>City 3</option>
                                <option value={4}>City 4</option>
                              </NativeSelect>
                            </FormControl>
                          </div>
                        );
                      } else {
                        return <div>{value}</div>;
                      }
                    },
                  },
                },
              ]}
              options={{
                filter: false,
                selectToolbarPlacement: "replace",
                customToolbar: () => {
                  return <CustomToolbar listener={add1RowInCity} />;
                },
                customFooter: () => null,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <MUIDataTable
              title="Neighbourhood"
              data={neighbourhood}
              columns={[
                {
                  name: "name",
                  label: "Name",
                  options: {
                    filter: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                      if (value == "") {
                        return (
                          <div>
                            <FormControl className={classes.formControl}>
                              <NativeSelect
                                className={classes.selectEmpty}
                                value={neighbourhoodSelect}
                                name="neighbourhoodSelect"
                                onChange={handleChangeNeighbourhoodSelect}
                                inputProps={{
                                  "aria-label": "neighbourhoodSelect",
                                }}
                              >
                                <option value="" disabled>
                                  Select a name
                                </option>
                                <option value={1}>Neighbourhood 1</option>
                                <option value={2}>Neighbourhood 2</option>
                                <option value={3}>Neighbourhood 3</option>
                                <option value={4}>Neighbourhood 4</option>
                              </NativeSelect>
                            </FormControl>
                          </div>
                        );
                      } else {
                        return <div>{value}</div>;
                      }
                    },
                  },
                },
              ]}
              options={{
                filter: false,

                selectToolbarPlacement: "replace",
                customToolbar: () => {
                  return <CustomToolbar listener={add1RowInNeighbourhood} />;
                },
                customFooter: () => null,
              }}
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
