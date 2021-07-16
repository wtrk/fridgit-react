import React, {useState,useEffect} from "react";
import CustomToolbar from "../../CustomToolbar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Container,
  Slide,
  TextField,
  Dialog,
  CircularProgress,
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider} from "@material-ui/core/styles";
import {datatableTheme} from "assets/css/datatable-theme.js";
import ClientDetails from "./Components/ClientDetails.js";
import AddFormDialog from "./Components/AddFormDialog.js";
import axios from 'axios';
import "./Clients.css";
import { getCookie } from 'components/auth/Helpers';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ClientsList = () => {
  const token = getCookie('token');
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]); //table items
  const [itemsBackup, setItemsBackup] = useState([]);
  const [searchValue, setSearchValue] = useState({});
  const [openAddForm, setOpenAddForm] = useState(false); //for modal
  const [openDetails, setOpenDetails] = useState(false);
  const [clientDetailsTitle, setClientDetailsTitle] = useState("");
  const [clientDetails, setClientDetails] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/clients`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`}
      }).then((response) => {
        setItems(response.data)
        setItemsBackup(response.data)
        return setIsLoading(false)
      });
    };
    fetchData();
  }, [openDetails, openAddForm]);

  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],
    selectToolbarPlacement: "replace",
    onRowsDelete: (rowsDeleted, dataRows) => {
      const idsToDelete = rowsDeleted.data.map(d => items[d.dataIndex]._id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/clients/${idsToDelete}`, {
          responseType: "json", headers: {Authorization: `Bearer ${token}`}
        }).then((response) => {
          console.log("deleted")
        });
    },
    textLabels: {
        body: {
            noMatch: !isLoading && 'Sorry, there is no matching data to display'
        },
    },
    customToolbar: () => {
      return <CustomToolbar listener={() => {
        handleAddForm();
      }} />;
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
      name: "name",
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

  const handleAddForm = () => {
    setOpenAddForm(true);
  };

  const handleCloseAddForm = () => {
    setOpenAddForm(false);
  };
  //Search component ---------------START--------------
  const handleChangeSearch = (e, newValue) => {
    if(newValue.length===0) setItems(itemsBackup); else{
      let valueToSearch=[]
      newValue.forEach(newValueEntry=>{
        valueToSearch.push(...itemsBackup.filter((e,i) => {
          if(!valueToSearch.map(eSearch=>eSearch._id).includes(e._id)){
            if (e.name.toLowerCase().includes(newValueEntry.toLowerCase())){
              return true;
            }
          } 
        }))
      })
      setItems(valueToSearch)
    }
  }
  //Search component ---------------END--------------
  return (
    <Container maxWidth="xl">
    <Autocomplete
      multiple
      freeSolo
      limitTags={3}
      id="tags-standard"
      options={[]}
      getOptionLabel={(option) => option}
      onChange={handleChangeSearch}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          placeholder="Search Data"
          label="Filter by Name"
        />
      )}
    />

      {!isLoading ? (
        <MuiThemeProvider theme={datatableTheme}>
          <MUIDataTable
            title=""
            data={items}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      ) : (
        <CircularProgress size={30} className="pageLoader" />
      )}
      <div>
        
      <Dialog
          fullScreen
          open={openAddForm}
          onClose={handleCloseAddForm}
          TransitionComponent={Transition}
        >
          <AddFormDialog
            title="Add Client"
            handleClose={handleCloseAddForm}
          />
        </Dialog>
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
        </Dialog>
      </div>
    </Container>
  );
};

export default ClientsList;
