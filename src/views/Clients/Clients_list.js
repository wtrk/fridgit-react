import React, {useState,useEffect} from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Container,
  Slide,
  Chip,
  TextField,
  Dialog,
  CircularProgress,
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider} from "@material-ui/core/styles";
import {datatableTheme} from "assets/css/datatable-theme.js";
import ClientDetails from "./Components/ClientDetails.js";
import axios from 'axios';
import "./Clients.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ClientsList = () => {
  const [isLoading, setIsloading] = useState(true);
  const [items, setItems] = useState([]); //table items
  const [openDetails, setOpenDetails] = useState(false);
  const [clientDetailsTitle, setClientDetailsTitle] = useState("");
  const [clientDetails, setClientDetails] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/clients`, {
        responseType: "json",
      }).then((response) => {
        setItems(response.data)
        return setIsloading(false)
      });
    };
    fetchData();
  }, [openDetails]);

  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 100, 50],
    selectToolbarPlacement: "replace",
    textLabels: {
        body: {
            noMatch: !isLoading && 'Sorry, there is no matching data to display'
        },
    },
  };
  const columns = [
    {
      name: "_id",
      options: {
        display: false,
      }
    },
    {
      name: "company",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return <a onClick={() => handleOpenDetails("Client Details",tableMeta.rowData[0])}>
            {value}
          </a>
        },
      },
    },
    { name: "address"},
    { name: "phone"},
    { name: "email",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <a href={"mailto:" + value}>{value}</a>;
        },
      },
    },
  ];
  const top100Films = [];
  const handleCloseDetails = () =>{
    setOpenDetails(false)
  }
  const handleOpenDetails = (title, clientId) => {
    setOpenDetails(true);
    setClientDetails(items.filter(e=> e._id===clientId));
    setClientDetailsTitle(title);
  }

  //Search component ---------------START--------------
  const [itemsBackup, setItemsBackup] = useState([]);
  const [searchValue, setSearchValue] = useState({});
  const handleChangeSearch = (e, newValue) => {
    if(itemsBackup.length===0) setItemsBackup(items)
    setSearchValue(newValue)
    if(newValue===null) setItems(itemsBackup); else setItems([newValue])
  }
  //Search component ---------------END--------------
  return (
    <Container maxWidth="xl">
    <Autocomplete
      id="tags-filled"
      options={items || {}}
      value={searchValue || {}}
      getOptionLabel={(option) => option.company || ""}
      onChange={handleChangeSearch}
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
          placeholder="Search by Name"
        />
      )}
    />
      <MuiThemeProvider theme={datatableTheme}>
        <MUIDataTable
          title={isLoading && <CircularProgress  size={30} style={{position:"absolute",top:130,zIndex:100}} />}
          data={items}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
      <div>
        <Dialog
          fullScreen
          open={openDetails}
          onClose={handleCloseDetails}
          TransitionComponent={Transition}
        >
          <ClientDetails
            handleClose={handleCloseDetails}
            title={clientDetailsTitle}
            data={clientDetails[0]}
            
          />
          {/* <SubTables
            title={formTitle}
            handleClose={handleCloseAddForm}
            countryId={countryId}
          /> */}
        </Dialog>
      </div>
    </Container>
  );
};

export default ClientsList;
