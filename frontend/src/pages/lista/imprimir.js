import React, { useEffect, useState } from 'react';
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import 'jspdf-autotable';


export const generarPDF = (embarque, mercancias) => {
    const doc = new jsPDF({ orientation: 'landscape', format: 'a3' }); // 🔹 Usa tamaño A3 para más espacio

    doc.setFontSize(14);
    doc.text('Detalle Resumen Embarque', 14, 15);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Número de Embarque:", 14, 30);
    doc.text("Nombre Chofer:", 90, 30);
    doc.text("Fecha Embarque:", 14, 40);
    doc.text("Pat. Camión:", 90, 40);
    doc.text("Pat. Semiremolque:", 150, 40);

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.setFont("helvetica", "italic");
    doc.text(`${embarque.num_embarque}`, 55, 30);
    doc.text(`${embarque.chofer}`, 118, 30);
    doc.text(`${new Date(embarque.fecha_salida).toLocaleDateString()}`, 45, 40);
    doc.text(`${embarque.patente_camion}`, 112, 40);
    doc.text(`${embarque.patente_remolque}`, 185, 40);

    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");

    const headers = [
        'Fecha','Nro. Orden', 'Tipo Doc', 'Folio', 'Rut Proveedor', 'Proveedor','$ Monto Doc.', 'Forma de pago',
        'Descripcion','Rut Cliente', 'Nombre Cliente', 'N° Bultos', 'Kilos Un.','Kilos Total' , 'M³', '$ Precio neto', '$ Precio IVA'
    ];

    const data = mercancias[embarque.id_embarque]?.map(mercancia => [
        new Date(mercancia.fecha).toLocaleDateString(),
        mercancia.numero_orden,
        mercancia.tipo_pago,
        mercancia.num_documento,
        mercancia.rut_proveedor,
        mercancia.proveedor,
        Number(mercancia.monto_documento).toLocaleString(),
        mercancia.condicion_pago,
        mercancia.descripcion,
        mercancia.rut,
        mercancia.nombre,
        mercancia.cantidad_bultos,
        mercancia.peso_unidad,
        mercancia.peso_total,
        mercancia.metros_cubicos,
        Number(mercancia.precio_unitario).toLocaleString(),
        Number(mercancia.precio_iva).toLocaleString()
    ]) || [];

    doc.autoTable({
        startY: 50,
        head: [headers],
        body: data,
        styles: { fontSize: 10, cellPadding: 4 }, // 🔹 Más espacio en celdas
        headStyles: {
            fillColor: [240, 240, 240], // Gris claro
            textColor: [30, 30, 30], // Negro
            fontStyle: 'bold'
        },
        bodyStyles: {
            fillColor: [255, 255, 255], // Blanco
            textColor: [70, 70, 70],
            lineWidth: 0.01,
            lineColor: [0, 0, 0]
        },
        tableWidth: "auto", // 🔹 Ajusta la tabla al contenido
        margin: { left: 5 },
        theme: 'plain',
        columnStyles: {
            0: { cellWidth: 'wrap' },
            1: { cellWidth: 'wrap' },
            2: { cellWidth: 'wrap' },
            3: { cellWidth: 'wrap' },
            4: { cellWidth: 'wrap' },
            5: { cellWidth: 'wrap' },
            6: { cellWidth: 'wrap' },
            7: { cellWidth: 'wrap' },
            8: { cellWidth: 'wrap' },
            9: { cellWidth: 'wrap' },
            10: { cellWidth: 'wrap' },
            11: { cellWidth: 'wrap' },
            12: { cellWidth: 'wrap' },
            13: { cellWidth: 'wrap' },
            14: { cellWidth: 'wrap' },
            15: { cellWidth: 'wrap' },
            16: { cellWidth: 'wrap' }
        }
    });

    const pdfOutput = doc.output("blob"); // Genera un Blob del PDF
    const pdfUrl = URL.createObjectURL(pdfOutput);
    window.open(pdfUrl);
};
