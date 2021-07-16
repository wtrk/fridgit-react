import React, {useState,useEffect} from 'react';
import { PDFViewer, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import axios from 'axios';
import converter from 'number-to-words';
import moment from "moment";

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
  title:{
    backgroundColor:"#707dc8",
    color:"#fff",
    padding:"10px 20px",
    fontWeight: 'bold',
    fontSize:18,
    borderBottom:"1 solid #333",
    textAlign:"center"
  },
  pageTitle:{
    color:"#333",
    fontWeight: 'bold',
    fontSize:22
  },
  /*NOW NOW NOW*/
  headerCont:{
    border:"1 solid #333",
    flexDirection: 'row',
    backgroundColor:"#99ccff"
  },
  tableCont75:{
    width:"75%",
    padding:"3 5",
    alignSelf:"center",
  },
  tableCont25:{
    width:"25%",
    padding:"3 5",
    borderLeft:"1 solid #333"
  },
  tableCont50:{
    width:"50%",
    padding:"3 5",
    alignSelf:"center",
  },
  tableCont100:{
    width:"100%",
    padding:"3 5"
  },
  tableTitle:{
    fontWeight:"bold",
    textTransform:"uppercase"
  },
  bodyCont:{
    borderLeft:"1 solid #333",
    borderRight:"1 solid #333",
    borderBottom:"1 solid #333",
    flexDirection: 'row'
  },
  footerCont:{
    borderLeft:"1 solid #333",
    borderRight:"1 solid #333",
    borderBottom:"1 solid #333",
    flexDirection: 'row',
    backgroundColor:"#99ccff"
  },
  underFooterCont:{
    flexDirection: 'row'
  },
  underFooterCont25:{
    width:"25%",
    padding:"3 5",
    backgroundColor:"#99ccff",
    borderLeft:"1 solid #333",
    borderRight:"1 solid #333",
    borderBottom:"1 solid #333"
  },
  smTxt:{
    fontSize:9
  },
  p0:{
    padding:0
  },
  bb0:{
    borderBottom:0
  },
  footerSub:{
    borderBottom:"1 solid #333",
    padding:"3 5"
  },
  colorGrey:{
    color:"#666",
  },
  signature:{
    flexDirection: 'row',
    paddingTop:50
  },
  signatureSub:{
    width:"50%"
  },
  txtRight:{
    textAlign:"right"
  },
  txtCenter:{
    textAlign:"center"
  },
  pageHeader:{
    flexDirection: 'row',
    marginBottom:5,
  },
  pageHeaderSub1:{
    width:"50%",
    padding:"3 5",
  },
  pageHeaderSub2:{
    width:"50%",
    padding:"3 5",
    backgroundColor:"#99ccff"
  },
  logoCont:{
    flexDirection: 'row',
    borderBottom:"1 solid #777",
    marginBottom:5,
    paddingBottom:5,
    alignItems:"center",
    justifyContent: "space-between"
  },
  logoContSub1:{
    width:"20%",
  },
  logoContSub2:{
    width:"80%",
    textAlign:"right"
  },
});

// Create Document Component
const InvoicesPdf = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  
  const subTotal=
    props.financeTotal.branding_fees +
    props.financeTotal.cabinet_testing_fees +
    props.financeTotal.corrective_reaction +
    props.financeTotal.corrective_service_in_house +
    props.financeTotal.drop +
    props.financeTotal.exchange_corrective_reaction +
    props.financeTotal.handling_in +
    props.financeTotal.in_house_preventive_maintenance +
    props.financeTotal.preventive_maintenance +
    props.financeTotal.storage +
    props.financeTotal.transportation_fees
  const totalWithVat=subTotal*props.companyValue.vat_percentage/100
  


