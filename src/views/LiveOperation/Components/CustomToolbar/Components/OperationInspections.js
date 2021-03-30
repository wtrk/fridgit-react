import React, {useState,useEffect,useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Collapse,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Grid,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
import {Alert} from '@material-ui/lab';
import {Close,Save} from '@material-ui/icons';
import NestedTableInspections from "./NestedTableInspections.js";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    marginBottom:20
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
formControl: {
  minWidth: "100%",
}
}));

const OperationInspections = (props) => {
  const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
  const [openAlertError, setOpenAlertError] = useState(false);
  const [dataForSpareAndLabor, setDataForSpareAndLabor] = useState([]);
  const [allSpareParts, setAllSpareParts] = useState([]);
  const [allCorrectiveActions, setAllCorrectiveActions] = useState([]);
  const classes = useStyles();
  const [action, setAction] = useState("add");
  const [isLoading, setIsloading] = useState(true);
  const [inspection, setInspection] = useState();
  const cleanlinessRef = useRef()
  const temperatureRef = useRef()
  const brandingRef = useRef()
  const stateOfGoodsRef = useRef()
  const submitRef = useRef()
  const [formValues, setFormValues] = useState({
    cleanliness: "",
    temperature: "",
    branding: "",
    stateOfGoods: "",
  });
  const [formErrors, setFormErrors] = useState({
    cleanliness: {error:false,msg:""},
    temperature: {error:false,msg:""},
    branding: {error:false,msg:""},
    stateOfGoods: {error:false,msg:""},
  });

  useEffect(()=>{
      const fetchData = async () => {
        const tier = await axios(
          `${process.env.REACT_APP_BASE_URL}/operationInspections/byOperationId/${props.dataOfEntry.operation_id}`,
          {
            responseType: "json",
          }
        ).then((response) => {
          if (response.data.length){
            setAction("Update")
            setFormValues({...props.dataOfEntry , ...response.data[0]});
            setInspection(response.data[0].inspections);
          }else{
            setAction("add")
            setFormValues({...props.dataOfEntry});
          }
          setIsloading(false)
        });
      };
      fetchData();
  },[])
  //*********************Save to database */
  useEffect(()=>{
    setFormValues({ ...formValues, inspections:inspection })
  },[inspection])

  useEffect(() => {
    const fetchData = async () => {
      const sparePartsFromDb=await axios(`${process.env.REACT_APP_BASE_URL}/spareParts`, {
        responseType: "json",
      }).then((response) => {
        setAllSpareParts(response.data)
        return response.data
      })

      
      const correctiveActionsFromDb=await axios(`${process.env.REACT_APP_BASE_URL}/correctiveActions`, {
        responseType: "json",
      }).then((response) => {
        setAllCorrectiveActions(response.data)
        return response.data
      })
    };
    fetchData();
  }, []);

  const keyPressHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      switch (target.nameRef){
        case "cleanliness": temperatureRef.current.focus();break;
        case "temperature": brandingRef.current.focus();break;
        case "branding": stateOfGoodsRef.current.focus();break;
        case "stateOfGoods": submitRef.current.focus();break;
        default: cleanlinessRef.current.focus();
      }
    }
  }
    
  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const validateInputHandler = (e) => {
    const { name, value } = e.target;
    const requiredInput = value.toString().trim().length ? false : true;
    setFormErrors({ ...formErrors, [name]: {error: requiredInput, msg: "This field is required"} });
    if(name==="email"){
        const invalidEmail = !/\S+@\S+\.\S+/.test(value);
        setFormErrors({ ...formErrors, [name]: {error: invalidEmail, msg: "Enter a valid email address"} });
    }
  }
  
  const selectedSparePartsFirstRun = useRef(true);
  useEffect(() => {
    if (selectedSparePartsFirstRun.current) {
      selectedSparePartsFirstRun.current = false;
    }else{
    const fetchData = async () => {
      let dataForSpare=[]
      let dataForLabor=[]
      dataForSpareAndLabor.forEach(e=>{
        e.spareParts.forEach(eSub=>{
          let price=allSpareParts.filter(e=>e._id===eSub._id)[0].price
          dataForSpare.push({
            main_id:eSub._id,
            cabinet_id:e.cabinet_id,
            inspection_id:e.inspection_id,
            job_id:e.job_id,
            operation_id:e.operation_id,
            quantity:e.quantity,
            price:price
          })
        })
        e.correctiveActions.forEach(eSub=>{
          let price=allCorrectiveActions.filter(e=>e._id===eSub._id)[0].price
          dataForLabor.push({
            main_id:eSub._id,
            cabinet_id:e.cabinet_id,
            inspection_id:e.inspection_id,
            job_id:e.job_id,
            operation_id:e.operation_id,
            quantity:e.quantity,
            price:price
          })
        })
      })
      
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_BASE_URL}/operationSpareParts`,
      data: dataForSpare,
    })
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_BASE_URL}/operationActions`,
      data: dataForLabor,
    })
      
    };
    fetchData();
  }
  }, [dataForSpareAndLabor]);


  const handleSaveForm = async () => {

    for (const [key, value] of Object.entries(formErrors)) {
        if(value.error===true) return setOpenAlertError(true);
    }
    const idsOfCorrective=formValues.inspections.map(e=>e._id).toString()
    let dataWithQuantity=[]
    await axios(`${process.env.REACT_APP_BASE_URL}/correctiveInspections/${idsOfCorrective}`, {
      responseType: "json",
    }).then((response) => {
      formValues.inspections.forEach(e => {
        response.data.forEach(eSub=>{
          if(e._id===eSub._id){
            dataWithQuantity.push({
              ...props.dataOfEntry,
              main_id:eSub._id,
              inspection_id:e._id,
              quantity:e.quantity,
              correctiveActions: eSub.correctiveActions,
              spareParts: eSub.spareParts,
            })
          }
        })
      });
    })
    setDataForSpareAndLabor(dataWithQuantity)
    if(action==="add"){
      await axios({
        method: "post",
        url: `${process.env.REACT_APP_BASE_URL}/operationInspections`,
        data: [formValues],
      })
      .then(function (response) {
        setOpenAlertSuccess(true);
        setFormValues({
          cleanliness: "",
          temperature: "",
          branding: "",
          stateOfGoods: "",
        });
        props.setOpenDialog(false)
      })
      .catch((error) => {
        console.log(error);
      });
    }else{
      await axios({
        method: "put",
        url: `${process.env.REACT_APP_BASE_URL}/operationInspections/${formValues._id}`,
        data: [formValues],
      })
      .then(function (response) {
        setOpenAlertSuccess(true);
        props.setOpenDialog(false)
      })
      .catch((error) => {
        console.log(error);
      });
    }

  }
  return (
    <>
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
            Operation Inspections
          </Typography>
        </Toolbar>
      </AppBar>
      <Collapse in={openAlertSuccess}>
        <Alert severity="success" onClick={() => setOpenAlertSuccess(false)}>
          The Price Rule is successfully created
        </Alert>
      </Collapse>
      <Collapse in={openAlertError}>
        <Alert severity="error" onClick={() => setOpenAlertError(false)}>
          Please validate the Form and submit it again
        </Alert>
      </Collapse>
      {!isLoading ? (
        <>
          <div style={{ padding: "30px" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl} error={formErrors.cleanliness.error}>
                  <InputLabel id="cleanlinessLabel">Cleanliness</InputLabel>
                  <Select
                    labelId="cleanlinessLabel"
                    id="cleanlinessInput"
                    name="cleanliness"
                    inputRef={cleanlinessRef}
                    value={formValues.cleanliness || ""}
                    onChange={handleChangeForm}
                    onKeyDown={keyPressHandler}
                    onBlur={validateInputHandler}
                  >
                    <MenuItem value="Poor">Poor</MenuItem>
                    <MenuItem value="Good">Good</MenuItem>
                    <MenuItem value="Very Good">Very Good</MenuItem>
                  </Select>
                  {formErrors.cleanliness.error ? (
                    <FormHelperText>{formErrors.cleanliness.msg}</FormHelperText>
                  ) : null}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl} error={formErrors.temperature.error}>
                  <InputLabel id="temperatureLabel">Temperature</InputLabel>
                  <Select
                    labelId="temperatureLabel"
                    id="temperatureInput"
                    name="temperature"
                    inputRef={temperatureRef}
                    value={formValues.temperature || ""}
                    onChange={handleChangeForm}
                    onKeyDown={keyPressHandler}
                    onBlur={validateInputHandler}
                  >
                    <MenuItem value="Poor">Poor</MenuItem>
                    <MenuItem value="Good">Good</MenuItem>
                    <MenuItem value="Very Good">Very Good</MenuItem>
                  </Select>
                  {formErrors.temperature.error ? (
                    <FormHelperText>{formErrors.temperature.msg}</FormHelperText>
                  ) : null}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl} error={formErrors.branding.error}>
                  <InputLabel id="brandingLabel">Branding</InputLabel>
                  <Select
                    labelId="brandingLabel"
                    id="brandingInput"
                    name="branding"
                    inputRef={brandingRef}
                    value={formValues.branding || ""}
                    onChange={handleChangeForm}
                    onKeyDown={keyPressHandler}
                    onBlur={validateInputHandler}
                  >
                    <MenuItem value="Poor">Poor</MenuItem>
                    <MenuItem value="Good">Good</MenuItem>
                    <MenuItem value="Very Good">Very Good</MenuItem>
                  </Select>
                  {formErrors.branding.error ? (
                    <FormHelperText>{formErrors.branding.msg}</FormHelperText>
                  ) : null}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl} error={formErrors.stateOfGoods.error}>
                  <InputLabel id="stateOfGoodsLabel">State Of Goods</InputLabel>
                  <Select
                    labelId="stateOfGoodsLabel"
                    id="stateOfGoodsInput"
                    name="stateOfGoods"
                    inputRef={stateOfGoodsRef}
                    value={formValues.stateOfGoods || ""}
                    onChange={handleChangeForm}
                    onKeyDown={keyPressHandler}
                    onBlur={validateInputHandler}
                  >
                    <MenuItem value="Poor">Poor</MenuItem>
                    <MenuItem value="Good">Good</MenuItem>
                    <MenuItem value="Very Good">Very Good</MenuItem>
                  </Select>
                  {formErrors.stateOfGoods.error ? (
                    <FormHelperText>{formErrors.stateOfGoods.msg}</FormHelperText>
                  ) : null}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <div  className="mt-5">
                <NestedTableInspections arrayName={inspection} setArrayName={setInspection} title="Corrective Inspections" dbTable="correctiveInspections" />
                </div>
                </Grid>
              <Grid item xs={12} className="clientTables">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  className="btn btn--save"
                  startIcon={<Save />}
                  ref={submitRef}
                  onClick={handleSaveForm}
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
export default OperationInspections;
