import React, { Fragment, useState, useEffect} from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  Switch,
  TextField,
  Chip,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";
import MUIDataTable from "mui-datatables";
import {datatableTheme} from "assets/css/datatable-theme.js";
import axios from 'axios';
import { Close } from "@material-ui/icons";
import { getCookie } from 'components/auth/Helpers';


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
const Privilege = (props) => {
  const token = getCookie('token');
    const classes = useStyles(); //custom css
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState([]); //table items
    const [currentItem, setCurrentItem] = useState(); //current items
    const [currentItemId, setCurrentItemId] = useState(""); //current items
    const [currentItemRoles, setCurrentItemRoles] = useState({}); //current items

    useEffect(() => {
      const fetchData = async () => {
        await axios(`${process.env.REACT_APP_BASE_URL}/userProfile/privilege/${props.userProfileId}`, {
          responseType: "json", headers: {Authorization: `Bearer ${token}`},
        }).then((response) => {
          setItems(response.data.privilege)
          return setIsLoading(false)
        });
      };
      fetchData();
    }, []);
  
    const columns = [
      {
        name: "_id",
        options: {
          display: false,
        }
      },
      {
        name: "page",
        label: "Page"
      },
      {
        name: "role",
        label: "Can View",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div>
                <Switch
                  checked={value.can_view === 1 ? true : false}
                  color="primary"
                  name="can_view"
                  inputProps={{ "aria-label": "primary checkbox" }}
                  onChange={(event) => {handleChangeSwitch(event,tableMeta.rowData[0])}}
                />
              </div>
            );
          },
        },
      },
      {
        name: "role",
        label: "Can Edit",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div>
                <Switch
                  checked={value.can_edit === 1 ? true : false}
                  color="primary"
                  name="can_edit"
                  inputProps={{ "aria-label": "primary checkbox" }}
                  onChange={(event) => {handleChangeSwitch(event,tableMeta.rowData[0])}}
                />
              </div>
            );
          },
        },
      },
      {
        name: "role",
        label: "Can Delete",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div>
                <Switch
                  checked={value.can_delete === 1 ? true : false}
                  color="primary"
                  name="can_delete"
                  inputProps={{ "aria-label": "primary checkbox" }}
                  onChange={(event) => {handleChangeSwitch(event,tableMeta.rowData[0])}}
                />
              </div>
            );
          },
        },
      }
    ];
  
    const options = {
      filter: false,
      onRowsDelete: null,
      rowsPerPage: 20,
      rowsPerPageOptions: [20, 50, 100],
      selectToolbarPlacement: "replace",
      onRowsDelete: (rowsDeleted, dataRows) => {
        const idsToDelete = rowsDeleted.data.map(d => items[d.dataIndex]._id); // array of all ids to to be deleted
          axios.delete(`${process.env.REACT_APP_BASE_URL}/userProfile/${idsToDelete}`, {
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

const handleChangeSwitch = (event,rowId) => {
  const {name,checked}=event.target
  const checkedNum=checked===true ? 1 : 0;

  let currentRoleObject=items.filter(e=> e._id===rowId)[0]
  setCurrentItem(currentRoleObject)
  setCurrentItemRoles({...currentRoleObject.role,[name]: checkedNum})
  setCurrentItemId(rowId)
}


useEffect(() => {
  setCurrentItem({...currentItem, role:currentItemRoles})
  if(currentItemId){
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_BASE_URL}/userProfile/privilege/${props.userProfileId}/${currentItemId}`,
      headers: {Authorization: `Bearer ${token}`},
      data: currentItemRoles,
    })
      .then(function (response) {})
      .catch((error) => {
        console.log(error);
      });
  }
}, [currentItemRoles]);

useEffect(() => {
  let allItems=items.map(e => {
    if(e._id===currentItem._id) return currentItem
    return e
  })
  setItems(allItems)
}, [currentItem]);


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
    <Fragment>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Close onClick={props.handleClose} className="btnIcon" />
          <Typography variant="h6" className={classes.title}>
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ padding: "10px 30px" }}>
    <Autocomplete
      id="tags-filled"
      options={items || {}}
      value={searchValue || {}}
      getOptionLabel={(option) => option.name || ""}
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
      </div>
    </Fragment>
  );
};

export default Privilege;
