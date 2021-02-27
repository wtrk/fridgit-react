import React, {useState,useRef,useEffect} from "react";
import { IconButton, Tooltip, Slide, Dialog } from "@material-ui/core";
import axios from 'axios';
import {Delete,Update} from "@material-ui/icons";
import UpdateStatusForm from "./UpdateStatusForm.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const CustomToolbarSelect = (props) => {
  const [openUpdateStatusForm,setOpenUpdateStatusForm] = useState(false); //for modal
  const [dataToUpdate,setDataToUpdate] = useState({});

  const handleClickUpdateStatus = () => {
    setDataToUpdate(
      props.selectedRows.data.map((row) => props.items[row.dataIndex].operation_number)
    );
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
          responseType: "json",
        }
      )
      .then((response) => {
        props.setItems(props.items.filter(e=>!idsToDelete.includes(e._id)))
        props.setSelectedRows([]);
      });
  };

  return (
    <>
      <div className="d-flex flex-row-reverse">
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
      </div>
      {/*********************** -Add START- ****************************/}
      <Dialog
        maxWidth={"lg"}
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
    </>
  );
};

export default CustomToolbarSelect;
