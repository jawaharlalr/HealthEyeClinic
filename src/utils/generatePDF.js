import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



export const generateBillPDF = async (billData, shouldPrint = false) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // --- HELPERS (Defined inside scope to fix ESLint errors) ---
  const n = (val) => (val && val.toString().trim() !== '') ? val : 'Nil';
  
  const fmt = (val, text) => {
    if (!val || val === 'Normal' || val === 'Clear') return n(text) === 'Nil' ? val : `${val} (${text})`;
    return text ? `${val} - ${text}` : val;
  };

  let tableCount = 1;
  const themeColor = [0, 150, 136]; // Teal/Cyan matching your logo

  // --- 1. HEADER WITH LOGO ---
  try {
      doc.addImage('/logo.png', 'PNG', 14, 10, 25, 18); 
  } catch (e) {
      console.warn("Logo not found at public/logo.png");
  }

  doc.setFontSize(28);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.text("Healthy Eye Clinic & Opticals", 110, 20, { align: "center" }); 
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("PATIENT MEDICAL REPORT", 110, 28, { align: "center" });
  doc.setLineWidth(0.8);
  doc.setDrawColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.line(14, 35, 196, 35); 

  // --- 2. DOCTOR & MR ---
  doc.setFontSize(11);
  doc.text(["Optometrist,", "Nandhini K"], 14, 40);
  
  const patient = billData.patient || {};
  const pMR = billData.mrNo || patient.mrNo || 'N/A';
  doc.setFont(undefined, 'bold');
  doc.setFontSize(13);
  doc.text(`MR No: ${pMR}`, 14, 52);

  // --- 3. SLIM PATIENT DETAILS ---
  let currentY = 58;
  const pName = billData.patientName || patient.name || 'Unknown';
  const dateObj = billData.createdAt?.toDate ? billData.createdAt.toDate() : new Date();
  const reportDate = dateObj.toLocaleDateString('en-GB');

  doc.setFontSize(10);
  const col1 = 14, col1Val = 35, col2 = 115, col2Val = 135;

  doc.setFont(undefined, 'bold'); doc.text("Patient:", col1, currentY); 
  doc.setFont(undefined, 'normal'); doc.text(n(pName).toUpperCase(), col1Val, currentY);
  doc.setFont(undefined, 'bold'); doc.text("Date:", col2, currentY); 
  doc.setFont(undefined, 'normal'); doc.text(reportDate, col2Val, currentY);

  currentY += 6;
  doc.setFont(undefined, 'bold'); doc.text("Age/Sex:", col1, currentY); 
  doc.setFont(undefined, 'normal'); doc.text(`${n(patient.age)}Y / ${n(patient.gender)}`, col1Val, currentY);
  doc.setFont(undefined, 'bold'); doc.text("Phone:", col2, currentY); 
  doc.setFont(undefined, 'normal'); doc.text(n(patient.phone), col2Val, currentY);

  currentY += 6;
  doc.setFont(undefined, 'bold'); doc.text("Purpose:", col1, currentY); 
  doc.text(n(billData.purposeOfVisit), col1Val, currentY);

  currentY += 6;
  doc.setFont(undefined, 'bold'); doc.text("Address:", col1, currentY); 
  doc.setFont(undefined, 'normal'); 
  const addressLines = doc.splitTextToSize(n(patient.address), 160);
  doc.text(addressLines, col1Val, currentY);
  
  currentY += (addressLines.length * 5); 
  doc.setLineWidth(0.4);
  doc.line(14, currentY, 196, currentY); 
  currentY += 12;

  // --- 4. TABLE DRAWING ENGINE ---
  const drawTable = (title, head, body) => {
    if (currentY > 240) { doc.addPage(); currentY = 20; }
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
    doc.text(`${tableCount}. ${title}`, 14, currentY);
    tableCount++;

    autoTable(doc, {
      startY: currentY + 4, 
      head: [['S.No', ...head]], 
      body: body.map((row, i) => [i + 1, ...row.map(v => n(v))]),
      theme: 'grid',
      headStyles: { fillColor: themeColor, textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 2, textColor: [0, 0, 0], minCellHeight: 8 },
      margin: { left: 14, right: 14 },
      columnStyles: { 0: { cellWidth: 12, halign: 'center', fontSize: 8 } }
    });
    currentY = doc.lastAutoTable.finalY + 12; 
  };

  // --- 6. CLINICAL SECTIONS ---
  drawTable("Chief Complaints", ['Eye', 'Complaint', 'Duration', 'Progression', 'Association', 'Remarks'], (billData.generalData || [{}]).map(r => [r.eye, r.complaint, r.duration, r.progression, r.association, r.remarks]));
  drawTable("Ocular History", ['Eye', 'Condition', 'Duration', 'Investigation'], (billData.ocularHistory || [{}]).map(r => [r.eye, r.condition, r.duration, r.investigation]));
  drawTable("Health Conditions", ['Condition', 'Duration', 'Investigation'], (billData.healthConditions || [{}]).map(r => [r.condition, r.duration, r.investigation]));
  drawTable("Medications & Birth History", ['Section', 'Details', 'Allergies/Notes'], [['Current Meds', (billData.medications || []).map(m => m.medication).join(', '), ''], ['Birth History', billData.birthHistory?.[0]?.birthHistory, billData.birthHistory?.[0]?.allergies]]);
  drawTable("Previous Glass Prescription (PGP)", ['Date', 'Eye', 'Sph', 'Cyl', 'Axis', 'Add', 'Prism', 'Lens', 'Status'], (billData.previousGlass || [{}]).map(r => [r.date, r.eye, r.sph, r.cyl, r.axis, r.add, r.prism ? `${r.prism} ${r.base || ''}` : '', r.lens, r.status]));
  drawTable("Visual Acuity", ['Eye', 'Without Glass', 'With Glass', 'With PH', 'Near Vision', 'Contact Lens'], (billData.visualAcuity || [{}]).map(r => [r.eye, r.withoutGlass, r.withGlass, r.withPh, r.nearVision, r.contactLens]));
  drawTable("Objective Refraction", ['Eye', 'Retinoscopy', 'D.Sph', 'D.Cyl', 'Axis'], (billData.refraction || [{}]).map(r => [r.eye, r.retinoscopy, r.dsph, r.dcyl, r.axis]));
  drawTable("Subjective Acceptance", ['Eye', 'Sph', 'Cyl', 'Axis', 'Dist Vision', 'Add', 'Near Vision'], (billData.acceptance || [{}]).map(r => [r.eye, r.sph, r.cyl, r.axis, r.distVision, r.add, r.nearVision]));
  drawTable("Final Glass Prescription", ['Eye', 'Sph', 'Cyl', 'Axis', 'Dist Vision', 'Add', 'Near Vision'], (billData.glassPrescription || [{}]).map(r => [r.eye, r.sph, r.cyl, r.axis, r.distVision, r.add, r.nearVision]));
  // 1. Hirschberg Test Table
