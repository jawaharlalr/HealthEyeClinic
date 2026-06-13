import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const generatePrescriptionPDF = async (rxData) => {
  // 1. Fetch full patient details from 'patients' collection using MR No
  const q = query(collection(db, "patients"), where("mrNo", "==", rxData.mrNo));
  const snap = await getDocs(q);
  const pData = !snap.empty ? snap.docs[0].data() : {};

  // 2. Prepare combined data (using rxData as the source)
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
  const themeColor = [0, 150, 136]; // Teal/Cyan
  
  // Single declaration of currentY
  let currentY = 15;

  // --- 1. HEADER ---
  try {
    const img = new Image();
    img.src = '/logo.png';
    doc.addImage(img, 'PNG', 14, 10, 20, 12);
  } catch (e) { console.warn("Logo skipped"); }

  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.text("Healthy Eye Clinic & Opticals", pageWidth / 2, currentY, { align: "center" });
  
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');
  currentY += 6;
  doc.text("12A, Surya Nagar, MGR Nagar, Medavakkam, Chennai, Tamil Nadu 600100", pageWidth / 2, currentY, { align: "center" });
  currentY += 4;
  doc.setDrawColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.line(14, currentY, pageWidth - 14, currentY);
  
  currentY += 10;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text("GLASS PRESCRIPTION", pageWidth / 2, currentY, { align: "center" });
  currentY += 5;

  // --- 2. PATIENT DETAILS ---
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text("Patient Details:", 14, currentY);
  
  doc.setFont(undefined, 'normal');
  const formattedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  
  doc.text(`Name: ${data.patientName}`, 14, currentY + 6);
  doc.text(`Phone: ${data.patientPhone}`, 110, currentY + 6);
  doc.text(`MR No: ${data.mrNo || 'N/A'}`, 14, currentY + 11);
  doc.text(`Date: ${formattedDate}`, 110, currentY + 11);
  doc.text(`Age/Gender: ${data.patientAge} / ${data.patientGender}`, 14, currentY + 16);
  
  doc.text("Address:", 110, currentY + 16);
  const addressLines = doc.splitTextToSize(data.patientAddress, 80);
  doc.text(addressLines, 110, currentY + 19);
  
  currentY += 30;

  // --- 3. GLASS RX TABLE ---
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
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
    headStyles: { fillColor: themeColor, fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 2, halign: 'center' }
  });
  
  // Update Y position after the first table
  currentY = doc.lastAutoTable.finalY + 10;

  // --- 4. IPD TABLE ---
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.text("IPD", 14, currentY);
  currentY += 4;

  autoTable(doc, {
    startY: currentY,
    head: [['Measurement', 'OD (mm)', 'OS (mm)']],
    body: [
      ['IPD', data.glassRx?.od?.ipd || ' ', data.glassRx?.os?.ipd || ' ']
    ],
    theme: 'grid',
    headStyles: { fillColor: themeColor, fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 2, halign: 'center' },
    columnStyles: { 0: { halign: 'left' } }
  });

  currentY = doc.lastAutoTable.finalY + 10;

// --- 5. CATEGORIZED SELECTIONS ---
  const renderBox = (title, options, selected = []) => {
    if (currentY > 250) { doc.addPage(); currentY = 20; }

    // Make the sub-labels (Type, Material) Bold
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
    doc.text(title, 14, currentY);
    currentY += 6;

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    
    let x = 14;
    options.forEach(opt => {
      doc.rect(x, currentY - 3.5, 3, 3);
      doc.text(opt, x + 5, currentY);
      x += (opt.length * 2.2) + 12; // Increased spacing slightly
      if (x > 180) { x = 14; currentY += 6; }
    });
    currentY += 10;
  };

  // 1. FRAME SECTION
  doc.setFontSize(12); 
  doc.setFont(undefined, 'bold'); // BOLD HEADER
  doc.setTextColor(0, 0, 0);
  doc.text("Frame:", 14, currentY); currentY += 6;
  renderBox("Type:", ['RimLess', 'Supra', 'Full Frame', 'Shell'], data.frameDetails?.types);
  renderBox("Material:", ['Plastic', 'Metal', 'Fiber', 'Rubber'], data.frameDetails?.materials);
  
  doc.setFontSize(10);
  doc.text(`Colour: _______________      Size: _______________`, 14, currentY);
  currentY += 12;

  // 2. LENS SECTION
  doc.setFontSize(12); 
  doc.setFont(undefined, 'bold'); // BOLD HEADER
  doc.text("Lens:", 14, currentY); currentY += 6;
  renderBox("Type:", ['Single Vision', 'Progressive', 'KT Bifocal', 'Protective', 'Coolens'], data.frameDetails?.lensType);

  // 3. COATING SECTION
  doc.setFontSize(12); 
  doc.setFont(undefined, 'bold'); // BOLD HEADER
  doc.text("Coating:", 14, currentY); currentY += 6;
  renderBox("", ['AR', 'Hard Multicoat', 'Hard Coat', 'Blue light Filters', 'Photochromic', 'Hydrophobic', 'UV Block', 'Anti Scratch'], data.frameDetails?.coating);

  // 4. USAGE SECTION
  doc.setFontSize(12); 
  doc.setFont(undefined, 'bold'); // BOLD HEADER
  doc.text("Glass Usage:", 14, currentY); currentY += 6;
  renderBox("", ['Regular Use', 'Near Work only', 'Outdoor activity', 'Occasional Wear', 'Aesthetic Wear'], data.frameDetails?.usage);

  // --- 7. FOOTER: SIGNATURE & DISCLAIMER ---
  
  // Signature Line - Reduced currentY increment to move it up
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  // Adjusted Y position to keep the text inside the signature line
  doc.text("Optometrist Signature", 168, currentY + 10, { align: "center" });

  // Validity Disclaimer (Calculated Date)
  currentY += 10; 
  
  // Logic to calculate 6 months from today
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + 12);
  const formattedExpiry = expiryDate.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  doc.setFontSize(8);
  doc.setFont(undefined, 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text(
    `*This Prescription is valid till ${formattedExpiry}.`, 
    14, 
    currentY
  );
  
  // Note: If you want the text itself to be visually slanted:
  // You can use the 'angle' property in the doc.text function
  // doc.text("*This Prescription is valid only for 6 months.", 14, currentY, { angle: 5 });
  
  /// --- 8. AUTO-PRINT TRIGGER ---
  doc.autoPrint();
  const blobURL = doc.output('bloburl');
  
  // Create a hidden iframe to trigger the browser's print dialog automatically
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = blobURL;
  document.body.appendChild(iframe);
  
  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow.print();
      // Optional: Cleanup
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 500);
  };
};