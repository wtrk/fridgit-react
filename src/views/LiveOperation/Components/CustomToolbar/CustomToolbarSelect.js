import React, {useState,useRef,useEffect} from "react";
import { IconButton, Tooltip, Slide, Dialog } from "@material-ui/core";
import axios from 'axios';
import {Delete,Update} from "@material-ui/icons";
import UpdateStatusForm from "./Components/UpdateStatusForm.js";
import OperationActions from "./Components/OperationActions.js";
import OperationInspections from "./Components/OperationInspections.js";
import OperationSpareParts from "./Components/OperationSpareParts.js";
import SurveyForPreventive from "./Components/SurveyForPreventive.js";
import Pdf from "./Components/Pdf.js";
import { getCookie } from '../../../../components/auth/Helpers';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const CustomToolbarSelect = (props) => {
  const token = getCookie('token');
  const [openUpdateStatusForm,setOpenUpdateStatusForm] = useState(false); //for modal
  const [openOperationSpareParts,setOpenOperationSpareParts] = useState(false); //for modal
  const [openOperationInspections,setOpenOperationInspections] = useState(false); //for modal
  const [openSurveyForPreventive,setOpenSurveyForPreventive] = useState(false); //for modal
  const [openOpenOperationActions,setOpenOperationActions] = useState(false); //for modal
  const [dataToUpdate,setDataToUpdate] = useState({});
  const [correctiveReportDb,setCorrectiveReportDb] = useState();
  const [dataOfEntry,setDataOfEntry] = useState({})
  const [sparePartsSelected,setSparePartsSelected] = useState([]);
  const [openPdf,setOpenPdf] = useState(false);
  const [actionsSelected,setActionsSelected] = useState([]);
  const [spareParts,setSpareParts] = useState([]);
  const [sparePartsTotalPrice,setSparePartsTotalPrice] = useState(0);
  const [correctiveActions,setCorrectiveActions] = useState([]);
  const [correctiveActionsTotalPrice,setCorrectiveActionsTotalPrice] = useState(0);
  const [stores,setStores] = useState([]);
  const [warehouses,setWarehouses] = useState([]);
  const [locationForPdf,setLocationForPdf] = useState({});
  const [totalAllForPdf,setTotalAllForPdf] = useState(0);
  const [preventiveActions, setPreventiveActions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await axios.all([
        axios.get(`${process.env.REACT_APP_BASE_URL}/spareParts`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/correctiveActions`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/warehouses`,{headers: {Authorization: `Bearer ${token}`}}),
        axios.get(`${process.env.REACT_APP_BASE_URL}/stores`,{headers: {Authorization: `Bearer ${token}`}})
      ]).then(response => {
        setSpareParts(response[0].data)
        setCorrectiveActions(response[1].data)
        setWarehouses(response[2].data)
        setStores(response[3].data)
      })
    };
    fetchData();
  }, []);



  const handleClickUpdateStatus = () => {
    setDataToUpdate(
      props.selectedRows.data.map((row) => props.items[row.dataIndex].operation_number)
    );
  };
  
  const handleClickOperationSpareParts = async (e) => {
    e.preventDefault()
    const operationIdChecked = props.items[props.selectedRows.data[0].index].operation_number;
    setDataOfEntry({
      operation_id:operationIdChecked,
      job_id:props.items[props.selectedRows.data[0].index].job_number,
      cabinet_id:props.items[props.selectedRows.data[0].index].sn
    })

    await axios(`${process.env.REACT_APP_BASE_URL}/operationSpareParts/byOperationId/${operationIdChecked}`, {
      responseType: "json", headers: {Authorization: `Bearer ${token}`},
    }).then((response) => {
      setSparePartsSelected(response.data)
      return response.data
    }).then((response) => {
      setOpenOperationSpareParts(true)
    });

  };
  const handleClickOperationInspections = async (e) => {
    e.preventDefault()
    const operationIdChecked = props.items[props.selectedRows.data[0].index].operation_number;
    setDataOfEntry({
      operation_id:operationIdChecked,
      job_id:props.items[props.selectedRows.data[0].index].job_number,
      cabinet_id:props.items[props.selectedRows.data[0].index].sn
    })
    setOpenOperationInspections(true)
  };
  const handleClickAnswers = async (e) => {
    e.preventDefault()
    const operationIdChecked = props.items[props.selectedRows.data[0].index].operation_number;
    setDataOfEntry({
      operation_id:operationIdChecked,
      job_id:props.items[props.selectedRows.data[0].index].job_number,
      cabinet_id:props.items[props.selectedRows.data[0].index].sn
    })
    setOpenSurveyForPreventive(true)
  };
  const handleClickOperationActions = async (e) => {
    e.preventDefault()
    const operationIdChecked = props.items[props.selectedRows.data[0].index].operation_number;
    setDataOfEntry({
      operation_id:operationIdChecked,
      job_id:props.items[props.selectedRows.data[0].index].job_number,
      cabinet_id:props.items[props.selectedRows.data[0].index].sn
    })

    
    await axios(`${process.env.REACT_APP_BASE_URL}/operationActions/byOperationId/${operationIdChecked}`, {
      responseType: "json", headers: {Authorization: `Bearer ${token}`},
    }).then((response) => {
      setActionsSelected(response.data)
      return response.data
    }).then((response) => {
      setOpenOperationActions(true)
    });
  };
  