drawTable(
  "Hirschberg Test", 
  ['Hirschberg Details'], 
  (billData.coverTest || []).map(r => [r.hirschberg || '-'])
);

// 2. Cover Test Table
drawTable(
  "Cover Test", 
  ['Distance', 'Near'], 
  (billData.coverTest || []).map(r => [r.ctDistance || '-', r.ctNear || '-'])
);
  drawTable("Extraocular Movements (EOM)", ['OD (Right Eye)', 'OS (Left Eye)'], (billData.ocularMovement || [{}]).map(r => [r.od, r.os]));
  drawTable("Pupil Examination", ['Eye', 'Size', 'Shape', 'Reaction to Light', 'Reaction to Near', 'RAPD'], (billData.pupil || [{}]).map(r => [r.eye, r.size, r.shape, r.light, r.near, r.rapd]));

  const c = billData.corneaAnteriorChamber || {};
  drawTable("Slit Lamp Findings", ['Structure', 'Right Eye (OD)', 'Left Eye (OS)'], [
    ['Sclera', fmt(c.scleraOd, c.scleraOdText), fmt(c.scleraOs, c.scleraOsText)],
    ['Cornea', fmt(c.corneaOd, c.corneaOdText), fmt(c.corneaOs, c.corneaOsText)],
    ['AC Depth', fmt(c.acDepthOd, c.acDepthOdText), fmt(c.acDepthOs, c.acDepthOsText)],
    ['Iris', fmt(billData.irisLens?.irisOd, billData.irisLens?.irisOdText), fmt(billData.irisLens?.irisOs, billData.irisLens?.irisOsText)],
    ['Lens', fmt(billData.irisLens?.lensOd, billData.irisLens?.lensOdText), fmt(billData.irisLens?.lensOs, billData.irisLens?.lensOsText)]
  ]);

  // 1. IOP (Tonometry) Table
drawTable("Intraocular Pressure", ['Test Name', 'Right Eye (OD)', 'Left Eye (OS)', 'Time'], [
  ['Applanation Tonometry', billData.iop?.iopOd, billData.iop?.iopOs, billData.iop?.iopTime]
]);

// 2. Color Vision Table
drawTable("Color Vision", ['Test Name', 'Right Eye (OD)', 'Left Eye (OS)'], [
  ['Ishihara Test', billData.colourDryEye?.ishiharaOd, billData.colourDryEye?.ishiharaOs]
]);

// 3. Lacrimal Test Table
drawTable("Lacrimal Test", ['Test Name', 'Right Eye (OD)', 'Left Eye (OS)'], [
  ['ROPLAS', billData.lacrimalWorkup?.roplasOd, billData.lacrimalWorkup?.roplasOs]
]);

drawTable("Dry Eye Workup", ['Test', 'Right Eye (OD)', 'Left Eye (OS)'], [
  ['TBUT', billData.colourDryEye?.tbutOd, billData.colourDryEye?.tbutOs],
  ['Schirmer\'s Test', billData.colourDryEye?.schirmerOd, billData.colourDryEye?.schirmerOs]
]);

// Added Impressions Section
// Added Impressions Section
doc.setFontSize(12);
doc.setFont(undefined, 'bold');
doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
// Removed `${tableCount}. ` to stop the numbering
doc.text("Impressions", 14, currentY); 

doc.setFontSize(10);
doc.setFont(undefined, 'normal');
doc.setTextColor(0, 0, 0);

// Draws the impression text
const impressionText = billData.impressions || '';
const impressionLines = doc.splitTextToSize(impressionText, 180);
doc.text(impressionLines, 14, currentY + 8);

// Update currentY for any potential sections added after this
currentY += (impressionLines.length * 6) + 10;



  // --- 7. FOOTER & PAGE NUMBERS ---
  // Apply page numbers to all pages generated by autoTable and custom content
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Page ${i} of ${pageCount}`, 105, 275, { align: 'center' });
  }

  // --- 8. PRINT OR DOWNLOAD ---
  if (shouldPrint) {
    doc.autoPrint();
    const blobURL = doc.output('bloburl');
    
    // Create a hidden iframe to handle the print dialog reliably
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobURL;
    document.body.appendChild(iframe);
    
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.print();
        // Optional: Clean up the iframe after a short delay
        setTimeout(() => document.body.removeChild(iframe), 1000);
      }, 500); 
    };
  } else {
    // Standard download
    doc.save(`Report_${billData.mrNo || 'Record'}.pdf`);
  }
}