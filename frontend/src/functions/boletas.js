import React, { useEffect, useState } from 'react';
import { jsPDF } from "jspdf";
import QRCode from "qrcode";


export const generarBoleta = async (envioData, clienteData, mercancia) => {
    const doc = new jsPDF({
      unit: "mm",
      format: [50, 250], // Más ancha y más larga
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // Obtiene el ancho de la página
    const centerText = (text, y) => {
        const textWidth = doc.getTextWidth(text);
        const x = (pageWidth - textWidth) / 2;
        doc.text(text, x, y);
    };

    // Generar número aleatorio de 9 cifras
    const numeroOrden = Math.floor(100000000 + Math.random() * 900000000);

    // Generar código QR
    const qrData = `Orden de Flete: ${numeroOrden}`;
    const qrCanvas = document.createElement("canvas");
    await QRCode.toCanvas(qrCanvas, qrData);
    const qrImage = qrCanvas.toDataURL("image/png");

    // Encabezado
    doc.setFontSize(12);
    centerText("--Orden de Flete--", 10 );
    doc.setFontSize(10);
    centerText(`No. ${numeroOrden}`, 17);

    const qrX = (pageWidth - 20) / 2;
    doc.addImage(qrImage, "PNG", qrX, 17, 20, 20); // Agrega el QR en la esquina superior derecha

    // Datos del Origen
    doc.setFontSize(10);
    centerText("--Datos del Origen--", 41);
    doc.setFontSize(9);
    doc.text(`Ciudad:   ${envioData.origen}`, 5, 50);
    doc.text(`Lugar:    ${envioData.lugar}`, 5, 56);

    // Datos del Destino
    doc.setFontSize(10);
    centerText("--Datos del Destino--",65);
    doc.setFontSize(9);
    doc.text(`Ciudad: ${envioData.destino}`, 5, 73);
    doc.text(`Lugar Recogida: ${envioData.recogida}`, 5, 79);

    // Datos del Destinatario
    doc.setFontSize(10);
    centerText("--Datos Destinatario--", 87);
    doc.setFontSize(9);
    doc.text(`Nombre:       ${clienteData.nombre}`, 5, 95);
    doc.text(`Rut:           ${clienteData.rut}`, 5, 101);
    doc.text(`Dirección:    ${clienteData.direccion}`, 5, 107);
    doc.text(`Comuna:       ${clienteData.comuna}`, 5, 113);
    doc.text(`Ciudad:       ${clienteData.ciudad}`, 5, 119);
    doc.text(`Teléfono:     ${clienteData.telefono}`, 5, 125);

    // Encargos
    doc.setFontSize(10);
    centerText("--Encargos--", 133);
    doc.setFontSize(10);
    let y = 147;
    doc.text('-Tipo-' , 5,139 )
    doc.text('-Cantidad-' , 35,139 )
    doc.text('-Peso-' , 65,139 )
    mercancia.forEach((item) => {
      doc.text(`${item.tipo_bulto}`, 5, y);
      doc.text(`${item.cantidad_bultos}`, 43, y);
      doc.text(`${item.peso}kg`, 65, y);
      y += 6;
    });

    // Abrir el PDF
    const pdfOutput = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfOutput);
    window.open(pdfUrl);
  };




export const generarTicket = (envioData,clienteData,item) => {
    const doc = new jsPDF({
      unit: "mm",
      format: [65, 95]
    });
    for (let i = 1; i <= item.cantidad_bultos; i++) {
      if (i > 1) doc.addPage(); // Añade una nueva página si no es la primera
      doc.setFontSize(14);
      doc.text("Etiqueta", 10, 10);
    
      doc.setFontSize(12);
      doc.text(`Nombre: ${clienteData.nombre}`, 10, 20);
      doc.text(`Rut: ${clienteData.rut}`, 10, 30);
      doc.text(`Origen: ${envioData.origen}`, 10, 40);
      doc.text(`Destino: ${envioData.destino}`, 10, 50);
      doc.text(`Número de Bultos: ${item.cantidad_bultos}`, 10, 60);
      
      doc.setFontSize(50); // Tamaño un poco menor para el número
      doc.text(`${i} / ${item.cantidad_bultos}`, 32.5, 85, { align: "center" });
    }
    // Guarda el archivo o abre el diálogo de impresión
    const pdfOutput = doc.output("blob"); // Genera un Blob del PDF
    const pdfUrl = URL.createObjectURL(pdfOutput);
    window.open(pdfUrl); // Abre el PDF en una nueva ventana para imprimir
    
  };