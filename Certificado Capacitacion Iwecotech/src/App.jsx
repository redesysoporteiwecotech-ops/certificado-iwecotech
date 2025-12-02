import React, { useState } from "react";

export default function ConsultaCertificados() {
  const [cedula, setCedula] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzdMiggpard62hXWHBj4zd_Jothr4sSIc41BO_6i4H6P3yCWzd5EL4NRujGtKCHQmgs/exec";

  const scriptInvalido = SCRIPT_URL.includes("REEMPLAZAR_AQUI");

  const handleConsultar = async (e) => {
    e.preventDefault();

    if (scriptInvalido) {
      alert("⚠ ERROR: Debe reemplazar 'REEMPLAZAR_AQUI' con su SCRIPT_URL real");
      return;
    }

    setLoading(true);

    try {
      const url = `${SCRIPT_URL}?cedula=${cedula}`;
      const respuesta = await fetch(url);

      if (!respuesta.ok) throw new Error("Error al conectar con el servidor");

      const data = await respuesta.json();

      if (data.status === "ok") {
        setResultado(data.data);
      } else {
        setResultado(null);
        alert("No se encontró certificado para esta cédula.");
      }
    } catch (error) {
      console.error("ERROR FETCHING:", error);
      alert("No se pudo conectar con la base de datos.");
    }

    setLoading(false);
  };

  const renderBoton = () => {
    if (!resultado) return null;

    const hoy = new Date();
    const venc = new Date(resultado.fechaVencimiento);
    const isVencido = hoy > venc;

    return (
      <div className="w-full">
        {isVencido ? (
          <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition">
            Renovar Certificado
          </button>
        ) : (
          <button
            onClick={() => document.getElementById("carnetPDF")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl transition"
          >
            Vista Previa
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-100 text-black min-h-screen flex flex-col items-center p-6 transition duration-500">
      <div className="bg-white w-full max-w-2xl shadow-xl rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <img src="/logo-iwecotech.png" alt="Logo IWECOTECH" className="h-16 object-contain" />
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">Consulta de Certificados</h1>

        <form onSubmit={handleConsultar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cédula de Identidad</label>
            <input
              type="text"
              value={cedula}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) setCedula(val);
              }}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese su número de cédula"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold transition"
          >
            Consultar
          </button>
        </form>

        {loading && <p className="text-center text-green-600 mt-4 font-medium animate-pulse">Consultando...</p>}

        {resultado && !loading && (
          <div className="mt-6 space-y-4">

            <div
              id="carnetPDF"
              className="bg-white shadow-2xl rounded-2xl p-6 border-t-8 border-green-700 w-full max-w-md mx-auto flex flex-col items-center gap-6"
            >
              <div className="w-full space-y-2 bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800">
                <h2 className="text-lg font-bold text-green-800 mb-2">Carnet Digital</h2>
                <p><strong>Nombre:</strong> {resultado.nombre}</p>
                <p><strong>Apellido:</strong> {resultado.apellido}</p>
                <p><strong>Cédula:</strong> {resultado.cedula}</p>
                <p><strong>Oficio:</strong> {resultado.oficio}</p>
                <p><strong>Ocupación:</strong> {resultado.ocupacion}</p>
                <p><strong>N° de Certificado:</strong> {resultado.numeroCertificado}</p>
                <p><strong>N° de Carnet:</strong> {resultado.numeroCarnet}</p>
                <p><strong>Curso:</strong> {resultado.curso}</p>
                <p><strong>Emisión:</strong> <span className="text-green-700 font-bold">{resultado.fechaEmision}</span></p>
                <p><strong>Vencimiento:</strong> <span className="text-red-600 font-bold">{resultado.fechaVencimiento}</span></p>
              </div>

              <img src={resultado.qr} alt="QR" className="w-40 h-40 rounded-lg border" />
            </div>

            {renderBoton()}
          </div>
        )}
      </div>

      <footer className="w-full text-center text-gray-600 mt-10 text-sm">
        © {new Date().getFullYear()} IWECOTECH — Todos los derechos reservados
      </footer>
    </div>
  );
}