import React, {useState,useEffect,useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Button,
  CircularProgress,
} from "@material-ui/core";
import {Close,Save} from '@material-ui/icons';
import NestedTableSpare from "./NestedTableSpare";
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
const OperationActions = (props) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [insertedItems, setInsertedItems] = useState([]);
  const [quantityUpdated, setQuantityUpdated] = useState([]);
  const [priceUpdated, setPriceUpdated] = useState([]);
  const [selectedSpareParts, setSelectedSpareParts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {

      const actionsFromDb=await axios(`${process.env.REACT_APP_BASE_URL}/correctiveActions`, {
        responseType: "json",
      }).then((response) => {
        const actionsIncluded=[]
        response.data.forEach(e=>{
          props.actionsSelected.forEach(subE => {
            if(subE.main_id===e._id) actionsIncluded.push({...e,...subE}) 
            
          })
        })
        setItems(actionsIncluded)
        return setIsLoading(false)
      })
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    if(items.length){
      setTotalPrice(items.length>1?items.map((e)=>parseInt(e.price)*parseInt(e.quantity)||0).reduce((a,b)=>a+b):items[0].price*items[0].quantity)
    }
  }, [items]);
  
const quantityUpdateFirstRun = useRef(true);
  useEffect(() => {
    if (quantityUpdateFirstRun.current) {
      quantityUpdateFirstRun.current = false;
    }else{
    const fetchData = async () => {
      const {name, quantity}=quantityUpdated
      const idOfUpdated=items.filter(e=>e.name==name).length?items.filter(e=>e.name==name)[0]._id:null
      
      await axios({
        method: "put",
        url: `${process.env.REACT_APP_BASE_URL}/operationActions/${idOfUpdated}`,
        data: [{"quantity": quantity}]
      })
      
      await axios({
        method: "put",
        url: `${process.env.REACT_APP_BASE_URL}/financial/byOperationNumber/${props.dataOfEntry.operation_id}`,
        data: [{ labor: totalPrice }],
      });
    };
    fetchData();
  }
  }, [quantityUpdated]);

  const priceUpdateFirstRun = useRef(true);
  useEffect(() => {
    if (priceUpdateFirstRun.current) {
      priceUpdateFirstRun.current = false;
    }else{
    const fetchData = async () => {
      const {name, price}=priceUpdated
      const idOfUpdated=items.filter(e=>e.name==name).length?items.filter(e=>e.name==name)[0]._id:null
      
      await axios({
        method: "put",
        url: `${process.env.REACT_APP_BASE_URL}/operationActions/${idOfUpdated}`,
        data: [{"price": price}]
      })
      
      await axios({
        method: "put",
        url: `${process.env.REACT_APP_BASE_URL}/financial/byOperationNumber/${props.dataOfEntry.operation_id}`,
        data: [{ labor: totalPrice }],
      });
    };
    fetchData();
  }
  }, [priceUpdated]);

  const selectedSparePartsFirstRun = useRef(true);
  useEffect(() => {
    if (selectedSparePartsFirstRun.current) {
      selectedSparePartsFirstRun.current = false;
    }else{
    const fetchData = async () => {
      
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_BASE_URL}/operationSpareParts`,
      data: selectedSpareParts,
    })
      
    };
    fetchData();
  }
  }, [selectedSpareParts]);
const handleSaveForm = async () => {
  let sparePartsWithQuantities=[]
  let sparePartsIds=[]
  let insertedItemsToSave=insertedItems.map(e=>{
    if(e.spareParts.length){
      e.spareParts.forEach(eSub=>{
        sparePartsIds.push(eSub._id)
        sparePartsWithQuantities.push({
          ...props.dataOfEntry,
          main_id:eSub._id,
          labor_id:e._id,
          quantity:e.quantity
        })
      })
    }
    return {
      ...props.dataOfEntry,
      main_id:e._id,
      price:e.price,
      quantity:e.quantity,
    }
  })
  let sparePartsString=sparePartsIds.toString()
  if(sparePartsString){
    const sparePartsFromDb=await axios(`${process.env.REACT_APP_BASE_URL}/spareParts/${sparePartsString}`, {
      responseType: "json",
    })
    setSelectedSpareParts(sparePartsFromDb.data.map(e=>{
      return {
        ...sparePartsWithQuantities.filter(esub=>esub.main_id===e._id)[0],
        price:e.price
      }
    }))
  }
  //get ids spareparts from actions choosen
  //get spareparts price from spareparts table whre ids available
  // make array with main_id quantity_id and actionsId
  //save data in db
  axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/operationActions`,
    data: insertedItemsToSave,
  })
  .then(function (response) {
    props.setOpenDialog(false)
  })
  .catch((error) => {
    console.log(error);
  });
  
  axios({
    method: "put",
    url: `${process.env.REACT_APP_BASE_URL}/financial/byOperationNumber/${props.dataOfEntry.operation_id}`,
    data: [{"labor": totalPrice}]
  })


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
          </Toolbar>
        </AppBar>
        {!isLoading ? (
          <>
            <div style={{ padding: "30px" }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <NestedTableSpare
                    arrayName={items}
                    setArrayName={setItems}
                    setInsertedItems={setInsertedItems}
                    insertedItems={insertedItems}
                    title="Operation Actions"
                    dbTable="correctiveActions"
                    dbOperationTable="operationActions"
                    setQuantityUpdated={setQuantityUpdated}
                    setPriceUpdated={setPriceUpdated}
                  />
                </Grid>

                <Grid item xs={4}>
                <h4><strong>Total</strong>: {totalPrice}</h4>
                </Grid>

                <Grid item xs={8} className="clientTables">
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className="btn btn--save"
                    onClick={handleSaveForm}
                    startIcon={<Save />}
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
export default OperationActions;


