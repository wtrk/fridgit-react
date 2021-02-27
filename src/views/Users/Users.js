import React, { useEffect, useState} from "react";
import PropTypes from "prop-types";
import CustomToolbar from "../../CustomToolbar";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider} from "@material-ui/core/styles";
import {datatableTheme} from "assets/css/datatable-theme.js";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  Typography,
  CircularProgress,
  Dialog,
  Slide,
  TextField,
  Chip,
  Container,Box
} from "@material-ui/core";

import Moment from "react-moment";
import axios from 'axios';
import AddFormDialog from "./Components/AddFormDialog.js";

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" {...props} />;
});

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function FullWidthTabs() {
  const [isLoading, setIsloading] = useState(true);
  const [items, setItems] = useState([]); //table items
  const [itemsBackup, setItemsBackup] = useState([]);
  const [userProfileList, setUserProfileList] = useState([]); //table items
  const [userTypeList, setUserTypeList] = useState([]);
  const [formTitle, setFormTitle] = useState("Add title");
  const [open, setOpen] = useState(false); //for modal
  const [userId, setUserID] = useState(); //modal title

  useEffect(() => {
    const fetchData = async () => {

      const userProfile = await axios(`${process.env.REACT_APP_BASE_URL}/userProfile`, {
        responseType: "json",
      }).then((response) => {
        setUserProfileList(response.data)
        return response.data
      });
      const users = await axios(`${process.env.REACT_APP_BASE_URL}/users`, {
        responseType: "json",
      }).then((response) => {
        let itemsDb=response.data.map((e) => {
          const userProfileItem= userProfile.filter(userProfileData=> e.profile_id===userProfileData._id)[0]
          return ({
            id: e._id,
            name: e.username,
            profile: userProfileItem ? userProfileItem.name : "",
            mobile: e.mobile,
            email:e.email,
            joinedDate:e.createdAt
          });
        })
        setItems(itemsDb);
        setItemsBackup(itemsDb)
        return setIsloading(false)
      });
      const userType = await axios(`${process.env.REACT_APP_BASE_URL}/userType`, {
        responseType: "json",
      }).then((response) => {
        setUserTypeList(response.data)
        return response.data
      });
    };
    fetchData();
  }, [open]);
  

  const columns = [
    {
      name: "id",
      options: {
        display: false,
      }
    },
    {
      name: "name",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a
                onClick={() => {
                  handleAdd("Edit User - "+value,tableMeta.rowData[0]);
                }}
              >
                {value}
              </a>
            </div>
          );
        },
      },
    },
    {
      name: "profile"
    },
    {
      name: "mobile"
    },
    {
      name: "email"
    },
    {
      name: "joinedDate",
      label: "Joined date",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Moment  format="DD MMM YYYY">{value}</Moment>
          );
        },
      },
    },
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
            handleAdd("Add New User");
          }}
        />
      );
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      const idsToDelete = rowsDeleted.data.map(d => items[d.dataIndex].id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/users/${idsToDelete}`, {
          responseType: "json",
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

  const handleAdd = (title, userId) => {
    setFormTitle(title)
    setOpen(true);
    setUserID(userId);
  };

  const handleClose = () => {
    setOpen(false);
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
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AddFormDialog
            title={formTitle}
            handleClose={handleClose}
            userProfileList={userProfileList}
            userTypeList={userTypeList}
            userId={userId}
          />
        </Dialog>
      </div>
    </Container>
  );
}
