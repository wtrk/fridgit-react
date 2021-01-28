import React, { useEffect, useState} from "react";
import PropTypes from "prop-types";
import CustomToolbar from "../../CustomToolbar";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider} from "@material-ui/core/styles";
import datatableTheme from "assets/css/datatable-theme.js";

import Autocomplete from "@material-ui/lab/Autocomplete";

import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import Moment from "react-moment";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
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
        setItems(
          response.data.map((e) => {
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
        );
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
      label: "Name",
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
      name: "profile",
      label: "Profile",
    },
    {
      name: "mobile",
      label: "Mobile",
    },
    {
      name: "email",
      label: "Email",
    },
    {
      name: "joinedDate",
      label: "Joined date",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Moment format="DD/MM/YYYY">{value}</Moment>
          );
        },
      },
    },
  ];

  const options = {
    filterType: "dropdown",
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
    }
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
        getOptionLabel={(option) => option.name || ""}
        onChange={handleChangeSearch}
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
            placeholder="Search by Name"
          />
        )}
      />

      <MuiThemeProvider theme={datatableTheme}>
        <MUIDataTable
          title=""
          data={items}
          columns={columns}
          options={options}
          className="dataTableContainer"
        />
      </MuiThemeProvider>

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
