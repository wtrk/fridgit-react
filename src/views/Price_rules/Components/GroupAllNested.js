import React, {useState,useEffect} from "react";
import { Grid } from "@material-ui/core";
import NestedTable from "./NestedTable.js";

const GroupAllNested = (props) => {


  return (
    <>
          <Grid item xs={12}>
            <NestedTable arrayName={props.arrayNames.clients} setArrayName={props.setArrayNames.setClients} title="Clients" dbTable="clients" />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={props.arrayNames.countries} setArrayName={props.setArrayNames.setCountries} title="Countries" dbTable="countries" />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={props.arrayNames.citiesIn} setArrayName={props.setArrayNames.setCitiesIn} title="Cities In" dbTable="cities" />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={props.arrayNames.citiesOut} setArrayName={props.setArrayNames.setCitiesOut} title="Cities Out" dbTable="cities" />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={props.arrayNames.neighbourhoodsIn} setArrayName={props.setArrayNames.setNeighbourhoodsIn} title="Neighbourhoods In" dbTable="neighbourhoods" />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={props.arrayNames.neighbourhoodsOut} setArrayName={props.setArrayNames.setNeighbourhoodsOut} title="Neighbourhoods Out" dbTable="neighbourhoods" />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={props.arrayNames.tiersIn} setArrayName={props.setArrayNames.setTiersIn} title="Tiers In" dbTable="tiers" />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={props.arrayNames.tiersOut} setArrayName={props.setArrayNames.setTiersOut} title="Tiers Out" dbTable="tiers" />
          </Grid>
          <Grid item xs={12}>
            <NestedTable arrayName={props.arrayNames.operations} setArrayName={props.setArrayNames.setOperations} title="Operations" dbTable="operations" />
          </Grid>
    </>
  );
};

export default GroupAllNested;
