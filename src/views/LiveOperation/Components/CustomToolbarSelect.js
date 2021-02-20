import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import axios from 'axios';
import {Delete,Update} from "@material-ui/icons";

const defaultToolbarSelectStyles = {
  iconButton: {
  },
  iconContainer: {
    marginRight: "24px",
  },
  inverseIcon: {
    transform: "rotate(90deg)",
  },
};
const CustomToolbarSelect = (props) => {
  
  const handleClickUpdateStatus = () => {
    const idsToUpdate = props.selectedRows.data.map(row => props.items[row.dataIndex]);
    console.log(idsToUpdate)
    idsToUpdate.forEach(async e=>{
      await axios({
        method: "put",
        url: `${process.env.REACT_APP_BASE_URL}/liveOperations/${e._id}`,
        data: [{
          status: "in progress",
          last_status_update: new Date(),
        }]
      })
      .then((response) => {
        props.setStatusUpdated(props.selectedRows)
        props.setSelectedRows([]);
      });
      await axios({
        method: "post",
        url: `${process.env.REACT_APP_BASE_URL}/operations/history`,
        data: {
          status: "in progress",
          user: "User 1",
          notes: "",
          operation_number: e.operation_number,
        },
      })
    })
    // console.log("displayData",props.displayData)
    props.setSelectedRows([]);
  };
  
  
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
  );
};

export default CustomToolbarSelect;
