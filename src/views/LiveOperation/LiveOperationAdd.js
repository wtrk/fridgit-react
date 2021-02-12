import React, { useState,useEffect } from "react";
import CustomToolbar from "../../CustomToolbar";
import {
  Container,
  Slide,
  TextField,
  Chip,
  Dialog,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";
import axios from 'axios';

import MUIDataTable from "mui-datatables";
import {datatableTheme} from "assets/css/datatable-theme.js";
import AddOperationForm from "./Components/AddOperationForm.js";
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LiveOperationAdd = () => {
  const [items, setItems] = useState(); //table items
  const [openAddDialog,setOpenAddDialog] = useState(false); //for modal
  const [formValuesToSave, setFormValuesToSave] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const cities = await axios(`${process.env.REACT_APP_BASE_URL}/cities`, {
        responseType: "json",
      }).then((response) => {
        setCitiesList(response.data)
        return response.data
      });
    };
    fetchData();
  }, []);
  const columns = [
    { name: "job_number", label: "Job #" },
    { name: "operation_number", label: "Operation #" },
    { name: "operation_type", label: "Operation Type" },
    { name: "sn" },
    { name: "client_name", label: "Client Name" },
    {
      name: "initiation_address",
      label: "Initiation Address",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let cityValue = "-";
          if (citiesList.filter((e) => e._id == value.city_id)[0]) {
            cityValue = citiesList.filter((e) => e._id == value.city_id)[0]
              .name;
          }
          return (
            <div style={{ width: 230, display: "flex", alignItems: "center" }}>
              <div className="avatar_circle">
                {value.city_id.substring(0, 2)}
              </div>
              <div>
                {cityValue}
                <br />
                {value ? value.area : "-"}
                <br />
                <strong>
                  {value ? value.shop_name : "-"} / {value ? value.mobile : "-"}
                </strong>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "execution_address",
      label: "Execution Address",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let cityValue = "-";
          if (citiesList.filter((e) => e._id == value.city_id)[0]) {
            cityValue = citiesList.filter((e) => e._id == value.city_id)[0]
              .name;
          }
          return (
            <div style={{ width: 230, display: "flex", alignItems: "center" }}>
              <div className="avatar_circle">
                {value.city_id.substring(0, 2)}
              </div>
              <div>
                {cityValue}
                <br />
                {value ? value.area : "-"}
                <br />
                <strong>
                  {value ? value.shop_name : "-"} / {value ? value.mobile : "-"}
                </strong>
              </div>
            </div>
          );
        },
      },
    },
  ];
  const options = {
    filter: false,
    onRowsDelete: null,
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return (
        <CustomToolbar listener={handleOpenAddDialog} />
      );
    },
  };
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };
  
    useEffect(()=>{
      console.log(formValuesToSave)
      
    const fetchData = async () => {
      await axios({
        method: "post",
        url: `${process.env.REACT_APP_BASE_URL}/liveOperations`,
        data: formValuesToSave
      })
      .then(function (response) {
        setItems(formValuesToSave)
      })
      .catch((error) => {
        console.log(error);
      });
    };
    fetchData();




    },[formValuesToSave])



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
          data={items}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>

      <div>
          
        {/*********************** -Add START- ****************************/}
        <Dialog
          maxWidth={"lg"}
          fullWidth={true}
          TransitionComponent={Transition}
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
        >
          <div style={{minHeight:"80vh",overflowX:"hidden"}}>
          <AddOperationForm setOpenDialog={setOpenAddDialog} setFormValuesToSave={setFormValuesToSave} />
          </div>
        </Dialog>

      </div>
    </Container>
  );
}
export default LiveOperationAdd;