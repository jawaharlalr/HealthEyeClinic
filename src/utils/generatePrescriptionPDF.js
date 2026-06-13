import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const generatePrescriptionPDF = async (rxData) => {
  // 1. Fetch full patient details
  const q = query(collection(db, "patients"), where("mrNo", "==", rxData.mrNo));
  const snap = await getDocs(q);
  const pData = !snap.empty ? snap.docs[0].data() : {};

  const data = {
    ...rxData,
    patientName: pData.name || rxData.patientName,
    patientAge: pData.age || 'N/A',
    patientGender: pData.gender || 'N/A',
    patientPhone: pData.phone || 'N/A',
    patientAddress: pData.address || 'N/A'
  };

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  let currentY = 15;

  // --- 1. HEADER ---
  try {
    const img = new Image();
    img.src = '/logo.png';
    doc.addImage(img, 'PNG', 14, 10, 20, 12);
  } catch (e) { console.warn("Logo skipped"); }

  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text("Healthy Eye Clinic & Opticals", pageWidth / 2, currentY, { align: "center" });
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  currentY += 6;
  doc.text("12A, Surya Nagar, MGR Nagar, Medavakkam, Chennai, Tamil Nadu 600100", pageWidth / 2, currentY, { align: "center" });
  currentY += 4;
  doc.setDrawColor(0, 0, 0);
  doc.line(14, currentY, pageWidth - 14, currentY);
  
  currentY += 10;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text("GLASS PRESCRIPTION", pageWidth / 2, currentY, { align: "center" });
  currentY += 5;
  doc.line(14, currentY, pageWidth - 14, currentY);

  // --- 2. PATIENT DETAILS ---
  currentY += 10;
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text("Patient Details:", 14, currentY);
  doc.setFont(undefined, 'normal');
  const formattedDate = new Date().toLocaleDateString('en-GB');
  doc.text(`Name: ${data.patientName}`, 14, currentY + 6);
  doc.text(`Phone: ${data.patientPhone}`, 110, currentY + 6);
  doc.text(`MR No: ${data.mrNo || 'N/A'}`, 14, currentY + 11);
  doc.text(`Date: ${formattedDate}`, 110, currentY + 11);
  doc.text(`Age/Gender: ${data.patientAge} / ${data.patientGender}`, 14, currentY + 16);
  doc.text("Address:", 110, currentY + 16);
  const addressLines = doc.splitTextToSize(data.patientAddress, 80);
  doc.text(addressLines, 110, currentY + 19);
  
  currentY += 35;
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 5;

  // --- 3. GLASS RX TABLE ---
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("Glass Prescription", 14, currentY);
  currentY += 4;

  autoTable(doc, {
    startY: currentY,
    head: [['Eye', 'Dist Sph', 'Dist Cyl', 'Dist Axis', 'Dist Vision', 'Near Add', 'Near Vision']],
    body: [
      ['OD', data.glassRx?.od?.distSph, data.glassRx?.od?.distCyl, data.glassRx?.od?.distAxis, data.glassRx?.od?.distVis, data.glassRx?.od?.nearAdd, data.glassRx?.od?.nearVis],
      ['OS', data.glassRx?.os?.distSph, data.glassRx?.os?.distCyl, data.glassRx?.os?.distAxis, data.glassRx?.os?.distVis, data.glassRx?.os?.nearAdd, data.glassRx?.os?.nearVis]
    ],
    theme: 'grid',
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0] },
    styles: { fontSize: 9, cellPadding: 2, halign: 'center', lineColor: [0, 0, 0] },
    didParseCell: (data) => { if (data.section === 'body') data.cell.styles.fontStyle = 'bold'; }
  });
  
  currentY = doc.lastAutoTable.finalY + 10;
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 5;

  // --- 4. IPD TABLE ---
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("IPD", 14, currentY);
  currentY += 4;
  autoTable(doc, {
    startY: currentY,
    head: [['Measurement', 'OD (mm)', 'OS (mm)']],
    body: [['IPD', data.glassRx?.od?.ipd || '-', data.glassRx?.os?.ipd || '-']],
    theme: 'grid',
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0] },
    styles: { fontSize: 9, cellPadding: 2, halign: 'center', lineColor: [0, 0, 0] },
    columnStyles: { 0: { halign: 'left' } },
    didParseCell: (data) => { if (data.section === 'body') data.cell.styles.fontStyle = 'bold'; }
  });
  currentY = doc.lastAutoTable.finalY + 10;
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 5;

  // --- 5. CATEGORIZED SELECTIONS ---
  const renderBox = (title, options, selectedValue, showLine = true) => {
    if (currentY > 250) { doc.addPage(); currentY = 20; }
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    if (title) doc.text(title, 14, currentY);
    currentY += 6;
    doc.setFont(undefined, "normal");
    doc.setFontSize(9);
    let x = 14;
    options.forEach((opt) => {
      doc.setDrawColor(0, 0, 0);
      doc.circle(x + 2, currentY - 2, 2, "S");
      if (selectedValue === opt) {
        doc.setLineWidth(0.5);
        doc.line(x + 1.2, currentY - 2.0, x + 2.0, currentY - 1.0);
        doc.line(x + 2.0, currentY - 1.0, x + 3.5, currentY - 3.5);
      }
      doc.text(opt, x + 6, currentY - 1);
      x += doc.getTextWidth(opt) + 15;
      if (x > 170) { x = 14; currentY += 7; }
    });
    currentY += 10;
    if (showLine) { doc.line(14, currentY, pageWidth - 14, currentY); currentY += 5; }
  };

  renderBox("Lens Type:", ['Single Vision', 'Progressive', 'KT Bifocal', 'Protective', 'Coolens'], data.frameDetails?.lensType, true);
  renderBox("Coating:", ['AR', 'Hard Multicoat', 'Blue light Filters', 'Photochromic', 'Hydrophobic', 'UV Block', 'Anti Scratch'], data.frameDetails?.coating, true);
  renderBox("Glass Usage:", ['Regular Use', 'Near Work only', 'Outdoor activity', 'Occasional Wear', 'Aesthetic Wear'], data.frameDetails?.usage, false);

  // --- 8. FOOTER ---
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text("Optometrist Signature", 168, currentY + 20, { align: "center" });
  currentY += 20; 
  doc.setFontSize(8);
  doc.setFont(undefined, 'italic');
  doc.text(`*This Prescription is valid till ${new Date(new Date().setMonth(new Date().getMonth() + 12)).toLocaleDateString('en-GB')}.`, 14, currentY);

  doc.autoPrint();
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = doc.output('bloburl');
  document.body.appendChild(iframe);
  iframe.onload = () => { setTimeout(() => { iframe.contentWindow.print(); setTimeout(() => document.body.removeChild(iframe), 1000); }, 500); };
};