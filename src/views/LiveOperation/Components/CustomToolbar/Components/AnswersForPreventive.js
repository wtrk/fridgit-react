import React, {useState,useRef,useEffect} from "react";
import {
  TextField,
  AppBar,
  Typography,
  Toolbar,
  CircularProgress,
  Grid,
  Button
} from "@material-ui/core";
import {Close,Save} from '@material-ui/icons';
import { MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import {pricesDataTableTheme} from "assets/css/datatable-theme.js";
import {Autocomplete} from '@material-ui/lab';
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';

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
  }
}));
const AnswersForPreventive = (props) => {
    const classes = useStyles(); //custom css
    const [fridgeTypeId,setFridgeTypeId]=useState()
    const [preventiveActionsIds,setPreventiveActionsIds]=useState()
    const [isLoading, setIsloading] = useState(true);
    const [items,setItems]=useState()
    const [preventiveActions,setPreventiveActions]=useState([])

    useEffect(() => {
      const fetchData = async () => {
        const actionsFromDb=await axios(`${process.env.REACT_APP_BASE_URL}/cabinets/${props.dataOfEntry.cabinet_id}`, {
          responseType: "json",
        }).then((response) => {
          setFridgeTypeId(response.data.type)
        })
      };
      fetchData();
    }, []);

    const fridgesTypesFirstRun = useRef(true);
    useEffect(() => {
      const fetchData = async () => {
        if (fridgesTypesFirstRun.current) {
          fridgesTypesFirstRun.current = false;
        }else{
          await axios(`${process.env.REACT_APP_BASE_URL}/fridgesTypes/${fridgeTypeId}`, {
            responseType: "json",
          }).then((response) => {
            setPreventiveActions(response.data.preventive)
            setPreventiveActionsIds(response.data.preventive.map(e=>e.preventiveActions_id))
          })
        }
      };
      fetchData();
    }, [fridgeTypeId]);
    

    const preventiveActionsFirstRun = useRef(true);
    useEffect(() => {
      const fetchData = async () => {
        if (preventiveActionsFirstRun.current) {
          preventiveActionsFirstRun.current = false;
        }else{
               const actionsFromDb = await axios(
                 `${process.env.REACT_APP_BASE_URL}/preventiveActions`,
                 {
                   responseType: "json",
                 }
               ).then((response) => {
                 setItems(response.data.filter((e, i) => preventiveActionsIds.includes(e._id)));
                 return setIsloading(false);
               });
             }
      };
      fetchData();
    }, [preventiveActionsIds]);

    const handleChangeAnswer = (newValue,trueAnswer) =>{
      setPreventiveActions(preventiveActions.map(e=>{
        if(e.preventiveActions_id===trueAnswer) e.rightAnswer_id=newValue._id
        return e
      })
      )
    }
    
    const handleChangeForm = (e,rowId) => {
      const { name, value } = e.target;
      setPreventiveActions(preventiveActions.map(e=>{
        if(e.preventiveActions_id===rowId) e.notes=value
        return e
      }))
    };
    const handleClickSave = async () => {
      await axios({
        method: "put",
        url: `${process.env.REACT_APP_BASE_URL}/fridgesTypes/${fridgeTypeId}`,
        data: [{"preventive":preventiveActions}],
      })
      .then(function (response) {
        props.setOpenDialog(false)
      })
      .catch((error) => {
        console.log(error);
      });
    }
    let columns = [
      {
        name: "_id",
        options: {
          display: false,
        },
      },
      { name: "name" },
      { name: "nameAr" },
      {
        name: "answers",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            let rightAnswerId=preventiveActions.filter(e=>e.preventiveActions_id===tableMeta.rowData[0])[0].rightAnswer_id
            
            return <Autocomplete
            options={value || {}}
            value={value.filter(e=>e._id===rightAnswerId)[0] || {}}
            getOptionLabel={(option) => Object.keys(option).length!==0 ? option.name : ""}
            style={{width:"300px"}}
            onChange={(e,newValue)=>handleChangeAnswer(newValue,tableMeta.rowData[0])}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Answers"
              />
            )}
          />;
          },
        },
      },
      {
        name: "notes",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            let rightAnswerNotes=preventiveActions.filter(e=>e.preventiveActions_id===tableMeta.rowData[0])[0].notes
            
            return <TextField
            label="Notes"
            name="notes"
            onChange={(e)=>handleChangeForm(e,tableMeta.rowData[0])}
            fullWidth
            value={rightAnswerNotes}
          />
          },
        },
      },
    ];
    
    const options = {
      filter:false, sort: false,
      rowsPerPage: 100,
      selectableRows: false,
      customFooter: () => ""
    };



    return (
      <>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Close
              onClick={() => props.setOpenDialog(false)}
              className="btnIcon"
            />
            <Typography variant="h6" className={classes.title}>
            Preventive Actions
            </Typography>
          </Toolbar>
        </AppBar>
        {!isLoading ? (
          <>
            <div style={{ padding: "30px" }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <MuiThemeProvider theme={pricesDataTableTheme}>
                    <MUIDataTable
                      title="Preventive Actions"
                      data={items}
                      columns={columns}
                      options={options}
                    />
                  </MuiThemeProvider>
                </Grid>
                <Grid item xs={12} className="clientTables">
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className="btn btn--save"
                    type="submit"
                    startIcon={<Save />}
                    onClick={handleClickSave}
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
          </>
        ) : (
          <CircularProgress size={30} className="pageLoader" />
        )}
      </>
    );
}
export default AnswersForPreventive;
