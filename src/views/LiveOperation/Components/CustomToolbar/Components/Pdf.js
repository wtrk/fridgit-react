import React, {useState} from 'react';
import { PDFViewer, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import axios from 'axios';



// Create styles
const styles = StyleSheet.create({
  pdfContainer:{
    width:"100%",
    height:"calc(100vh - 80px)",
  },
  page: {
    // fontFamily: 'Roboto',
    fontSize:10,
    padding:20,
  },
  tableCont:{
    paddingBottom:20
  },
  headerCont:{
    borderTop:"1 solid #333",
    borderLeft:"1 solid #333",
    borderRight:"1 solid #333",
  },
  emptyTitle:{
    backgroundColor:"#707dc8",
    padding:5,
    height:20,
    borderBottom:"1 solid #333",
    textAlign:"center"
  },
  title:{
    backgroundColor:"#707dc8",
    color:"#fff",
    padding:"10px 20px",
    fontWeight: 'bold',
    fontSize:18,
    borderBottom:"1 solid #333",
    textAlign:"center"
  },
  title2:{
    backgroundColor:"#ddd",
    padding:"5px 20px",
    fontWeight: 'bold',
    borderBottom:"1 solid #333",
    fontSize:15,
    textAlign:"center"
  },
  logoCont:{
    flexDirection: 'row',
    borderBottom:"1 solid #777",
    marginBottom:5,
    paddingBottom:5,
    alignItems:"center",
    justifyContent: "space-between"
  },
  pageTitle:{
    color:"#333",
    fontWeight: 'bold',
    fontSize:22
  },
  rowContainer:{
    flexDirection: 'row',
    borderRight:"1 solid #333",
    borderLeft:"1 solid #333",
    borderBottom:"1 solid #333",
  },
  colContainer:{
    borderRight:"1 solid #333",
    borderLeft:"1 solid #333",
    borderBottom:"1 solid #333",
  },
  tblHeader:{
    flexDirection: 'row',
    fontWeight: 'bold',
    borderBottom:"1 solid #333",
  },
  tblBody:{
    flexDirection: 'row',
    borderBottom:"1 solid #333",
  },
  tblColSmall:{
    flexBasis:"12%",
    borderRight:"1 solid #333",
    padding:"3 5"
  },
  tblColLastLine:{
    flexBasis:"88%",
    borderRight:"1 solid #333",
    padding:"3 5",
    textAlign:"right"
  },
  tblColDesc:{
    flexBasis:"52%",
    borderRight:"1 solid #333",
    padding:"3 5"
  },
  colCont_1:{
    flexBasis:"50%",
    borderRight:"1 solid #333",
    flexDirection: 'row'
  },
  colCont_2:{
    flexBasis:"50%",
    flexDirection: 'row'
  },
  col40Child:{
    flexBasis:"40%",
    borderRight:"1 solid #333",
    flexDirection: 'row'
  },
  col30Child:{
    flexBasis:"30%",
    borderRight:"1 solid #333",
    flexDirection: 'row'
  },
  col20Child:{
    flexBasis:"20%",
    borderRight:"1 solid #333",
    flexDirection: 'row'
  },
  col80Child:{
    flexBasis:"80%",
    borderRight:"1 solid #333",
    flexDirection: 'row',
    textAlign:"right",
    padding:"3 5"
  },
  coltitle:{
    flexBasis:"30%",
    borderRight:"1 solid #333",
    fontWeight: 'bold',
    padding:"3 5"
  },
  colText:{
    flexBasis:"70%",
    padding:"3 5"
  }
});

// Create Document Component
const Pdf = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState(props.correctiveReportDb);
return isLoading === true ? (
  <PDFViewer style={styles.pdfContainer}>
    <Document>
      <Page style={styles.page} wrap>
        <View style={styles.logoCont} fixed>
          <View>
            <Text style={styles.pageTitle}>
              {props.operationType} Maintenance Report
            </Text>
          </View>
          <View style={{ width: 50 }}>
            <Image src={require("./logo.png")} alt="" />
          </View>
        </View>
        <View style={styles.tableCont} wrap={false}>
          <View style={styles.headerCont}>
            <Text style={styles.title}>
              {props.operationType} Maintenance Report
            </Text>
            {/* <Text style={styles.title2}>{props.operationType} Maintenance Report</Text> */}
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.colCont_1}>
              <View style={styles.coltitle}>
                <Text>Operation Number:</Text>
              </View>
              <View style={styles.colText}>
                <Text>{items.operation_number}</Text>
              </View>
            </View>
            <View style={styles.colCont_2}>
              <View style={styles.coltitle}>
                <Text>Job Number</Text>
              </View>
              <View style={styles.colText}>
                <Text>{items.job_number}</Text>
              </View>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.colCont_1}>
              <View style={styles.coltitle}>
                <Text>Branding:</Text>
              </View>
              <View style={styles.colText}>
                <Text>{items.branding}</Text>
              </View>
            </View>
            <View style={styles.colCont_2}>
              <View style={styles.coltitle}>
                <Text>Store Name</Text>
              </View>
              <View style={styles.colText}>
                <Text>{props.locationForPdf.name || "-"}</Text>
              </View>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.colCont_1}>
              <View style={styles.coltitle}>
                <Text>Fridge Type:</Text>
              </View>
              <View style={styles.colText}>
                <Text>{items.fridge_type}</Text>
              </View>
            </View>
            <View style={styles.colCont_2}>
              <View style={styles.coltitle}>
                <Text>Store Code:</Text>
              </View>
              <View style={styles.colText}>
                <Text>{props.locationForPdf.code || "-"}</Text>
              </View>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.colCont_1}>
              <View style={styles.coltitle}>
                <Text>Fridge SN1:</Text>
              </View>
              <View style={styles.colText}>
                <Text>{items.fridge_sn}</Text>
              </View>
            </View>
            <View style={styles.colCont_2}>
              <View style={styles.coltitle}>
                <Text>Branch Code:</Text>
              </View>
              <View style={styles.colText}>
                <Text>{props.locationForPdf.branch_number || "-"}</Text>
              </View>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.colCont_1}>
              <View style={styles.coltitle}>
                <Text>Fridge SN2:</Text>
              </View>
              <View style={styles.colText}>
                <Text>{items.fridge_sn2}</Text>
              </View>
            </View>
            <View style={styles.colCont_2}>
              <View style={styles.coltitle}>
                <Text>Store Address:</Text>
              </View>
              <View style={styles.colText}>
                <Text>{props.locationForPdf.city_id || "-"}</Text>
              </View>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.colCont_1}>
              <View style={styles.coltitle}>
                <Text>Notes:</Text>
              </View>
              <View style={styles.colText}>
                <Text>
                  WALLS CABINET-EIS 55.3 I-P (7) EL UIGA TELEM. W/LOCK
                </Text>
              </View>
            </View>
            <View style={styles.colCont_2}>
              <View style={styles.coltitle}>
                <Text>Store Contact #:</Text>
              </View>
              <View style={styles.colText}>
                <Text>{props.locationForPdf.mobile || "-"}</Text>
              </View>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.colCont_1}>
              <View style={styles.coltitle}>
                <Text>{props.operationType} Request Date & Time:</Text>
              </View>
              <View style={styles.colText}>
                <Text>{items.corrective_date}</Text>
              </View>
            </View>
            <View style={styles.colCont_2}>
              <View style={styles.coltitle}>
                <Text>Arrival to location Date & Time:</Text>
              </View>
              <View style={styles.colText}>
                <Text>{items.arrival_date}</Text>
              </View>
            </View>
          </View>
        </View>
        {items.inspectionsList.inspections.length ? (
          <View style={styles.tableCont} wrap={false}>
            <View style={styles.headerCont}>
              <Text style={styles.title}>Inspection List</Text>
              <Text style={styles.title2}>General Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.colCont_1}>
                <View style={styles.coltitle}>
                  <Text>Cleanliness:</Text>
                </View>
                <View style={styles.colText}>
                  <Text>{items.inspectionsList.cleanliness}</Text>
                </View>
              </View>
              <View style={styles.colCont_2}>
                <View style={styles.coltitle}>
                  <Text>Temperature:</Text>
                </View>
                <View style={styles.colText}>
                  <Text>{items.inspectionsList.temperature}</Text>
                </View>
              </View>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.colCont_1}>
                <View style={styles.coltitle}>
                  <Text>Branding:</Text>
                </View>
                <View style={styles.colText}>
                  <Text>{items.inspectionsList.branding}</Text>
                </View>
              </View>
              <View style={styles.colCont_2}>
                <View style={styles.coltitle}>
                  <Text>State of Goods:</Text>
                </View>
                <View style={styles.colText}>
                  <Text>{items.inspectionsList.stateOfGoods}</Text>
                </View>
              </View>
            </View>

            <View style={styles.headerCont}>
              <Text style={styles.title2}>Other Technical Inspections</Text>
            </View>
            <View style={styles.rowContainer}>
              <View style={{ ...styles.col40Child, backgroundColor: "#eee" }}>
                <View style={styles.colText}>
                  <Text>Name</Text>
                </View>
              </View>
              <View style={{ ...styles.col40Child, backgroundColor: "#eee" }}>
                <View style={styles.colText}>
                  <Text>Category</Text>
                </View>
              </View>
              <View
                style={{
                  ...styles.col20Child,
                  backgroundColor: "#eee",
                  borderRight: 0,
                }}
              >
                <View style={styles.colText}>
                  <Text>Quantity</Text>
                </View>
              </View>
            </View>
            {items.inspectionsList.inspections.map((e) => {
              return (
                <View style={styles.rowContainer} key={e._id}>
                  <View style={styles.col40Child}>
                    <View style={styles.colText}>
                      <Text>{e.name}</Text>
                    </View>
                  </View>
                  <View style={styles.col40Child}>
                    <View style={styles.colText}>
                      <Text>{e.category}</Text>
                    </View>
                  </View>
                  <View style={{ ...styles.col20Child, borderRight: 0 }}>
                    <View style={styles.colText}>
                      <Text>{e.quantity}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}

        <View style={styles.tableCont} wrap={false}>
          <View style={styles.headerCont}>
            <Text style={styles.title}>
              {props.operationType} Action / List of Repairs / List of Spare
              Parts Used
            </Text>
          </View>
          {props.correctiveActions && props.correctiveActions.length ? (
            <>
              <View style={styles.headerCont}>
                <Text style={styles.title2}>{props.operationType} Actions</Text>
              </View>
              <View style={styles.rowContainer}>
                <View style={{ ...styles.col30Child, backgroundColor: "#eee" }}>
                  <View style={styles.colText}>
                    <Text>Name</Text>
                  </View>
                </View>
                <View style={{ ...styles.col30Child, backgroundColor: "#eee" }}>
                  <View style={styles.colText}>
                    <Text>Category</Text>
                  </View>
                </View>
                <View style={{ ...styles.col20Child, backgroundColor: "#eee" }}>
                  <View style={styles.colText}>
                    <Text>Quantity</Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.col20Child,
                    backgroundColor: "#eee",
                    borderRight: 0,
                  }}
                >
                  <View style={styles.colText}>
                    <Text>Price</Text>
                  </View>
                </View>
              </View>
              {props.correctiveActions.map((e, i) => {
                return (
                  <View style={styles.rowContainer} key={i}>
                    <View style={styles.col30Child}>
                      <View style={styles.colText}>
                        <Text>{e.name}</Text>
                      </View>
                    </View>
                    <View style={styles.col30Child}>
                      <View style={styles.colText}>
                        <Text>{e.category}</Text>
                      </View>
                    </View>
                    <View style={{ ...styles.col20Child }}>
                      <View style={styles.colText}>
                        <Text>{e.quantity}</Text>
                      </View>
                    </View>
                    <View style={{ ...styles.col20Child, borderRight: 0 }}>
                      <View style={styles.colText}>
                        <Text>{e.price}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
              <View style={styles.rowContainer}>
                <View style={styles.col80Child}>
                  <Text>{props.operationType} Actions Total Amount ($)</Text>
                </View>
                <View style={{ ...styles.col20Child, borderRight: 0 }}>
                  <View style={styles.colText}>
                    <Text>{props.correctiveActionsTotalPrice}</Text>
                  </View>
                </View>
              </View>
            </>
          ) : null}
          {props.spareParts && props.spareParts.length ? (
            <>
              <View style={styles.headerCont}>
                <Text style={styles.title2}>Spare Parts</Text>
              </View>
              <View style={styles.rowContainer}>
                <View style={{ ...styles.col30Child, backgroundColor: "#eee" }}>
                  <View style={styles.colText}>
                    <Text>Name</Text>
                  </View>
                </View>
                <View style={{ ...styles.col30Child, backgroundColor: "#eee" }}>
                  <View style={styles.colText}>
                    <Text>Category</Text>
                  </View>
                </View>
                <View style={{ ...styles.col20Child, backgroundColor: "#eee" }}>
                  <View style={styles.colText}>
                    <Text>Quantity</Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.col20Child,
                    backgroundColor: "#eee",
                    borderRight: 0,
                  }}
                >
                  <View style={styles.colText}>
                    <Text>Price</Text>
                  </View>
                </View>
              </View>
              {props.spareParts.map((e, i) => {
                return (
                  <View style={styles.rowContainer} key={i}>
                    <View style={styles.col30Child}>
                      <View style={styles.colText}>
                        <Text>{e.name}</Text>
                      </View>
                    </View>
                    <View style={styles.col30Child}>
                      <View style={styles.colText}>
                        <Text>{e.category}</Text>
                      </View>
                    </View>
                    <View style={{ ...styles.col20Child }}>
                      <View style={styles.colText}>
                        <Text>{e.quantity}</Text>
                      </View>
                    </View>
                    <View style={{ ...styles.col20Child, borderRight: 0 }}>
                      <View style={styles.colText}>
                        <Text>{e.price}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
              <View style={styles.rowContainer}>
                <View style={styles.col80Child}>
                  <Text>Spare Parts Total Amount ($)</Text>
                </View>
                <View style={{ ...styles.col20Child, borderRight: 0 }}>
                  <View style={styles.colText}>
                    <Text>{props.sparePartsTotalPrice || 0}</Text>
                  </View>
                </View>
              </View>
            </>
          ) : null}
        </View>
        <View style={styles.tableCont} wrap={false}>
          <View style={styles.headerCont}>
            <Text style={styles.title}>Service Fees</Text>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.col80Child}>
              <Text>Service Fees Amount ($)</Text>
            </View>
            <View style={{ ...styles.col20Child, borderRight: 0 }}>
              <View style={styles.colText}>
                <Text>
                  {props.totalAllForPdf}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.headerCont}>
            <Text style={styles.emptyTitle}>&nbsp;</Text>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.col80Child}>
              <Text>Final Total ($)</Text>
            </View>
            <View style={{ ...styles.col20Child, borderRight: 0 }}>
              <View style={styles.colText}>
                <Text>{props.totalAllForPdf + props.correctiveActionsTotalPrice + props.sparePartsTotalPrice}</Text>
              </View>
            </View>
          </View>
        </View>
        {props.preventiveActions.length?
        <View style={styles.tableCont} wrap={false}>
          <View style={styles.headerCont}>
            <Text style={styles.title}>Preventive Action</Text>
          </View>

          <View style={styles.rowContainer}>
            <View style={{ ...styles.col40Child, backgroundColor: "#eee" }}>
              <View style={styles.colText}>
                <Text>Description</Text>
              </View>
            </View>
            <View style={{ ...styles.col30Child, backgroundColor: "#eee" }}>
              <View style={styles.colText}>
                <Text>Right Answer</Text>
              </View>
            </View>
            <View
              style={{
                ...styles.col30Child,
                backgroundColor: "#eee",
                borderRight: 0,
              }}
            >
              <View style={styles.colText}>
                <Text>Notes</Text>
              </View>
            </View>
          </View>

          {props.preventiveActions.map((e, i) => {
                return <View style={styles.rowContainer} key={i}>
                    <View style={styles.col40Child}>
                        <Text>{e.name}</Text>
                    </View>
                    <View style={styles.col30Child}>
                      <Text>{e.answer}</Text>
                    </View>
                    <View
                      style={{
                        ...styles.col30Child,
                        borderRight: 0,
                      }}
                    >
                      <Text>{e.notes}</Text>
                    </View>
                  </View>
              })}
        </View>:null}
      </Page>
    </Document>
  </PDFViewer>
) : null;
}
export default Pdf