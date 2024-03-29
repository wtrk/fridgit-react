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
import { getCookie } from 'components/auth/Helpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
const SurveyForPreventive = (props) => {
  const token = getCookie('token');
    const classes = useStyles(); //custom css
    const [fridgeTypeId,setFridgeTypeId]=useState()
    const [preventiveActionsIds,setPreventiveActionsIds]=useState()
    const [isLoading, setIsLoading] = useState(true);
    const [items,setItems]=useState()
    const [preventiveActions,setPreventiveActions]=useState([])
    const [errorMessage,setErrorMessage]=useState([])

    useEffect(() => {
      const fetchData = async () => {
        const actionsFromDb=await axios(`${process.env.REACT_APP_BASE_URL}/cabinets/${props.dataOfEntry.cabinet_id}`, {
          responseType: "json", headers: {Authorization: `Bearer ${token}`},
        }).then((response) => {
          const preventiveFilteredByON=response.data.preventive.filter(e=>e.operation_number===props.dataOfEntry.operation_id)
          setPreventiveActions(preventiveFilteredByON)
          setPreventiveActionsIds(preventiveFilteredByON.map(e=>e.preventiveActions_id))
          return response.data
        }).then((response) => {
          setFridgeTypeId(response.type)
        })
      };
      fetchData();
    }, []);

    const fridgesTypesFirstRun = useRef(true);
    useEffect(() => {
      if(preventiveActions.length===0){
        const fetchData = async () => {
          if (fridgesTypesFirstRun.current) {
            fridgesTypesFirstRun.current = false;
          }else{
            await axios(`${process.env.REACT_APP_BASE_URL}/fridgesTypes/${fridgeTypeId}`, {
              responseType: "json", headers: {Authorization: `Bearer ${token}`},
            }).then((response) => {
              setPreventiveActions(response.data.preventive)
              setPreventiveActionsIds(response.data.preventive.map(e=>e.preventiveActions_id))
            })
          }
        };
        fetchData();
      }
    }, [fridgeTypeId]);
    

    const preventiveActionsFirstRun = useRef(true);
    useEffect(() => {
      const fetchData = async () => {
        if (preventiveActionsFirstRun.current) {
          preventiveActionsFirstRun.current = false;
        }else{
               const actionsFromDb = await axios(
                 `${process.env.REACT_APP_BASE_URL}/preventiveActions`,{responseType: "json", headers: {Authorization: `Bearer ${token}`}}
               ).then((response) => {
                 setItems(response.data.filter((e, i) => preventiveActionsIds.includes(e._id)));
                 return setIsLoading(false);
               });
             }
      };
      fetchData();
    }, [preventiveActionsIds]);

    const handleChangeAnswer = (newValue,trueAnswer) =>{
      if(newValue){
        setPreventiveActions(preventiveActions.map(e=>{
          if(e.preventiveActions_id===trueAnswer){
            e.rightAnswer_id=newValue._id
            e.reportable=newValue.reportable
            e.obligatory=newValue.obligatory
          }
          return e
        })
        )
      }
    }
    
    const handleChangeForm = (e,rowId) => {
      const { name, value } = e.target;
      setPreventiveActions(preventiveActions.map(e=>{
        if(e.preventiveActions_id===rowId) e.notes=value
        return e
      }))
    };
    const handleClickSave = async () => {
      if(preventiveActions.filter(e=>!e.rightAnswer_id).length===0){
        if(preventiveActions.filter(e=>e.obligatory===true&&!e.notes).length===0){
          await axios({
            method: "PUT",
            url: `${process.env.REACT_APP_BASE_URL}/cabinets/${props.dataOfEntry.cabinet_id}`,
            headers: {Authorization: `Bearer ${token}`},
            data: [{"preventive":preventiveActions.map(e=>{
              e.operation_number=props.dataOfEntry.operation_id
              e.date=new Date()
              return e
            })}],
          })
          .then(function (response) {
            setErrorMessage("")
            toast.success("Successfully Updated", {onClose: () => props.setOpenDialog(false)});
          })
          .catch((error) => {
            console.log(error);
          });
        }else{
          setErrorMessage("You should fill the notes for every answer  with asterisks(*) selected!")
        }
      }else{
        setErrorMessage("Please fill all the answers!")
      }
    }
    let columns = [
      {
        name: "_id",
        options: {
          display: false,
        },
      },
      { name: "name",label: "Name" },
      { name: "nameAr",label: "Name Arabic" },
      {
        name: "answers",label: "Answers",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            let rightAnswerId=preventiveActions.filter(e=>e.preventiveActions_id===tableMeta.rowData[0])[0].rightAnswer_id
            
            return <Autocomplete
            options={value || {}}
            value={value.find(e=>e._id===rightAnswerId) || {}}
            getOptionLabel={(option) =>{
              if(Object.keys(option).length!==0){
                return option.obligatory===true ? option.name+"*" : option.name
              }
              return ""
            }}
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
        name: "notes",label: "Notes",
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
      <ToastContainer />
        <AppBar className={classes.appBar}>
                 {console.log("items",items)}
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
                  <div className="font-weight-bold">
                    When any answer with asterisks(*) is chosen, notes are required to be filled<br/>
                    <span className="text-danger">{errorMessage}</span>
                  </div>
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
export default SurveyForPreventive;