const dataToUpdateValueFirstRun = useRef(true);
useEffect(()=>{
  if (dataToUpdateValueFirstRun.current) {
    dataToUpdateValueFirstRun.current = false;
  }else{
    setOpenUpdateStatusForm(true)
    
  }
},[dataToUpdate])
  
  const handleClickDelete = () => {
    const idsToDelete = props.selectedRows.data.map(row => props.displayData[row.index].data[0]); 
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/liveOperations/${idsToDelete}`,
        {
          responseType: "json", headers: {Authorization: `Bearer ${token}`},
        }
      )
      .then((response) => {
        props.setItems(props.items.filter(e=>!idsToDelete.includes(e._id)))

      });
  };


  const handleClickDownloadPdf = async (e) => {
    e.preventDefault()
    let operationNumber=props.items[props.selectedRows.data[0].index]?props.items[props.selectedRows.data[0].index].operation_number:null;
    
    const financial = await axios(`${process.env.REACT_APP_BASE_URL}/financial/byOperationNumber/${operationNumber}`, {
      responseType: "json", headers: {Authorization: `Bearer ${token}`},
    }).then((response) => {
      setTotalAllForPdf(response.data[0].total)
      return response.data
    });

    const correctiveReportDb=await axios(`${process.env.REACT_APP_BASE_URL}/correctiveReport/${operationNumber}`, {
      responseType: "json", headers: {Authorization: `Bearer ${token}`},
    }).then((response) => {
      if(response.data.location==="warehouse"){
        let warehouseInfo=warehouses.filter(e=>e._id===response.data.location_id)[0]
        setLocationForPdf({
          name:warehouseInfo.name,
          code:warehouseInfo.code,
          branch_number:"",
          city_id:warehouseInfo.location.city_id,
          mobile:warehouseInfo.location.mobile,
        })
      }else if(response.data.location==="store"){
        let storeInfo=stores.filter(e=>e._id===response.data.location_id)[0]
        setLocationForPdf({
          name:storeInfo.name,
          code:storeInfo.code,
          branch_number:storeInfo.branch_number,
          city_id:storeInfo.location.city_id,
          mobile:storeInfo.location.mobile,
        })
      }
      let operationActionsIds=response.data.operationActions.map(e=>e.main_id)
      let sparePartsIds=response.data.operationSparePart.map(e=>e.main_id)


      
      setSpareParts(spareParts.map(e=>{
        if(sparePartsIds.includes(e._id)){
          let sparePartChosen=response.data.operationSparePart.filter(eSub=>eSub.main_id===e._id)
          let qtty=sparePartChosen.length>1?sparePartChosen.reduce((a,b)=>a.quantity+b.quantity):sparePartChosen[0].quantity
          let price=sparePartChosen.length>1?sparePartChosen.reduce((a,b)=>a.price+b.price):sparePartChosen[0].price
          console.log("sparePartChosen",sparePartChosen)
          return {
            name:e.name,
            category:e.category,
            price:price*qtty,
            quantity:qtty
          }
        }
      }).filter(e=>e))

      
      setCorrectiveActions(correctiveActions.map(e=>{
        if(operationActionsIds.includes(e._id)){
          let actionsChosen=response.data.operationActions.filter(eSub=>eSub.main_id===e._id)    
          let qtty=actionsChosen.length>1?actionsChosen.reduce((a,b)=>a.quantity+b.quantity):actionsChosen[0].quantity
          let price=actionsChosen.length>1?actionsChosen.reduce((a,b)=>a.price+b.price):actionsChosen[0].price
          return {
            name:e.name,
            category:e.category,
            price:price*qtty,
            quantity:qtty
          }
        }
      }).filter(e=>e))

      setCorrectiveReportDb(response.data)
      if(props.items[props.selectedRows.data[0].dataIndex]&&props.items[props.selectedRows.data[0].dataIndex].operation_type !== "Preventive Maintenance"){
        setOpenPdf(true)
      }
    })
  };
  
useEffect(()=>{
  if(spareParts.length){
    setSparePartsTotalPrice(spareParts.length>1?spareParts.reduce((a,b)=>a.price+b.price):spareParts[0].price)
  }
},[spareParts])

useEffect(()=>{
  if(correctiveActions.length){
    setCorrectiveActionsTotalPrice(correctiveActions.length>1?correctiveActions.reduce((a,b)=>a.price+b.price):correctiveActions[0].price)
  }
},[correctiveActions])

const preventiveActionsFirstRun = useRef(true);
useEffect(() => {
  if (preventiveActionsFirstRun.current || (props.items[props.selectedRows.data[0].dataIndex]&&props.items[props.selectedRows.data[0].dataIndex].operation_type !== "Preventive Maintenance")) {
    preventiveActionsFirstRun.current = false;
  }else{
    const fetchData = async () => {

      await axios(`${process.env.REACT_APP_BASE_URL}/preventiveActions`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`},
      }).then((response) => {
        setPreventiveActions(correctiveReportDb.preventiveList.map(e=>{
          let dataFromMainTbl=response.data.find(eSub=>e.preventiveActions_id===eSub._id)
          let rightAnswer=dataFromMainTbl.answers.length?dataFromMainTbl.answers.find(eSub=>e.rightAnswer_id===eSub._id):{}
          return ({
            "_id":e.preventiveActions_id,
            "name":dataFromMainTbl.name || "-",
            "answer":rightAnswer.name || "-",
            "notes":e.notes || "-"
          })
        })
        )
        setOpenPdf(true)
      })
    
    };
    fetchData();
  }
}, [correctiveReportDb]);


  return (
    <>
      <div className="d-flex flex-row-reverse align-items-center">
        <Tooltip title={"Delete selected"}>
          <IconButton onClick={handleClickDelete}>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Batch Update Status"}>
          <IconButton onClick={handleClickUpdateStatus}>
            <Update />
          </IconButton>
        </Tooltip>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            {props.selectedRows.data.length === 1 &&
            props.items[props.selectedRows.data[0].dataIndex] && props.items[props.selectedRows.data[0].dataIndex].operation_type ===
              "Corrective Maintenance" ? (
              <>
                <li className="breadcrumb-item">
                  <a href="#"
                    onClick={handleClickOperationSpareParts}
                  >
                    Spare Parts
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a href="#" onClick={handleClickOperationActions}>
                    Labors
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a
                    href="#"
                    onClick={handleClickOperationInspections}
                  >
                    Inspections
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a href="#" onClick={handleClickDownloadPdf}>
                    Download PDF
                  </a>
                </li>
              </>
            ) : null}
            {props.selectedRows.data.length === 1 && props.items[props.selectedRows.data[0].dataIndex] &&
            props.items[props.selectedRows.data[0].dataIndex].operation_type ===
              "Preventive Maintenance" ? (
              <>
              <li className="breadcrumb-item">
                <a href="#" onClick={handleClickAnswers}>
                  Survey
                </a>
              </li>
                <li className="breadcrumb-item">
                  <a
                    href="#"
                    onClick={handleClickOperationInspections}
                  >
                    Inspections
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a
                    href="#"
                    onClick={handleClickOperationSpareParts}
                  >
                    Spare Parts
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a href="#" onClick={handleClickOperationActions}>
                    Labors
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a href="#" onClick={handleClickDownloadPdf}>
                    Download PDF
                  </a>
                </li>
              </>
            ) : null}
          </ol>
        </nav>
      </div>
      {/*********************** -Add START- ****************************/}
      <Dialog
        maxWidth={"md"}
        fullWidth
        TransitionComponent={Transition}
        open={openUpdateStatusForm}
        onClose={() => setOpenUpdateStatusForm(false)}
      >
        <div style={{ minHeight: "80vh", overflowX: "hidden" }}>
          <UpdateStatusForm
            dataToUpdate={dataToUpdate}
            items={props.items}
            setStatusUpdated={props.setStatusUpdated}
            setSelectedRows={props.setSelectedRows}
            selectedRows={props.selectedRows}
            setOpenUpdateStatusForm={setOpenUpdateStatusForm}
          />
        </div>
      </Dialog>

      <Dialog
        maxWidth={"md"}
        fullWidth
        TransitionComponent={Transition}
        open={openOperationSpareParts}
        onClose={() => setOpenOperationSpareParts(false)}
      >
        <div style={{ minHeight: "80vh", overflowX: "hidden" }}>
          <OperationSpareParts
            setOpenDialog={setOpenOperationSpareParts}
            sparePartsSelected={sparePartsSelected}
            dataOfEntry={dataOfEntry}
          />
        </div>
      </Dialog>
      <Dialog
        maxWidth={"md"}
        fullWidth
        TransitionComponent={Transition}
        open={openOpenOperationActions}
        onClose={() => setOpenOperationActions(false)}
      >
        <div style={{ minHeight: "80vh", overflowX: "hidden" }}>
          <OperationActions
            setOpenDialog={setOpenOperationActions}
            actionsSelected={actionsSelected}
            dataOfEntry={dataOfEntry}
          />
        </div>
      </Dialog>
      <Dialog
        maxWidth={"md"}
        fullWidth
        TransitionComponent={Transition}
        open={openOperationInspections}
        onClose={() => setOpenOperationInspections(false)}
      >
        <div style={{ minHeight: "80vh", overflowX: "hidden" }}>
          <OperationInspections
            setOpenDialog={setOpenOperationInspections}
            dataOfEntry={dataOfEntry}
            fridgeType={props.fridgeType}
          />
        </div>
      </Dialog>
      <Dialog
        maxWidth={"lg"}
        fullWidth
        TransitionComponent={Transition}
        open={openSurveyForPreventive}
        onClose={() => setOpenSurveyForPreventive(false)}
      >
        <div style={{ minHeight: "80vh", overflowX: "hidden" }}>
          <SurveyForPreventive
            setOpenDialog={setOpenSurveyForPreventive}
            dataOfEntry={dataOfEntry}
          />
        </div>
      </Dialog>


      <Dialog
        maxWidth={"lg"}
        fullWidth
        TransitionComponent={Transition}
        open={openPdf}
        onClose={() => setOpenPdf(false)}
      >
        <div style={{ minHeight: "80vh", overflowX: "hidden" }}>
          <Pdf
            setOpenDialog={setOpenPdf}
            correctiveReportDb={correctiveReportDb}
            locationForPdf={locationForPdf}
            spareParts={spareParts}
            correctiveActions={correctiveActions}
            sparePartsTotalPrice={sparePartsTotalPrice}
            correctiveActionsTotalPrice={correctiveActionsTotalPrice}
            preventiveActions={preventiveActions}
            totalAllForPdf={totalAllForPdf}
            operationType={props.items[props.selectedRows.data[0].dataIndex]?props.items[props.selectedRows.data[0].dataIndex].operation_type:null}
          />
        </div>
      </Dialog>
    </>
  );
};

export default CustomToolbarSelect;
