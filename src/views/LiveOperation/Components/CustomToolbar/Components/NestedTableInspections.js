import React, {useState,useEffect} from "react";
import { TextField, CircularProgress } from "@material-ui/core";
import {Autocomplete} from '@material-ui/lab';
import CustomToolbar from "CustomToolbar";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {pricesDataTableTheme} from "assets/css/datatable-theme.js";
import axios from 'axios';

const NestedTable = (props) => {
  const [valueSelected, setValueSelected] = useState("");
  const [dataList, setDataList] = useState([]);

  const add1Row = () => {
    if(props.arrayName) props.setArrayName([...props.arrayName, { name: "" }]);
    else props.setArrayName([{ name: "" }]);
  };
    const handleChange = (e, newValue) =>{
      if(newValue){
        newValue["quantity"]=1
        setValueSelected([])
        props.setArrayName([...props.arrayName.filter(e=>e.name!==""), newValue]);
      }
      }
  
  useEffect(()=>{
    const fetchData = () => {
      let dbTable = props.dbTable
      if(props.title==="operations") dbTable="cities"
      axios(`${process.env.REACT_APP_BASE_URL}/${dbTable}`, {
        responseType: "json",
      }).then((response) => {
        setDataList(response.data.filter(e=>e.fridgesTypes.filter(eSub=>eSub._id===props.fridgeType).length?true:false))
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
  }
  return (
    <MuiThemeProvider theme={pricesDataTableTheme}>
    <MUIDataTable
      data={props.arrayName}
      title={props.title}
      columns={[
        {
          name: "name",
          label: "Name",
          options: {
            filter: false,
            customBodyRender: (value, tableMeta, updateValue) => {
              if (value == "") {
                return (
                  <div>
                    <Autocomplete
                      id={`${props.title}Input`}
                      options={dataList || {}}
                      value={valueSelected || {}}
                      getOptionLabel={(option) => {
                        return Object.keys(option).length !== 0
                          ? option.name
                          : "";
                      }}
                      onChange={handleChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={`${props.title}`}
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
        {name:"category"},
        {name:"quantity",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return <TextField
            id="quantity"
            type="number"
            name={tableMeta.rowData[0]}
            value={value}
            onChange={handleChangeQuantity}
            InputLabelProps={{
              shrink: true,
            }}
          />
          },
        }},
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
          const rowsToKeep=props.arrayName.filter(e=> !idsToDelete.includes(e._id))
          props.setArrayName(rowsToKeep)
        },
      }}
    />
    </MuiThemeProvider>
  );
};

export default NestedTable;