return isLoading === true ? (
  <PDFViewer style={styles.pdfContainer}>
    <Document>
      <Page style={styles.page} wrap>
        <View style={styles.logoCont} fixed>
          <View style={styles.logoContSub1}>
            <Image src={`/img/companies/${props.companyValue.logo}`} alt="" style={{width:150}} />
          </View>
          <View style={styles.logoContSub2}>
            <Text>Invoice #: {props.referenceNum}</Text>
            <Text>Date: {moment().format('YYYY-MM-DD')}</Text>
          </View>
        </View>
          <View style={styles.pageHeader}>
            <View style={styles.pageHeaderSub1}>
              <Text style={styles.tableTitle}>{props.companyValue.name||""}</Text>
              <Text>{props.companyValue.address||""}</Text>
              <Text>W: {props.companyValue.website||""}</Text>
              <Text>E: {props.companyValue.email||""}</Text>
            </View>
            <View style={styles.pageHeaderSub2}>
              <Text style={styles.tableTitle}>Attn.:{props.companyValue.name||""}</Text>
              <Text>{props.companyValue.description||""}</Text>
              <Text>T: {props.companyValue.phone||""}</Text>
            </View>
          </View>
        
        <View style={styles.tableCont} wrap={false}>
          <View style={styles.headerCont}>
            <View style={styles.tableCont75}>
              <Text style={styles.tableTitle}>Description</Text>
            </View>
            <View style={styles.tableCont25}>
              <Text style={styles.tableTitle}>Amount</Text>
            </View>
          </View>
          <View style={styles.bodyCont}>
            <View style={styles.tableCont75}>
            <Text style={styles.tableTxt}>Transportation</Text>
            </View>
            <View style={styles.tableCont25}>
            <Text style={styles.tableTxt}>{props.financeTotal.transportation_fees}</Text>
            </View>
          </View>
          <View style={styles.bodyCont}>
            <View style={styles.tableCont75}>
            <Text style={styles.tableTxt}>Handling In </Text>
            </View>
            <View style={styles.tableCont25}>
            <Text style={styles.tableTxt}>{props.financeTotal.handling_in}</Text>
            </View>
          </View>
          <View style={styles.bodyCont}>
            <View style={styles.tableCont75}>
            <Text style={styles.tableTxt}>Storage</Text>
            </View>
            <View style={styles.tableCont25}>
            <Text style={styles.tableTxt}>{props.financeTotal.storage}</Text>
            </View>
          </View>
          <View style={styles.bodyCont}>
            <View style={styles.tableCont75}>
            <Text style={styles.tableTxt}>Corrective Exchange</Text>
            </View>
            <View style={styles.tableCont25}>
            <Text style={styles.tableTxt}>{props.financeTotal.exchange_corrective_reaction}</Text>
            </View>
          </View>
          <View style={styles.bodyCont}>
            <View style={styles.tableCont75}>
            <Text style={styles.tableTxt}>Correction in store</Text>
            </View>
            <View style={styles.tableCont25}>
            <Text style={styles.tableTxt}>{props.financeTotal.corrective_reaction}</Text>
            </View>
          </View>
          <View style={styles.bodyCont}>
            <View style={styles.tableCont75}>
            <Text style={styles.tableTxt}>Correction in house</Text>
            </View>
            <View style={styles.tableCont25}>
            <Text style={styles.tableTxt}>{props.financeTotal.corrective_service_in_house}</Text>
            </View>
          </View>
          <View style={styles.bodyCont}>
            <View style={styles.tableCont75}>
            <Text style={styles.tableTxt}>Preventive in store</Text>
            </View>
            <View style={styles.tableCont25}>
            <Text style={styles.tableTxt}>{props.financeTotal.preventive_maintenance}</Text>
            </View>
          </View>
          <View style={styles.bodyCont}>
            <View style={styles.tableCont75}>
            <Text style={styles.tableTxt}>Preventive in house</Text>
            </View>
            <View style={styles.tableCont25}>
            <Text style={styles.tableTxt}>{props.financeTotal.in_house_preventive_maintenance}</Text>
            </View>
          </View>
          <View style={styles.bodyCont}>
            <View style={styles.tableCont75}>
            <Text style={styles.tableTxt}>Drop</Text>
            </View>
            <View style={styles.tableCont25}>
            <Text style={styles.tableTxt}>{props.financeTotal.drop}</Text>
            </View>
          </View>
          <View style={styles.bodyCont}>
            <View style={styles.tableCont75}>
            <Text style={styles.tableTxt}>Cabinet Testing</Text>
            </View>
            <View style={styles.tableCont25}>
            <Text style={styles.tableTxt}>{props.financeTotal.cabinet_testing_fees}</Text>
            </View>
          </View>
          <View style={styles.bodyCont}>
            <View style={styles.tableCont75}>
            <Text style={styles.tableTxt}>Branding</Text>
            </View>
            <View style={styles.tableCont25}>
            <Text style={styles.tableTxt}>{props.financeTotal.branding_fees}</Text>
            </View>
          </View>

          <View style={styles.footerCont}>
            <View style={styles.tableCont50}>
              <Text style={styles.smTxt}>{converter.toWords(subTotal)}</Text>
            </View>
            <View style={{...styles.tableCont25,...styles.p0}}>
              <View style={styles.footerSub}><Text style={styles.smTxt}>SUBTOTAL</Text></View>
              <View style={styles.footerSub}><Text style={styles.smTxt}>VAT</Text></View>
              <View style={{...styles.footerSub,...styles.bb0}}><Text style={styles.smTxt}>BALANCE</Text></View>
            </View>
            <View style={{...styles.tableCont25,...styles.p0}}>
              <View style={styles.footerSub}><Text style={styles.tableTxt}>$ {subTotal}</Text></View>
              <View style={styles.footerSub}><Text style={styles.tableTxt}>$ {totalWithVat}</Text></View>
              <View style={{...styles.footerSub,...styles.bb0}}><Text style={styles.tableTxt}>$ {subTotal+totalWithVat}</Text></View>
            </View>
          </View>
          <View style={styles.underFooterCont}>
            <View style={styles.tableCont75}>
            <Text style={{...styles.smTxt,...styles.colorGrey}}>MAKE ALL CHEQUES PAYBALE TO: {props.companyValue.name||""}</Text>
            </View>
            <View style={styles.underFooterCont25}>
              <Text style={{...styles.smTxt,...styles.colorGrey}}>KINDLY PAY THIS AMOUNT ONLY</Text>
            </View>
          </View>
          </View>
          <View style={styles.signature}>
            <View style={styles.signatureSub}>
            <Text style={{...styles.smTxt,...styles.colorGrey}}>Checked&nbsp;by:&nbsp;_________________________</Text>
            </View>
            <View style={{...styles.signatureSub,...styles.txtRight}}>
              <Text style={{...styles.smTxt,...styles.colorGrey}}>Received&nbsp;by:&nbsp;_________________________</Text>
            </View>
          </View>
            <View style={{...styles.signature,...styles.txtCenter}}>
              <Text style={{...styles.smTxt,...styles.colorGrey}}>THANK YOU FOR YOUR BUSINESS!</Text>
            </View>
        </Page>
    </Document>
  </PDFViewer>
) : null;
}
export default InvoicesPdf