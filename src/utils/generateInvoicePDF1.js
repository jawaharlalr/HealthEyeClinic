import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (invoiceData) => {
  const doc = new jsPDF();
  let tableCount = 1;

  // --- 1. HEADER ---
  doc.setFontSize(26);
  doc.setFont(undefined, 'bold');
  doc.text("Healthy Eye Clinic", 105, 20, { align: "center" }); 
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text("12A, Surya Nagar, MGR Nagar, Medavakkam, Chennai, Tamil Nadu 600100", 105, 26, { align: "center" });
  doc.setLineWidth(0.6);
  doc.line(14, 32, 196, 32); 

  // --- 2. PATIENT DETAILS ---
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text("Patient Details:", 14, 42);
  
  doc.setFont(undefined, 'normal');
  doc.text(`MR No: ${invoiceData.mrNo || 'N/A'}`, 14, 48);
  doc.text(`Name: ${invoiceData.patientName || 'N/A'}`, 14, 54);
  doc.text(`Gender: ${invoiceData.gender || 'N/A'}`, 14, 60);
  
  doc.text(`Phone: ${invoiceData.phone || 'N/A'}`, 100, 48);
  doc.text(`DOB: ${invoiceData.dob || 'N/A'}`, 100, 54);
  doc.text(`Address: ${invoiceData.address || 'N/A'}`, 100, 60);
  
  let currentY = 68;
  doc.setLineWidth(0.4);
  doc.line(14, currentY, 196, currentY); 
  currentY += 10;

  // --- 3. TABLE DRAWING ENGINE ---
  const drawItems = (title, columns, data) => {
    if (!data || data.length === 0) return;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`${tableCount}. ${title}`, 14, currentY);
    tableCount++;

    autoTable(doc, {
      startY: currentY + 4,
      head: [columns],
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontSize: 9 },
      styles: { fontSize: 9, cellPadding: 2 },
      margin: { left: 14, right: 14 }
    });
    currentY = doc.lastAutoTable.finalY + 12;
  };

  drawItems("Frames", ["Material", "Type", "Size", "Price (Rs.)"], 
    (invoiceData.frames || []).filter(f => f.material).map(f => [f.material, f.type, f.size, `Rs. ${f.price}`]));

  drawItems("Lenses", ["Material", "Type", "Price (Rs.)"], 
    (invoiceData.lenses || []).filter(l => l.material).map(l => [l.material, l.type, `Rs. ${l.price}`]));

  drawItems("Coatings", ["Type", "Price (Rs.)"], 
    (invoiceData.coatings || []).filter(c => c.type).map(c => [c.type, `Rs. ${c.price}`]));

  // --- 4. TOTALS SECTION (With fixed spacing to prevent overlap) ---
 // --- 4. TOTALS SECTION ---
  if (currentY > 230) { doc.addPage(); currentY = 20; }
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0, 0, 0); // Black for standard text
  
  // Subtotal
  doc.text(`Subtotal:`, 140, currentY);
  doc.text(`Rs. ${invoiceData.subTotal?.toFixed(2) || '0.00'}`, 190, currentY, { align: 'right' });
  
  // Increment currentY for the next line
  currentY += 8; 
  
  // Fitting Charges
  doc.text(`Fitting Charges:`, 140, currentY);
  doc.text(`Rs. 200.00`, 190, currentY, { align: 'right' });
  
  // Increment currentY for the next line
  currentY += 8;
  
  // Discount
  const discountVal = Number(invoiceData.discount) || 0;
  if (discountVal > 0) {
    doc.text(`Discount:`, 140, currentY);
    doc.text(`Rs. ${discountVal.toFixed(2)}`, 190, currentY, { align: 'right' });
    currentY += 8; // Only increment if discount was rendered
  }
  
  // Grand Total
  currentY += 4; // Add extra space before final total
  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 128, 0); // Green color
  
  doc.text(`Grand Total:`, 135, currentY);
  doc.text(`Rs. ${invoiceData.grandTotal?.toFixed(2) || '0.00'}`, 190, currentY, { align: 'right' });
  
  doc.setTextColor(0, 0, 0); // Reset to black

  // --- 5. FOOTER ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
  }

  doc.save(`Invoice_${invoiceData.mrNo}.pdf`);
};