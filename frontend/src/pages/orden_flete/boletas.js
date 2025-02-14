import React, { useEffect, useState } from 'react';
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import 'jspdf-autotable';


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




  export const generarTicket = (envioData, clienteData, mercancia) => {
    const doc = new jsPDF({
      unit: "mm",
      format: [65, 95],
    });
  
    // Sumar la cantidad de bultos de todas las mercancías
    const totalBultos = mercancia.reduce((sum, item) => sum + item.cantidad_bultos, 0);
  
    let currentBulto = 1; // Contador de bultos global
  
    // Iterar sobre cada mercancía
    mercancia.forEach((item, index) => {
      // Iterar sobre la cantidad de bultos de cada mercancía
      for (let i = 1; i <= item.cantidad_bultos; i++) {
        if (currentBulto > 1) doc.addPage(); // Añade una nueva página si no es la primera
  
        doc.setFontSize(14);
        doc.text("Etiqueta", 10, 10);
  
        doc.setFontSize(9);
        doc.text(`Nombre: ${clienteData.nombre}`, 10, 20);
        doc.text(`Rut: ${clienteData.rut}`, 10, 25);
        doc.text(`Origen: ${envioData.origen}`, 10, 30);
        doc.text(`Destino: ${envioData.destino}`, 10, 35);
        doc.text(`Número de Bultos: ${totalBultos}`, 10, 40);
  
        // Información específica de la mercancía
        doc.text(`Descripción: ${item.descripcion}`, 10, 45);
       {/* doc.text(`Proveedor: ${item.proveedor}`, 10, 80); */}
  
        // Número de bulto actual y total
        doc.setFontSize(50); // Tamaño un poco menor para el número
        doc.text(`${currentBulto} / ${totalBultos}`, 32.5, 75, { align: "center" });
  
        currentBulto++; // Incrementar el contador de bultos
      }
    });
  
    // Guarda el archivo o abre el diálogo de impresión
    const pdfOutput = doc.output("blob"); // Genera un Blob del PDF
    const pdfUrl = URL.createObjectURL(pdfOutput);
    window.open(pdfUrl); // Abre el PDF en una nueva ventana para imprimir
  };



  

  export const generarPDF = (clienteData, envioData, fechaReal, mercancia) => {
      const doc = new jsPDF({ orientation: 'landscape' });
  
      // Agregar título
      doc.setFontSize(18);
      doc.text('Orden Confirmada', 10, 10);
  
      // Agregar datos del cliente
      doc.setFontSize(12);

      doc.text('Datos del Cliente', 13, 23);
      const clienteTabla = [
          ['RUT', clienteData.rut],
          ['Nombre', clienteData.nombre],
          ['Dirección', clienteData.direccion],
          ['Actividad Económica', clienteData.actividad],
          ['Comuna', clienteData.comuna],
          ['Ciudad', clienteData.ciudad],
          ['Región', clienteData.region],
          ['Teléfono', clienteData.telefono],
      ];

      // Agregar detalles del envío
      doc.text('Detalles del Envío', 110, 23);
      const envioTabla = [
          ['Condición de pago', envioData.condicion],
          ['Fecha', fechaReal],
          ['Origen', envioData.origen],
          ['Destino', envioData.destino],
          ['Lugar de Recogida', envioData.recogida],
          ['Lugar de Entrega', envioData.entrega],
      ];
     // Tabla Cliente
    doc.autoTable({
      startX: 10,
      startY: 25,
      body: clienteTabla,
      theme: 'grid',
      tableWidth: 90,
      styles: { fontSize: 10 }
    });

    // Tabla Envío
    doc.autoTable({
      margin: { left: 110 }, // 10 + 90 + 10 (espacio)
      startY: 25,
      body: envioTabla,
      theme: 'grid',
      tableWidth: 90,
      styles: { fontSize: 10 }
    });
    
      // Agregar tabla de mercancías
      doc.text('Mercancías', 13, doc.autoTable.previous.finalY + 25);
      const mercanciaTabla = mercancia.map((item) => [
          item.tipo_pago,
          item.num_documento,          
          item.descripcion,
          item.proveedor,
          item.rut_proveedor,
          item.cantidad_bultos,
          item.peso_unidad,
          item.peso_total,
          item.metros_cubicos,
          Number(item.precio_unitario).toLocaleString(),
          Number(item.precio_iva).toLocaleString(),
          envioData.condicion,
          clienteData.nombre,
          clienteData.rut
      ]);

      doc.autoTable({
        startY: doc.autoTable.previous.finalY + 30,
        head: [['Tipo de Doc.','Número Folio','Descripción',  'Proveedor', 'Rut Proveedor', 'Numero Bultos', 'Kilos Un.', 'Kilos Total', 'Metros³ ', '$ Precio neto', '$ Precio IVA', 'Condicion Pago', 'Nombre Cliente','Rut Cliente']],
        body: mercanciaTabla,
        styles: {
            overflow: 'linebreak',
            cellWidth: 'wrap',
            fontSize: 8,
            lineHeight: 1.2
        },
        columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 20 },
            2: { cellWidth: 20 },
            3: { cellWidth: 25 },
            4: { cellWidth: 25 },
            5: { cellWidth: 20 },
            6: { cellWidth: 16 },
            7: { cellWidth: 15 },
            8: { cellWidth: 16 },
            9: { cellWidth: 16 }
        },
        headStyles: {
            fillColor: [240, 240, 240], // Gris claro
            textColor: [30, 30, 30],       // Negro
            fontStyle: 'bold'
        },
        bodyStyles: {
            fillColor: [255, 255, 255], // Blanco
            textColor: [70, 70, 70],
            lineWidth: 0.01,                // Grosor de los bordes del cuerpo
        lineColor: [0, 0, 0]

        },
        alternateRowStyles: false,
        tableWidth: 'auto',
        margin: { left: 5 },
        theme: 'plain'
    });
  
      // Guardar el PDF

      const pdfOutput = doc.output("blob"); // Genera un Blob del PDF
      const pdfUrl = URL.createObjectURL(pdfOutput);
      window.open(pdfUrl);
  };