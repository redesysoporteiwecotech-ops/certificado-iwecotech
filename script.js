document.getElementById("year").textContent=new Date().getFullYear();

const FORM=document.getElementById("consultaForm");
const LOADING=document.getElementById("loading");
const RESULTADO=document.getElementById("resultado");
const BOTONES=document.getElementById("botones");

const SCRIPT_URL="https://script.google.com/macros/s/AKfycbz0d6T1V0YuwqFrhDM5gbd9e-LBVtX2zyxFacgG4x9-RVFsb-EoXtWpxgWtwRQJ2w54/exec";

FORM.addEventListener("submit",async(e)=>{
  e.preventDefault();
  const ced=document.getElementById("cedula").value.trim();
  if(!ced) return;

  LOADING.classList.remove("oculto");

  try{
    const res=await fetch(`${SCRIPT_URL}?cedula=${ced}`);
    const data=await res.json();

    LOADING.classList.add("oculto");

    if(data.status!=="ok"){
      alert("No se encontró certificado para esta cédula.");
      RESULTADO.classList.add("oculto");
      return;
    }

    const r=data.data;

    document.getElementById("r_nombre").textContent=r.nombre;
    document.getElementById("r_apellido").textContent=r.apellido;
    document.getElementById("r_cedula").textContent=r.cedula;
    document.getElementById("r_oficio").textContent=r.oficio;
    document.getElementById("r_ocupacion").textContent=r.ocupacion;
    document.getElementById("r_certificado").textContent=r.numeroCertificado;
    document.getElementById("r_carnet").textContent=r.numeroCarnet;
    document.getElementById("r_curso").textContent=r.curso;
    document.getElementById("r_emision").textContent=r.fechaEmision;
    document.getElementById("r_vencimiento").textContent=r.fechaVencimiento;
    document.getElementById("r_qr").src=r.qr;

    RESULTADO.classList.remove("oculto");

    const hoy=new Date();
    const venc=new Date(r.fechaVencimiento);

    BOTONES.innerHTML=
      hoy>venc
      ? `<button class='btn-renovar'>Renovar Certificado</button>`
      : `<button class='btn-vista' onclick="document.getElementById('carnetPDF').scrollIntoView({ behavior: 'smooth' })">Vista Previa</button>`;

  } catch(err){
    LOADING.classList.add("oculto");
    alert("Error al conectar con la base de datos.");
  }
});
