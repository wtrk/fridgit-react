import React, { Fragment, useState } from "react";
import CustomToolbar from "CustomToolbar";
import MUIDataTable from "mui-datatables";
import { Close, Save } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Typography,
  Grid,
  Button,
  Toolbar,
  IconButton,
  FormControl,
  NativeSelect,
  TextField,
  Container
} from "@material-ui/core";
import "../Price_rules.css";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    minWidth: "100%",
  },
}));
const SubTables = (props) => {
  const classes = useStyles(); //custom css
    
  const add1RowInCustomerIn = () => {
    setCustomerIn([...customerIn, { name: "" }]);
  };
  const [customerIn, setCustomerIn] = useState([{ name: "Client1" }]);
  const [customerInSelect, setCustomerInSelect] = React.useState("");
  const handleChangeCustomerInSelect = (event) => {
    setCustomerInSelect(event.target.value);
  };

  const add1RowInCountryIn = () => {
    setCountryIn([...countryIn, { name: "" }]);
  };
  const [countryIn, setCountryIn] = useState([
    { name: "Lebanon" },
    { name: "Ksa" },
  ]);
  const [countryInSelect, setCountryInSelect] = React.useState("");
  const handleChangeCountryInSelect = (event) => {
    setCountryInSelect(event.target.value);
  };

  const add1RowInCityIn = () => {
    setCityIn([...cityIn, { name: "" }]);
  };
  const [cityIn, setCityIn] = useState([
    { name: "Beirut" },
    { name: "Jeddah" },
  ]);
  const [cityInSelect, setCityInSelect] = React.useState("");
  const handleChangeCityInSelect = (event) => {
    setCityInSelect(event.target.value);
  };

  const add1RowInCityOut = () => {
    setCityOut([...cityOut, { name: "" }]);
  };
  const [cityOut, setCityOut] = useState([
    { name: "Jounieh" },
    { name: "Abha" },
  ]);
  const [cityOutSelect, setCityOutSelect] = React.useState("");
  const handleChangeCityOutSelect = (event) => {
    setCityOutSelect(event.target.value);
  };

  const add1RowInNeighbourhoodIn = () => {
    setNeighbourhoodIn([...neighbourhoodIn, { name: "" }]);
  };
  const [neighbourhoodIn, setNeighbourhoodIn] = useState([
    { name: "Example 1" },
    { name: "Example 2" },
  ]);
  const [neighbourhoodInSelect, setNeighbourhoodInSelect] = React.useState("");
  const handleChangeNeighbourhoodInSelect = (event) => {
    setNeighbourhoodInSelect(event.target.value);
  };

  const add1RowInNeighbourhoodOut = () => {
    setNeighbourhoodOut([...neighbourhoodOut, { name: "" }]);
  };
  const [neighbourhoodOut, setNeighbourhoodOut] = useState([
    { name: "Example 1" },
    { name: "Example 2" },
  ]);
  const [neighbourhoodOutSelect, setNeighbourhoodOutSelect] = React.useState(
    ""
  );
  const handleChangeNeighbourhoodOutSelect = (event) => {
    setNeighbourhoodOutSelect(event.target.value);
  };

  const add1RowInTierIn = () => {
    setTierIn([...tierIn, { name: "" }]);
  };
  const [tierIn, setTierIn] = useState([
    { name: "Example 1" },
    { name: "Example 2" },
  ]);
  const [tierInSelect, setTierInSelect] = React.useState("");
  const handleChangeTierInSelect = (event) => {
    setTierInSelect(event.target.value);
  };

  const add1RowInTierOut = () => {
    setTierOut([...tierOut, { name: "" }]);
  };
  const [tierOut, setTierOut] = useState([
    { name: "Example 1" },
    { name: "Example 2" },
  ]);
  const [tierOutSelect, setTierOutSelect] = React.useState(
    ""
  );
  const handleChangeTierOutSelect = (event) => {
    setTierOutSelect(event.target.value);
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
          {props.modalTitle + " Price Rule"}
        </Typography>
      </Toolbar>
    </AppBar>

    <Container maxWidth="xl">
            <div className="overlay-form">
              <div
                style={{
                  marginBottom: "30px",
                }}
              >
                <TextField
                  id="input-111"
                  defaultValue="Example"
                  label="Name"
                  className="overlay-form__input--top"
                />
                <TextField
                  id="input-12"
                  defaultValue="Ipsum"
                  label="Service"
                  className="overlay-form__input--top"
                />
              </div>
              
              <h3>Job Fees</h3>
              <div
                style={{
                  marginBottom: "30px",
                }}
              >
                <TextField
                  id="input-1"
                  defaultValue="5"
                  label="Handling IN / OUT ($)"
                  className="overlay-form__input"
                />
                <TextField
                  id="input-2"
                  defaultValue="0.35"
                  label="Storage/CBM/DAY ($)"
                  className="overlay-form__input"
                />
                <TextField
                  id="input-3"
                  defaultValue="50"
                  label="In House Preventive Maintenance ($)"
                  className="overlay-form__input"
                />
                <TextField
                  id="input-4"
                  defaultValue="35"
                  label="Corrective Service In House ($"
                  className="overlay-form__input"
                />
                <TextField
                  id="input-5"
                  defaultValue="8"
                  label="Cabinet Testing Fees"
                  className="overlay-form__input"
                />
                <TextField
                  id="input-6"
                  defaultValue=""
                  label="Branding Fees/m2"
                  className="overlay-form__input"
                />
                <TextField
                  id="input-6"
                  defaultValue=""
                  label="Drop"
                  className="overlay-form__input"
                />
              </div>
              <h3>Transportation Fees</h3>
              <div>
                <TextField
                  id="input-7"
                  defaultValue="35"
                  label="Transp./CBM"
                  className="overlay-form__input"
                />
                <TextField
                  id="input-8"
                  defaultValue="100"
                  label="Transp. for 1 Unit"
                  className="overlay-form__input"
                />
                <TextField
                  id="input-9"
                  defaultValue="120"
                  label="MinCharge"
                  className="overlay-form__input"
                />
                <TextField
                  id="input-10"
                  defaultValue="80"
                  label="Preventive Maintenance"
                  className="overlay-form__input"
                />
                <TextField
                  id="input-11"
                  defaultValue="20"
                  label="Exchange Corrective Reaction"
                  className="overlay-form__input"
                />
                <TextField
                  id="input-12"
                  defaultValue="140"
                  label="Corrective Reaction"
                  className="overlay-form__input"
                />
              </div>
            </div>
            
            <h3>Conditions</h3>
      <Grid container spacing={3} style={{marginBottom:"4rem"}}>
        <Grid item xs={12}>
          <MUIDataTable
            title="Customers"
            data={customerIn}
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
                              value={customerInSelect}
                              name="customerInSelect"
                              onChange={handleChangeCustomerInSelect}
                              inputProps={{
                                "aria-label": "customerInSelect",
                              }}
                            >
                              <option value="" disabled>
                                Select a name
                              </option>
                              <option value={1}>Client 1</option>
                              <option value={2}>Client 2</option>
                              <option value={3}>Client 3</option>
                              <option value={4}>Client 4</option>
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
              filter:false,
              selectToolbarPlacement: "replace",
              customToolbar: () => {
                return <CustomToolbar listener={add1RowInCustomerIn} />;
              },
              customFooter: () => null,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <MUIDataTable
            title="Country"
            data={countryIn}
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
                              value={countryInSelect}
                              name="countryInSelect"
                              onChange={handleChangeCountryInSelect}
                              inputProps={{
                                "aria-label": "countryInSelect",
                              }}
                            >
                              <option value="" disabled>
                                Select a name
                              </option>
                              <option value={1}>Client 1</option>
                              <option value={2}>Client 2</option>
                              <option value={3}>Client 3</option>
                              <option value={4}>Client 4</option>
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
              filter:false,
              selectToolbarPlacement: "replace",
              customToolbar: () => {
                return <CustomToolbar listener={add1RowInCountryIn} />;
              },
              customFooter: () => null,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <MUIDataTable
            title="City In"
            data={cityIn}
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
                              value={cityInSelect}
                              name="cityInSelect"
                              onChange={handleChangeCityInSelect}
                              inputProps={{
                                "aria-label": "cityInSelect",
                              }}
                            >
                              <option value="" disabled>
                                Select a name
                              </option>
                              <option value={1}>Client 1</option>
                              <option value={2}>Client 2</option>
                              <option value={3}>Client 3</option>
                              <option value={4}>Client 4</option>
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
              filter:false,
              selectToolbarPlacement: "replace",
              customToolbar: () => {
                return <CustomToolbar listener={add1RowInCityIn} />;
              },
              customFooter: () => null,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <MUIDataTable
            title="City Out"
            data={cityOut}
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
                              value={cityOutSelect}
                              name="cityOutSelect"
                              onChange={handleChangeCityOutSelect}
                              inputProps={{
                                "aria-label": "cityOutSelect",
                              }}
                            >
                              <option value="" disabled>
                                Select a name
                              </option>
                              <option value={1}>Client 1</option>
                              <option value={2}>Client 2</option>
                              <option value={3}>Client 3</option>
                              <option value={4}>Client 4</option>
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
              filter:false,
              selectToolbarPlacement: "replace",
              customToolbar: () => {
                return <CustomToolbar listener={add1RowInCityOut} />;
              },
              customFooter: () => null,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <MUIDataTable
            title="Neighbourhood In"
            data={neighbourhoodIn}
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
                              value={neighbourhoodInSelect}
                              name="neighbourhoodInSelect"
                              onChange={handleChangeNeighbourhoodInSelect}
                              inputProps={{
                                "aria-label": "neighbourhoodInSelect",
                              }}
                            >
                              <option value="" disabled>
                                Select a name
                              </option>
                              <option value={1}>Client 1</option>
                              <option value={2}>Client 2</option>
                              <option value={3}>Client 3</option>
                              <option value={4}>Client 4</option>
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
              filter:false,
              
              selectToolbarPlacement: "replace",
              customToolbar: () => {
                return (
                  <CustomToolbar listener={add1RowInNeighbourhoodIn} />
                );
              },
              customFooter: () => null,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <MUIDataTable
            title="Neighbourhood Out"
            data={neighbourhoodOut}
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
                              value={neighbourhoodOutSelect}
                              name="neighbourhoodOutSelect"
                              onChange={
                                handleChangeNeighbourhoodOutSelect
                              }
                              inputProps={{
                                "aria-label": "neighbourhoodOutSelect",
                              }}
                            >
                              <option value="" disabled>
                                Select a name
                              </option>
                              <option value={1}>Client 1</option>
                              <option value={2}>Client 2</option>
                              <option value={3}>Client 3</option>
                              <option value={4}>Client 4</option>
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
              filter:false,
              selectToolbarPlacement: "replace",
              customToolbar: () => {
                return (
                  <CustomToolbar listener={add1RowInNeighbourhoodOut} />
                );
              },
              customFooter: () => null,
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <MUIDataTable
            title="Tier In"
            data={tierIn}
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
                              value={tierInSelect}
                              name="tierInSelect"
                              onChange={handleChangeTierInSelect}
                              inputProps={{
                                "aria-label": "tierInSelect",
                              }}
                            >
                              <option value="" disabled>
                                Select a name
                              </option>
                              <option value={1}>Client 1</option>
                              <option value={2}>Client 2</option>
                              <option value={3}>Client 3</option>
                              <option value={4}>Client 4</option>
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
              filter:false,
              
              selectToolbarPlacement: "replace",
              customToolbar: () => {
                return (
                  <CustomToolbar listener={add1RowInTierIn} />
                );
              },
              customFooter: () => null,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <MUIDataTable
            title="Tier Out"
            data={tierOut}
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
                              value={tierOutSelect}
                              name="tierOutSelect"
                              onChange={
                                handleChangeTierOutSelect
                              }
                              inputProps={{
                                "aria-label": "tierOutSelect",
                              }}
                            >
                              <option value="" disabled>
                                Select a name
                              </option>
                              <option value={1}>Client 1</option>
                              <option value={2}>Client 2</option>
                              <option value={3}>Client 3</option>
                              <option value={4}>Client 4</option>
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
              filter:false,
              selectToolbarPlacement: "replace",
              customToolbar: () => {
                return (
                  <CustomToolbar listener={add1RowInTierOut} />
                );
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
    </Container>
  
      </Fragment>
  );
};

export default SubTables;
