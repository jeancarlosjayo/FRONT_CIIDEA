import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MdCloudUpload, MdDelete } from 'react-icons/md'
import { AiFillFileImage } from 'react-icons/ai'
import URL from "../../config/Api";
import axios from "axios";

const StudentServiceModal = (props) => {
  const baseUrl = `${URL}/users`;
  const baseUrlQuotes = `${URL}/payments/student/data`;
  const idUser = localStorage.getItem("id");

  let emptyUser = { graduate: [] };

  const isSelectable = (value, field) => {
    let isSelectable = true;
    switch (field) {
      case "status":
        isSelectable = value === "pendiente";
        break;
      default:
        break;
    }
    return isSelectable;
  };
  const isRowSelectable = (event) => {
    const data = event.data;
    return isSelectable(data.status, "status");
  };

  const rowClassName = (data) => {
    return isSelectable(data.status, "status") ? "" : "p-disabled";
  };
  const [user, setUser] = useState(emptyUser);

  const setDataUser = async (id) => {
    props.setIsLoading(true);
    const respuesta = await axios.get(`${baseUrl}/${id}`);
    setUser({ graduate: respuesta.data.graduate });
    props.setIsLoading(false);
  };
  const setDataQuote = async (e, idGraduate) => {
    e.preventDefault();
    const response = await axios.get(baseUrlQuotes, {
      params: {
        student: idUser,
        graduate: idGraduate,
      },
    });
    props.setQuotes(response.data);
  };
  const onGraduateChange = (e) => {
    props.setIsSelectedGraduate(true);
    const val = (e.target && e.target.value) || "";
    props.setGraduate(val);
    setDataQuote(e, val._id);
  };
 

  useEffect(() => {
   
    setDataUser(idUser);

  }, []); // eslint-disable-line react-hooks/exhaustive-deps
 
  return (
    <div>
      <Dialog
        visible={props.userDialog}
        style={{ width: "40vw" }}
        breakpoints={{ "960px": "40vw" }}
        header={"Enviar evidencia de pago"}
        modal
        className="p-fluid"
        footer={props.userDialogFooter}
        onHide={props.hideDialog}
      >
        <div className="mb-3">
          {props.error && <small className="p-error">{props.error}</small>}
        </div>
        <div className="grid p-fluid">
          <div className="col-12 md:col-12">
            <Dropdown
              value={props.graduate}
              options={user.graduate}
              onChange={(e) => onGraduateChange(e)}
              optionLabel="name"
              placeholder="Seleccione un diplomado"
            />
          </div>
          
          {
          props.isSelectedGraduate ?
          
            (
              <>
                <div className="col-12 md:col-12 mb-5">
                  <DataTable
                    sortOrder={1}
                    sortField="numCuota"
                    value={props.quotes}
                    selection={props.selectedQuotes}
                    onSelectionChange={(e) => {
                      props.setSelectedQuotes(e.value);
                      props.setIsSelectedQuote(true);
                    }}
                    dataKey="_id"
                    responsiveLayout="scroll"
                    isDataSelectable={isRowSelectable}
                    rowClassName={rowClassName}
                  >
                    <Column
                      selectionMode="single"
                      headerStyle={{ width: "3em" }}
                    ></Column>
                    <Column field="numCuota" sortable header="#"></Column>
                    <Column field="importeCuota" header="Cuota"></Column>
                    <Column field="status" header="Estado"></Column>
                    <Column field="fecVencCuota" header="Fecha Vencimiento"></Column>
                    <Column field="fecPagoCuota" header="Fecha Pago"></Column>
                  </DataTable>
                </div>
                {
                  props.isSelectedQuote ? 
                  (
                    <div className="col-12 md:col-12">
                    {/* <input type="file" name="file" onChange={(e)=>props.onUpload(e.target.files)} required/> */}
                    <form className="formFile"
                    onClick={()=> document.querySelector(".input-field").click()}>
                    <input type="file" accept="image/*" className="input-field" hidden
                      onChange={({target:{files}})=>{files[0] && props.setFileName(files[0].name) 
                      if(files){
                        props.onUpload(files)
                        props.setImage(global.URL.createObjectURL(files[0]))
                        }
                        }}/>
                    {props.image ? <img src={props.image} width={250} height={250} alt={props.fileName}/> 
                    : 
                    <><MdCloudUpload color='#6366F1' size={60}/> <p>Explorar archivos para cargar</p></>}
                    </form>
                    <section className="uploaded-row">
                      <AiFillFileImage color='#6366F1' />
                      <span className='upload-content'>
                        {props.fileName} -
                      <MdDelete onClick={()=>{
                        props.setFileName("Ningún archivo seleccionado")
                        props.setImage(null)
                        props.setIsSelectedEvidenceImg(false)
                      }
                      }/></span>
                    </section>
                  </div>
                  ):(<></>)
                }
              </>
            ) : (<></>)

          }
          
        </div>
      </Dialog>
    </div>
  );
};

export default StudentServiceModal;
