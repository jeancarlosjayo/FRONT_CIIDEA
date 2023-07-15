/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef }     from 'react';
import { Document, Page, Text, View, StyleSheet,Image } from '@react-pdf/renderer';
import { PDFViewer }                              from '@react-pdf/renderer';
import axios          from  'axios';
import Swal           from  'sweetalert2';
import { Toolbar }    from  'primereact/toolbar';
import { Toast }      from  'primereact/toast';
import { Button }     from  'primereact/button';
import { DataTable }  from  'primereact/datatable';
import { Column }     from  'primereact/column';
import URL            from  '../config/Api';
import Loader         from  './Loader';
import {DateFormat}   from  '../util/DateFormat';

const Report = ({ setIsLogin }) => {

    const toast                                       = useRef(null);
    const [token, setToken]                           = useState('');
    const [isLoading, setIsLoading]                   = useState(false)
    const [graduate, setGraduate]                     = useState([]);
    const [student, setStudent]                       = useState([]);
    const [ selectedGraduate, setSelectedGraduate ]   = useState([]);
    const [ selectedReport, setSelectedReport ]       = useState([]);
    const [ verPdfViewer, setVerPdfViewer ]           = useState(false);

    const baseGraduateUrl   = `${URL}/graduate`;
    const baseattendanceUrl = `${URL}/attendance`;

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
    if (token) { 
        setIsLoading(true);
        cargarGraduate(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    //TODO: Get graduate**
    const cargarGraduate = async (token) => {

        const cargarGraduate = await axios.get(baseGraduateUrl, {
            headers: { Authorization: token },
        })

        setGraduate(cargarGraduate.data);
        setIsLoading(false);
        
    }

    //TODO: Get student by graduate**
    const cargarReport = async (rowData) => {
      setIsLoading(true);
      const cargarReport = await axios.get(`${baseattendanceUrl}/report/${rowData._id}`, {
          headers: { Authorization: token }
      }).then((res)=>{
        setSelectedReport(res.data);
        setIsLoading(false);
      });
    }

    //TODO: 
  const generateReport = async (rowData) => {
    setSelectedGraduate(rowData);
    cargarReport(rowData);
    setVerPdfViewer(true);
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <h5>Reportes para certificación</h5>
      </React.Fragment>
    );
  };

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4'
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
      border:'1px solid black'
    }
  });

  const MyDocument = () => {
    const now = new DateFormat( new Date() );
    return (
      (
        <Document>
          <Page size="A4" style={{padding:"50px"}}>
            <View style={{display:"flex", flexDirection:"row"}}>
              <View style={{flex:1}}>
                <Image
                  style={{width:'50px',height:'50px'}}
                  src="/img/logo.png"
                />
              </View>
              <View style={{flex:5}}>
                <Text style={{textAlign:"left",fontSize:"12px",marginTop:'20px'}}>
                  CIIDEA
                </Text>
              </View>
              <View style={{flex:1}}>
                <Text style={{textAlign:"right",fontSize:"12px"}}>
                  Fecha: {now.getFormatDate2()}
                </Text>
              </View>
            </View>
            <View style={{display:"flex", flexDirection:"row", marginTop:'20px'}}>
              <View style={{flex:1}}>
                <Text style={{textAlign:"center",fontSize:"10px", fontWeight:"bold"}}>
                  REPORTE PARA EMISIÓN DE CERTIFICADOS
                </Text>
              </View>
            </View>
            <View style={{display:"flex", flexDirection:"row"}}>
              <View style={{flex:1}}>
                <Text style={{textAlign:"left",fontSize:"10px", fontWeight:"bold",marginTop:'20px'}}>
                  DATOS DEL DIPLOMADO
                </Text>
              </View>
            </View>
            <View style={{border:'1px solid black',borderRadius:'5px',marginTop:'10px',padding:'10px'}}>
              <View style={{display:"flex", flexDirection:"row", marginTop:'20px'}}>
                <View style={{flex:1}}>
                  <Text style={{textAlign:"left",fontSize:"10px", fontWeight:"bold"}}>
                    CODIGO:  {selectedGraduate.code}
                  </Text>
                </View>
                <View style={{flex:1}}>
                  <Text style={{textAlign:"left",fontSize:"10px", fontWeight:"bold"}}>
                    ESTADO:  {selectedGraduate.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={{display:"flex", flexDirection:"row", marginTop:'20px'}}>
                <View style={{flex:1}}>
                  <Text style={{textAlign:"left",fontSize:"10px", fontWeight:"bold"}}>
                    NOMBRE:  {selectedGraduate.name.toUpperCase()}
                  </Text>
                </View>
                <View style={{flex:1}}>
                  <Text style={{textAlign:"left",fontSize:"10px", fontWeight:"bold"}}>
                    INICIO: {selectedGraduate.startDate}
                  </Text>
                </View>
              </View>
              <View style={{display:"flex", flexDirection:"row", marginTop:'20px'}}>
                <View style={{flex:1}}>
                  <Text style={{textAlign:"left",fontSize:"10px", fontWeight:"bold"}}>
                    CANTIDAD SESIONES:  {selectedGraduate.sessions}
                  </Text>
                </View>
                <View style={{flex:1}}>
                  <Text style={{textAlign:"left",fontSize:"10px", fontWeight:"bold"}}>
                    FIN:  {selectedGraduate.endDate}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{display:"flex", flexDirection:"row"}}>
              <View style={{flex:1}}>
                <Text style={{textAlign:"left",fontSize:"10px", fontWeight:"bold",marginTop:'30px'}}>
                LISTA DE ESTUDIANTES
                </Text>
              </View>
            </View>

            {
              selectedReport.map((item) => (
                <View style={{border:'1px solid black',borderRadius:'5px',marginTop:'10px',padding:'10px'}}>
                  <View style={{display:"flex", flexDirection:"row", marginTop:'20px'}}>
                    <View style={{flex:1}}>
                      <Text style={{textAlign:"left",fontSize:"10px", fontWeight:"bold"}}>
                        DNI:  {item.student.dni}
                      </Text>
                    </View>
                  </View>
                  <View style={{display:"flex", flexDirection:"row", marginTop:'20px'}}>
                    <View style={{flex:1}}>
                      <Text style={{textAlign:"left",fontSize:"10px", fontWeight:"bold"}}>
                        NOMBRE: {item.student.name}
                      </Text>
                    </View>
                  </View>
                  <View style={{display:"flex", flexDirection:"row", marginTop:'20px'}}>
                    <View style={{flex:1}}>
                      <Text style={{textAlign:"left",fontSize:"10px", fontWeight:"bold"}}>
                        ASISTENCIA:  {item.attendance}
                      </Text>
                    </View>
                  </View>
                  <View style={{display:"flex", flexDirection:"row", marginTop:'20px'}}>
                    <View style={{flex:1}}>
                      <Text style={{textAlign:"left",fontSize:"10px", fontWeight:"bold"}}>
                        CANTIDAD DE CUOTAS:  {item.numCuotes}
                      </Text>
                    </View>
                  </View>
                  <View style={{display:"flex", flexDirection:"row", marginTop:'20px',marginBottom:'20px'}}>
                    <View style={{flex:1}}>
                      <Text style={{textAlign:"left",fontSize:"10px", fontWeight:"bold"}}>
                        ESTADO DE CUOTAS:  
                      </Text>
                    </View>
                  </View>

                  {
                    
                    item.cuotes.map((quo)=> (
                      <View style={{display:"flex", flexDirection:"row", padding:'10px'}}>
                        <View style={{flex:1}}>
                          <Text style={{textAlign:"center",fontSize:"10px", fontWeight:"bold"}}>
                            CUOTA {quo.numCuota}
                          </Text>
                        </View>
                        <View style={{flex:1}}>
                          <Text style={{textAlign:"center",fontSize:"10px", fontWeight:"bold"}}>
                            ESTADO:  {quo.status.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    ))

                  }

                  

                </View>
              ))
            }

          </Page>
        </Document>
      )
    )
  };

  const actionBodyTemplate = (rowData) => {

    return (
      <React.Fragment>
        <div className='col-12 md:col-12'>
          <Button
            label='Ver reporte'
            className='p-button-primary'
            onClick={() => generateReport(rowData) }
          />
        </div>
      </React.Fragment>
    );
  };

  let appendHtml = "";

  graduate ? 

  appendHtml = (

    <div>
      <Loader
        isLoading={isLoading}
      />
      
      {/* Main content */}
      <section className='content mx-1'>
        {/* Default box */}
        <div className='container-fluid'>
          <div className='card'>
                <div className='card-body'>
                    <div className='datatable-crud-demo'>
                        <Toast ref={toast} position='bottom-right' />
                        {/* <div className='card'> */}
                        <Toolbar className='mb-3' left={leftToolbarTemplate}></Toolbar>

                        {
                            verPdfViewer ? (
                              
                              <div 
                              style={{ 
                                border: '1px solid #ccc',
                                borderRadius: '1rem',
                                marginLeft:'0',
                                marginRight:'0',
                                paddingLeft:'4px',
                                paddingRight:'4px',
                                marginBottom:'24px'
                              }}>
                                <div  className='grid p-fluid  mt-2'>
                                  <div className='col-12 md:col-4'></div>
                                  <div className='col-12 md:col-4'>
                                    <Button
                                      label='Regresar'
                                      className='p-button-secondary'
                                      onClick={()=>{setVerPdfViewer(false)}}
                                    />
                                  </div>
                                  <div className='col-12 md:col-4'></div>
                                  <div className='col-12 md:col-12'>
                                    <PDFViewer 
                                      style={{ width:"100%",height:"100vh" }} 
                                    >
                                      <MyDocument data={selectedGraduate}/>
                                    </PDFViewer>
                                  </div>
                                </div>
                                
                              </div>
                            ) : (
                              <div className='grid p-fluid  mt-5'>
                                  <div className='col-12 md:col-12'>
                                  <DataTable
                                    value={graduate}
                                    selection={selectedGraduate}
                                    onSelectionChange={(e) => setSelectedGraduate(e.value)}
                                    dataKey="_id"
                                    responsiveLayout="scroll"
                                  >
                                    <Column field="code" header="Código"></Column>
                                    <Column field="name" header="Diplomado"></Column>
                                    <Column field="status" header="Estado"></Column>
                                    <Column field="startDate" header="Inicio"></Column>
                                    <Column field="endDate" header="Finalización"></Column>
                                    <Column
                                      header='Acciones'
                                      body={actionBodyTemplate}
                                      exportable={false}
                                    ></Column>
                                  </DataTable>
                                  </div>
                                </div>
                            )
                        }   

                    </div>
                </div>
            </div>
        </div>
      </section>

    </div>

  )

  :

  appendHtml = (
    <>Cargando ....</>
  )


  return ( appendHtml );
};

export default Report;