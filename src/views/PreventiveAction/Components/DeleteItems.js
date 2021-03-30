import React, { useState, useEffect } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import axios from 'axios';


const DeleteItems = (props) => {

  const handleConfirmToDelete = () =>{
      props.setAgreeToDelete({
        ...props.agreeToDelete,
        confirmDeletion:true
      }) 
  }
  useEffect(() => {
    const fetchData = async () => {
      if(props.agreeToDelete.confirmDeletion===true&&props.agreeToDelete.open===true){
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/${props.table}/${props.agreeToDelete.idToDelete}`, {
            responseType: "json",
          }).then((response) => {
            props.setAgreeToDelete({
              ...props.agreeToDelete,
              open:false
            }) 
          });
      }
    };
    fetchData();
  }, [props.agreeToDelete]);
  
  //Search component ---------------END--------------
  return (
    <>
      <DialogContent>
        <DialogContentText>
          Are you sure You want to delete this entry?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => props.setAgreeToDelete(false)}
          color="primary"
        >
          Cancel
        </Button>
        <Button onClick={handleConfirmToDelete} color="primary">
          Delete
        </Button>
      </DialogActions>
    </>
  );
}
export default DeleteItems