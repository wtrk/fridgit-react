import React, { useState, useEffect } from "react";
import CustomToolbar from "../../CustomToolbar";
import {
  Container,
  Dialog,
  Slide,
  TextField,
  Chip,
  CircularProgress,
} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";

import FilterComponent from "components/CustomComponents/FilterComponent.js";
import { MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import {datatableTheme} from "assets/css/datatable-theme.js";
import SubTables from "./Components/SubTables.js";
import Moment from "react-moment";
import { getCookie } from '../../components/auth/Helpers';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Invoices = () => {
  const token = getCookie('token');
  const [isLoading, setIsLoading] = useState(true);
  const [openAddForm, setOpenAddForm] = useState(false); //for modal
  const [invoiceId, setInvoiceID] = useState(); //modal title
  const [formTitle, setFormTitle] = useState("Add"); //modal title
  const [filterDialog,setFilterDialog] = useState(false)
  const [items, setItems] = useState([]); //table items
  const [clientsList, setClientsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [itemsBackup, setItemsBackup] = useState([]);
  const [newRefNum, setNewRefNum] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
        await axios.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/users`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/clients`,{headers: {Authorization: `Bearer ${token}`}})
        ])
        .then(response => {
          setUsersList(response[0].data)
          setClientsList(response[1].data)
        })
    };
    fetchData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/invoices`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`},
      }).then((response) => {
        setNewRefNum(Math.max(...response.data.map(e=>e.reference_number))+1)
        setItems(response.data)
        setItemsBackup(response.data)
        return setIsLoading(false)
      });
    };
    fetchData();
  }, [openAddForm]);

  const columns = [
    {
      name: "_id",
      options: {
        display: false,
      }
    },
    {
      name: "reference_number",
      label:"Reference #"
    },
    {
      name: "name",
      label: "Notes",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a onClick={() => {handleAdd("Edit Invoice - "+tableMeta.rowData[1],tableMeta.rowData[0]);}}>
                {value}
              </a>
            </div>
          );
        },
      },
    },
    {
      name: "user_id",
      label: "User Name",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value) {
            let userValue = usersList.find((e) => e._id == value);
            return userValue ? userValue.name : "-";
          }
        },
      },
    },
    {
      name: "client_id",
      label: "Client Name",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value) {
            let clientValue = clientsList.find((e) => e._id == value);
            return clientValue ? clientValue.name : "-";
          }
        },
      },
    },
    {
      name: "createdAt",label: "date",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return value?<Moment format="DD MMM YYYY">{value}</Moment>:"-"
        },
      },
    },
    {
      name: "from",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return value?<Moment format="DD MMM YYYY">{value}</Moment>:"-"
        },
      },
    },
    {
      name: "to",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return value?<Moment format="DD MMM YYYY">{value}</Moment>:"-"
        },
      },
    },
    {name: "total"}
  ];

  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return (
        <CustomToolbar
          listener={() => {
            handleAdd("Add New Invoice");
          }}
          handleFilter={handleFilter}
        />
      );
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      const idsToDelete = rowsDeleted.data.map(d => items[d.dataIndex]._id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/invoices/${idsToDelete}`, {
          responseType: "json", headers: {Authorization: `Bearer ${token}`},
        }).then((response) => {
          console.log("deleted")
        });
    },
    textLabels: {
        body: {
            noMatch: !isLoading && 'Sorry, there is no matching data to display'
        },
    },
  };
  const handleFilter = () => {
    setFilterDialog(true)
  };

  const handleAdd = (title, invoiceId) => {
    setOpenAddForm(true);
    setInvoiceID(invoiceId);
    setFormTitle(title);
  };
  const handleCloseAddForm = () => setOpenAddForm(false)

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
          <SubTables
            title={formTitle}
            handleClose={handleCloseAddForm}
            invoiceId={invoiceId}
            usersList={usersList}
            clientsList={clientsList}
            newRefNum={newRefNum}
          />
        </Dialog>
        {/*********************** FILTER start ****************************/}
        <Dialog
          onClose={() => setFilterDialog(false)}
          maxWidth={"xl"}
          fullWidth
          aria-labelledby="customized-dialog-title"
          open={filterDialog}
        >
          <FilterComponent setOpenDialog={setFilterDialog} />
        </Dialog>
      </div>
    </Container>
  );
}
export default Invoices