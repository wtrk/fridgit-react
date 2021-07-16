import React, {useState,useEffect} from "react";
import { TextField, CircularProgress } from "@material-ui/core";
import {Autocomplete} from '@material-ui/lab';
import CustomToolbar from "CustomToolbar";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {pricesDataTableTheme} from "assets/css/datatable-theme.js";
import axios from 'axios';
import { getCookie } from 'components/auth/Helpers';

const NestedTable = (props) => {
  const token = getCookie('token');
  const [valueSelected, setValueSelected] = useState("");
  const [dataList, setDataList] = useState([]);

  const add1Row = () => {
    props.setArrayName([...props.arrayName, { name: "",price: 0,quantity: 1}]);
  };
    const handleChange = (e, newValue) =>{
      setValueSelected([])
      if(newValue){
        newValue['quantity']=1
        props.setArrayName([...props.arrayName.filter(e=>e.name!==""), newValue ]);
        props.setInsertedItems([...props.insertedItems, newValue ]);
      }

    }
  
  useEffect(()=>{
    const spareIdsUsed=props.arrayName.map(e=>e.main_id)
    const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/${props.dbTable}`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`},
      }).then((response) => {
        setDataList(response.data.filter(e=>!spareIdsUsed.includes(e._id)))
        return response.data
      });
      };
    fetchData();
  },[])
  
  const handleChangeQuantity = (e) =>{
    const { name, value } = e.target;
    props.setArrayName(props.arrayName.map(eSub=>{
      if(eSub.name===name) eSub.quantity=value
      return eSub
    }))
    if(!props.insertedItems.filter(e=>e.name===name).length){
      props.setQuantityUpdated({name:name, quantity:value})
    }
  }
  
  const handleChangePrice = (e) =>{
    const { name, value } = e.target;
    props.setArrayName(props.arrayName.map(eSub=>{
      if(eSub.name===name) eSub.price=value
      return eSub
    }))
    if(!props.insertedItems.filter(e=>e.name===name).length){
      props.setPriceUpdated({name:name, price:value})
    }
  }

  return (
    <MuiThemeProvider theme={pricesDataTableTheme}>
    <MUIDataTable
      data={props.arrayName}
      title={props.title}
      columns={[
        {
          name: "name",
          options: {
            filter: false,
            customBodyRender: (value, tableMeta, updateValue) => {
              if (value == "") {
                return (
                  <div style={{width:"300px"}}>
                    <Autocomplete
                    
                      id={`${props.title}Input`}
                      options={dataList || null}
                      value={valueSelected || null}
                      getOptionLabel={(option) => {
                        return Object.keys(option).length !== 0
                          ? option.name
                          : null;
                      }}
                      onChange={handleChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={`Add new ${props.title}`}
                        />
                      )}
                    />
                  </div>
                );
              } else {
                return <div>{value}</div>;
              }
            },
          },
        },
        {
          name:"price",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              return <TextField
              id="price"
              name={tableMeta.rowData[0]}
              value={value}
              onChange={handleChangePrice}
              InputLabelProps={{
                shrink: true,
              }}
            />
            },
          }
        },
        {name:"quantity",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return <TextField
            id="quantity"
            type="number"
            name={tableMeta.rowData[0]}
            defaultValue={value}
            onChange={handleChangeQuantity}
            InputLabelProps={{
              shrink: true,
            }}
          />
          },
        }},
        {name:"total",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return tableMeta.rowData[1]*tableMeta.rowData[2]
          },
        }
      }
      ]}
      options={{
        filter: false,
        rowsPerPage: 100,
        customFooter: () => "",
        customToolbar: () => {
          return <CustomToolbar listener={add1Row} />;
        },
        textLabels: {
            body: {
                noMatch: !props.isLoading && 'Sorry, there is no matching data to display'
            },
        },
        onRowsDelete: (rowsDeleted, dataRows) => {
          const idsToDelete = rowsDeleted.data.map(d => props.arrayName[d.dataIndex]._id);
          axios.delete(`${process.env.REACT_APP_BASE_URL}/${props.dbOperationTable}/${idsToDelete}`, {
            responseType: "json", headers: {Authorization: `Bearer ${token}`},
          }).then((response) => {
            const rowsToKeep=props.arrayName.filter(e=> !idsToDelete.includes(e._id))
            props.setArrayName(rowsToKeep)
          });
        }
      }}
    />
    </MuiThemeProvider>
  );
};

export default NestedTable;
