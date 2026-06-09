import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = async (invoiceData) => {
  const doc = new jsPDF('l', 'mm', 'a4');
  const pageWidth = 297;
  
  // --- 1. HEADER & LOGO ---
  try {
    const img = new Image();
    img.src = '/logo.png';
    doc.addImage(img, 'PNG', 14, 10, 20, 12);
  } catch (e) {
    console.warn("Logo could not be loaded, skipping:", e);
  }

  let currentY = 15;
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text("Healthy Eye Clinic", pageWidth / 2, currentY, { align: "center" });
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  currentY += 6;
  doc.text("12A, Surya Nagar, MGR Nagar, Medavakkam, Chennai, Tamil Nadu 600100", pageWidth / 2, currentY, { align: "center" });
  currentY += 4;
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 10;

  // --- 2. PATIENT DETAILS ---
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text("Patient Details:", 14, currentY);
  
  doc.setFont(undefined, 'normal');
  const pName = invoiceData.patientName || invoiceData.name || 'N/A';
  doc.text(`Name: ${pName}`, 14, currentY + 6);
  doc.text(`MR No: ${invoiceData.mrNo || 'N/A'}`, 14, currentY + 11);
  
  doc.text(`Phone: ${invoiceData.phone || 'N/A'}`, 100, currentY + 6);
  doc.text(`Address: ${invoiceData.address || 'N/A'}`, 100, currentY + 11);
  
  currentY += 20;

  // --- 3. TABLE DRAWING ENGINE ---
  const drawItems = (title, columns, data) => {
    if (!data || data.length === 0) return;
    
    autoTable(doc, {
      startY: currentY,
      head: [[title, ...columns.slice(1)]],
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [50, 50, 50], fontSize: 8, cellPadding: 1 },
      styles: { fontSize: 8, cellPadding: 1 },
      margin: { left: 14, right: 14 }
    });
    currentY = doc.lastAutoTable.finalY + 5;
  };

  drawItems("Frames", ["Material", "Type", "Size", "Price"], 
    (invoiceData.frames || []).map(f => [f.material, f.type, f.size, `Rs. ${f.price}`]));

  drawItems("Lenses", ["Material", "Type", "Price"], 
    (invoiceData.lenses || []).map(l => [l.material, l.type, `Rs. ${l.price}`]));

  drawItems("Coatings", ["Type", "Price"], 
    (invoiceData.coatings || []).map(c => [c.type, `Rs. ${c.price}`]));

  // --- 4. TOTALS & DISCOUNT DETAILS ---
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  const rightAlign = pageWidth - 20;
  
  doc.text(`Subtotal:`, rightAlign - 50, currentY);
  doc.text(`Rs. ${invoiceData.subTotal?.toFixed(2) || '0.00'}`, rightAlign, currentY, { align: 'right' });
  
  currentY += 6;
  doc.text(`Fitting Charges:`, rightAlign - 50, currentY);
  doc.text(`Rs. 200.00`, rightAlign, currentY, { align: 'right' });
  
  // DISCOUNT SECTION
  const discountPerc = invoiceData.discountPercent || 0;
  const discountAmt = invoiceData.discountAmount || 0;
  
  if (discountPerc > 0 || discountAmt > 0) {
    currentY += 6;
    doc.setTextColor(200, 0, 0); // Red color for discount
    doc.text(`Discount ${discountPerc ? `(${discountPerc}%)` : ''}:`, rightAlign - 50, currentY);
    doc.text(`- Rs. ${Number(discountAmt).toFixed(2)}`, rightAlign, currentY, { align: 'right' });
    doc.setTextColor(0, 0, 0); // Reset color
  }
  
  currentY += 10;
  doc.setFontSize(12);
  doc.text(`Grand Total:`, rightAlign - 50, currentY);
  doc.text(`Rs. ${invoiceData.grandTotal?.toFixed(2) || '0.00'}`, rightAlign, currentY, { align: 'right' });

  doc.save(`Invoice_${invoiceData.mrNo}.pdf`);
};