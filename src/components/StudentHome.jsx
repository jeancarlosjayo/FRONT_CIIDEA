import React, { useState,useRef } from "react";
import StudentServiceModal from "./modals/StudentServiceModal";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import axios from 'axios';
import URL from '../config/Api'
import Loader from './Loader';

const StudentHome = ({ setIsLogin }) => {
  const [isLoading, setIsLoading] = useState(false)  
  const quotesUrl = `${URL}/quotes`
  const [graduate, setGraduate] = useState({graduate: []});
  const [quotes, setQuotes] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [selectedQuotes, setSelectedQuotes] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [userDialog, setUserDialog] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [isSelectedEvidenceImg, setIsSelectedEvidenceImg] = useState(false);
  const [isSelectedGraduate,setIsSelectedGraduate] = useState(false);
  const [isSelectedQuote,setIsSelectedQuote] = useState(false);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState('Ningún archivo seleccionado');

  const toast = useRef(null);
  const openNew = () => {
    setIsLoading(true);
    setIsSelectedEvidenceImg(false);
    setIsSelectedGraduate(false);
    setIsSelectedQuote(false);
    setGraduate({graduate: []})
    setQuotes(null);
    setSubmitted(false);
    setUserDialog(true);
    setSelectedQuotes(null);
    setIsLoading(false);
    setImage(null)
    setFileName('Ningún archivo seleccionado')
    //setError('');
  };
  const hideDialog = () => {
    setUserDialog(false);
  };
  const onUpload = (e) => {
    setIsSelectedEvidenceImg(true);
    setArchivo(e);
  }

  const sendQuote = async (e) =>{
    e.preventDefault();
    if(selectedQuotes === null){
      console.log('campos requeridos')
      return;
    }else if(selectedQuotes._id === null){
      console.log('Debe elegir la cuota a pagar')
      return;
    }else if(archivo === null){
      console.log('Debe seleccionar un archivo')
      return;
    }else{
      setLoading1(true);
      const formData = new FormData();
      formData.append('file',archivo[0])
      formData.append('status','enviado')
     await axios.put(`${quotesUrl}/${selectedQuotes._id}`,
     formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    toast.current.show({
      severity: 'success',
      summary: 'Actualizado',
      detail: 'Evidencia de pago enviado con exito.',
      life: 3000,
    });
    setLoading1(false);
    setUserDialog(false);
    }
  }

  const userDialogFooter = () => {
    let appendHtml = "";
    isSelectedEvidenceImg ? 
    appendHtml = (
      <React.Fragment>
        <div className="text-center">
          <Button loading={loading1}  label="Enviar" icon="pi pi-send" className="p-button mt-3"  onClick={(e)=>sendQuote(e)}/>
        </div>
      </React.Fragment>
    ) : appendHtml = ( <></> ) 
    return ( appendHtml )
  }
  return (
    <div>
      {/* Loader */ }
      < Loader isLoading = { isLoading } />
      <section className="content mx-1">
        <div className="container-fluid">
          <div className="card">
            <h3 className="text-bold px-4 mt-3 text-secondary mb-5">
              SERVICIOS DEL ESTUDIANTE
            </h3>
            <div className="row">
              <div className="dahsboard__body col-12 col-sm-6 col-md-3">
                <Button
                  label="Enviar evidencia de pago"
                  className="p-button-raised ml-4"
                  onClick={openNew}
                />
              </div>
            </div>
          </div>
        </div>
        <Toast ref={toast} position='bottom-right' />
        <StudentServiceModal
          userDialog={userDialog}
          hideDialog={hideDialog}
          submitted={submitted}
          graduate={graduate}
          setGraduate={setGraduate}
          quotes={quotes}
          setQuotes={setQuotes}
          selectedQuotes={selectedQuotes} 
          setSelectedQuotes={setSelectedQuotes}
          onUpload={onUpload}
          userDialogFooter={userDialogFooter}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setIsSelectedEvidenceImg={setIsSelectedEvidenceImg}
          setIsSelectedGraduate={setIsSelectedGraduate}
          isSelectedGraduate={isSelectedGraduate}
          isSelectedEvidenceImg={isSelectedEvidenceImg}
          setIsSelectedQuote={setIsSelectedQuote}
          isSelectedQuote={isSelectedQuote}
          image={image}
          setImage={setImage}
          fileName={fileName}
          setFileName={setFileName}
        />
      </section>
    </div>
  );
};

export default StudentHome;
