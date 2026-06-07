import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { db } from '../firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

export const generateBillPDF = async (billData) => {
  const doc = new jsPDF();
  let tableCount = 1;
  
  // Helpers
  const n = (val) => (val && val.toString().trim() !== '') ? val : 'Nil';
  
  const fmt = (val, text) => {
    if (!val || val === 'Normal' || val === 'Clear') return n(text) === 'Nil' ? val : `${val} (${text})`;
    return text ? `${val} - ${text}` : val;
  };

  // --- 1. HEADER (Centered) ---
  doc.setFontSize(28);
  doc.setFont(undefined, 'bold');
  doc.text("Healthy Eye Clinic", 105, 20, { align: "center" }); 
  
  doc.setFontSize(14);
  doc.text("PATIENT MEDICAL REPORT", 105, 28, { align: "center" });
  doc.setLineWidth(0.8);
  doc.line(14, 32, 196, 32); 

  // --- 2. DOCTOR & MR ---
  doc.setFontSize(11);
  doc.text(["Consulting Optometrist,", "Nandhini K"], 14, 40);
  
  const patient = billData.patient || {};
  const pMR = billData.mrNo || patient.mrNo || 'N/A';
  doc.setFont(undefined, 'bold');
  doc.setFontSize(13);
  doc.text(`MR No: ${pMR}`, 14, 52);

  // --- 3. SLIM PATIENT DETAILS ---
  let currentY = 58;
  const pName = billData.patientName || patient.name || 'Unknown';
  
  // Format Date to DD/MM/YYYY
  const dateObj = billData.createdAt?.toDate ? billData.createdAt.toDate() : new Date();
  const reportDate = dateObj.toLocaleDateString('en-GB'); // This gives DD/MM/YYYY

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

  // --- NEW: ADDED ADDRESS FIELD ---
  currentY += 6;
  doc.setFont(undefined, 'bold'); doc.text("Address:", col1, currentY); 
  doc.setFont(undefined, 'normal'); 
  // Use a splitTextToSize to handle long addresses so they don't run off the page
  const addressLines = doc.splitTextToSize(n(patient.address), 160);
  doc.text(addressLines, col1Val, currentY);
  
  // Adjust currentY based on how many lines the address took
  currentY += (addressLines.length * 5); 

  // Draw separator line
  doc.setLineWidth(0.4);
  doc.line(14, currentY, 196, currentY); 
  currentY += 12;

  // --- 4. IMPROVED TABLE DRAWING ENGINE ---
  const drawTable = (title, head, body) => {
    if (currentY > 240) { doc.addPage(); currentY = 20; }
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`${tableCount}. ${title}`, 14, currentY);
    tableCount++;

    autoTable(doc, {
      startY: currentY + 4, 
      head: [['S.No', ...head]], 
      body: body.map((row, i) => [i + 1, ...row.map(v => n(v))]),
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold', halign: 'left' },
      styles: { fontSize: 9, cellPadding: 2, textColor: [0, 0, 0], minCellHeight: 8 },
      margin: { left: 14, right: 14 },
      columnStyles: { 
        0: { cellWidth: 12, halign: 'center', fontSize: 8 } 
      },
      didParseCell: function (data) {
        if (data.column.index === 0) {
          data.cell.styles.fontStyle = 'normal';
        }
      }
    });
    currentY = doc.lastAutoTable.finalY + 12; 
  };

  // --- 5. VISIT HISTORY (EXCLUDING CURRENT REPORT) ---
  if (pMR !== 'N/A') {
    try {
      const q = query(collection(db, "bills"), where("mrNo", "==", pMR));
      const querySnapshot = await getDocs(q);
      
      const unsortedLogs = [];
      querySnapshot.forEach((docSnap) => {
        // Skip adding the current bill to the 'previous visits' log
        if (docSnap.id === billData.id) return; 

        const data = docSnap.data();
        unsortedLogs.push({
          dateObj: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(0),
          purpose: data.purposeOfVisit || 'N/A'
        });
      });

      // Sort by newest date first
      unsortedLogs.sort((a, b) => b.dateObj - a.dateObj);

      const visitLogs = unsortedLogs.map(log => [
        log.dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }), 
        log.purpose
      ]);

      if (visitLogs.length > 0) {
        drawTable("Previous Visits", ['Date', 'Purpose of Visit'], visitLogs);
      }
    } catch (error) {
      console.error("Error fetching visit logs for PDF:", error);
    }
  }

  // --- 6. CLINICAL SECTIONS ---
  drawTable("Chief Complaints", ['Eye', 'Complaint', 'Duration', 'Progression', 'Association', 'Remarks'], 
    (billData.generalData || [{}]).map(r => [r.eye, r.complaint, r.duration, r.progression, r.association, r.remarks]));

  drawTable("Ocular History", ['Eye', 'Condition', 'Duration', 'Investigation'], 
    (billData.ocularHistory || [{}]).map(r => [r.eye, r.condition, r.duration, r.investigation]));

  drawTable("Health Conditions", ['Condition', 'Duration', 'Investigation'], 
    (billData.healthConditions || [{}]).map(r => [r.condition, r.duration, r.investigation]));

  drawTable("Medications & Birth History", ['Section', 'Details', 'Allergies/Notes'], [
    ['Current Meds', (billData.medications || []).map(m => m.medication).join(', '), ''],
    ['Birth History', billData.birthHistory?.[0]?.birthHistory, billData.birthHistory?.[0]?.allergies]
  ]);

  drawTable("Previous Glass Prescription (PGP)", ['Date', 'Eye', 'Sph', 'Cyl', 'Axis', 'Add', 'Prism', 'Lens', 'Status'], 
    (billData.previousGlass || [{}]).map(r => [r.date, r.eye, r.sph, r.cyl, r.axis, r.add, r.prism ? `${r.prism} ${r.base || ''}` : '', r.lens, r.status]));

  drawTable("Visual Acuity", ['Eye', 'Without Glass', 'With Glass', 'With PH', 'Near Vision', 'Contact Lens'], 
    (billData.visualAcuity || [{}]).map(r => [r.eye, r.withoutGlass, r.withGlass, r.withPh, r.nearVision, r.contactLens]));

  drawTable("Objective Refraction", ['Eye', 'Retinoscopy', 'D.Sph', 'D.Cyl', 'Axis'], 
    (billData.refraction || [{}]).map(r => [r.eye, r.retinoscopy, r.dsph, r.dcyl, r.axis]));

  drawTable("Subjective Acceptance", ['Eye', 'Sph', 'Cyl', 'Axis', 'Dist Vision', 'Add', 'Near Vision'], 
    (billData.acceptance || [{}]).map(r => [r.eye, r.sph, r.cyl, r.axis, r.distVision, r.add, r.nearVision]));

  drawTable("Final Glass Prescription", ['Eye', 'Sph', 'Cyl', 'Axis', 'Dist Vision', 'Add', 'Near Vision'], 
    (billData.glassPrescription || [{}]).map(r => [r.eye, r.sph, r.cyl, r.axis, r.distVision, r.add, r.nearVision]));

  // --- SEPARATED BINOCULAR TESTS ARRAY DATA MAPPING ---
  drawTable("Cover Test Assessment", ['Hirschberg', 'Cover Test Distance', 'Cover Test Near'], 
    (billData.coverTest || [{}]).map(r => [r.hirschberg, r.ctDistance, r.ctNear]));

  drawTable("Extraocular Movements (EOM)", ['OD (Right Eye)', 'OS (Left Eye)'], 
    (billData.ocularMovement || [{}]).map(r => [r.od, r.os]));

  // --- SEPARATED PUPIL EXAMINATION ARRAY DATA MAPPING ---
  drawTable("Pupil Examination", ['Eye', 'Size', 'Shape', 'Reaction to Light', 'Reaction to Near', 'RAPD'], 
    (billData.pupil || [{}]).map(r => [r.eye, r.size, r.shape, r.light, r.near, r.rapd]));

  // --- ANTERIOR SEGMENT ---
  const c = billData.corneaAnteriorChamber || {};
  drawTable("Slit Lamp Findings", ['Structure', 'Right Eye (OD)', 'Left Eye (OS)'], [
    ['Sclera', fmt(c.scleraOd, c.scleraOdText), fmt(c.scleraOs, c.scleraOsText)],
    ['Cornea', fmt(c.corneaOd, c.corneaOdText), fmt(c.corneaOs, c.corneaOsText)],
    ['AC Depth', fmt(c.acDepthOd, c.acDepthOdText), fmt(c.acDepthOs, c.acDepthOsText)],
    ['Iris', fmt(billData.irisLens?.irisOd, billData.irisLens?.irisOdText), fmt(billData.irisLens?.irisOs, billData.irisLens?.irisOsText)],
    ['Lens', fmt(billData.irisLens?.lensOd, billData.irisLens?.lensOdText), fmt(billData.irisLens?.lensOs, billData.irisLens?.lensOsText)]
  ]);

  // --- POSTERIOR SEGMENT (ADDED FUNDUS) ---
  const f = billData.fundus || {};
  drawTable("Fundus Examination", ['Structure', 'Right Eye (OD)', 'Left Eye (OS)'], [
    ['Retina', f.retinaOd, f.retinaOs],
    ['Macula', f.maculaOd, f.maculaOs],
    ['Disc', f.discOd, f.discOs]
  ]);

  drawTable("IOP & Special Tests", ['Test Name', 'Right Eye (OD)', 'Left Eye (OS)', 'Time'], [
    ['IOP (Tonometry)', billData.iop?.iopOd, billData.iop?.iopOs, billData.iop?.iopTime],
    ['Color Vision', billData.colourDryEye?.ishiharaOd, billData.colourDryEye?.ishiharaOs, ''],
    ['Lacrimal Test', billData.lacrimalWorkup?.roplasOd, billData.lacrimalWorkup?.roplasOs, '']
  ]);

  // --- 7. FOOTER ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
  }

  doc.save(`Report_${pMR}_${pName.replace(/\s+/g, '_')}.pdf`);
};