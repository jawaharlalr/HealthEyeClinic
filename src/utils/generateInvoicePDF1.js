import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = async (invoiceData, shouldPrint = false) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210; 
  
  // --- 1. HEADER & LOGO ---
  try {
    const img = new Image();
    img.src = '/logo.png';
    doc.addImage(img, 'PNG', 14, 10, 20, 12);
  } catch (e) {
    console.warn("Logo skipped");
  }

  let currentY = 15;
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text("Healthy Eye Clinic & Opticals", pageWidth / 2, currentY, { align: "center" });
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  currentY += 6;
  doc.text("12A, Surya Nagar, MGR Nagar, Medavakkam, Chennai, Tamil Nadu 600100", pageWidth / 2, currentY, { align: "center" });
  currentY += 4;
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 10;

  currentY += 5;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text("INVOICE", pageWidth / 2, currentY, { align: "center" });
  currentY += 5;

  // --- 2. PATIENT DETAILS ---
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text("Patient Details:", 14, currentY);
  
  doc.setFont(undefined, 'normal');
  const pName = invoiceData.patientName || invoiceData.name || 'N/A';
  
  // Row 1
  doc.text(`Name: ${pName}`, 14, currentY + 6);
  doc.text(`Phone: ${invoiceData.phone || 'N/A'}`, 110, currentY + 6);
  
  // Row 2
  doc.text(`MR No: ${invoiceData.mrNo || 'N/A'}`, 14, currentY + 11);
  // Add Date here
  const formattedDate = new Date().toLocaleDateString('en-GB');
  doc.text(`Date: ${formattedDate}`, 110, currentY + 11);
  
  // Row 3 (Address in two lines)
  doc.text(`Age/Gender: ${invoiceData.age || 'N/A'} / ${invoiceData.gender || 'N/A'}`, 14, currentY + 16);
  doc.text("Address:", 110, currentY + 16);
  const addressLines = doc.splitTextToSize(invoiceData.address || 'N/A', 80);
  doc.text(addressLines, 110, currentY + 19);
  
  currentY += 30;

  // --- 3. TABLE DRAWING ENGINE ---
  const drawItems = (title, columns, data) => {
    if (!data || data.length === 0) return;
    autoTable(doc, {
      startY: currentY,
      head: [[title, ...columns.slice(1)]],
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [50, 50, 50], fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 2 },
      margin: { left: 14, right: 14 }
    });
    currentY = doc.lastAutoTable.finalY + 5;
  };

  drawItems("Frame", ["Material", "Type", "Size", "Price"], (invoiceData.frames || []).map(f => [f.material, f.type, f.size, `Rs. ${f.price}`]));
  drawItems("Lens", ["Material", "Type", "Price"], (invoiceData.lenses || []).map(l => [l.material, l.type, `Rs. ${l.price}`]));
  drawItems("Coating", ["Type", "Price"], (invoiceData.coatings || []).map(c => [c.type, `Rs. ${c.price}`]));

  // --- 4. TOTALS (Updated) ---
  const rightAlign = pageWidth - 14;
  const fittingCharges = 180;
  
  // Calculate new total (Original total + Fitting Charges - Discount)
  const subTotal = Number(invoiceData.grandTotal || 0);
  const discount = Number(invoiceData.discountAmount || 0);
  const finalTotal = subTotal + fittingCharges - discount;

  doc.setFont(undefined, 'bold');
  let totalY = currentY + 5;

  // 1. Subtotal
  doc.setFontSize(10);
  doc.text(`Subtotal: Rs. ${subTotal.toFixed(2)}`, rightAlign, totalY, { align: 'right' });
  totalY += 5;

  // 2. Fitting Charges
  doc.text(`Fitting Charges: Rs. ${fittingCharges.toFixed(2)}`, rightAlign, totalY, { align: 'right' });
  totalY += 5;

  // 3. Discount (if applicable)
  if (discount > 0) {
      doc.setTextColor(200, 0, 0);
      doc.text(`Discount: - Rs. ${discount.toFixed(2)}`, rightAlign, totalY, { align: 'right' });
      doc.setTextColor(0, 0, 0);
      totalY += 5;
  }
  
  // 4. Grand Total
  doc.setFontSize(12);
  doc.text(`Grand Total: Rs. ${finalTotal.toFixed(2)}`, rightAlign, totalY, { align: 'right' });

  // --- 5. DYNAMIC SIGNATURE ---
  const signatureY = totalY + 30; 
  doc.setFontSize(8);
  doc.text("__________________________", 14, signatureY);
  doc.text("Signature of Optometrist", 14, signatureY + 5);

  // --- 6. PRINT LOGIC ---
  if (shouldPrint) {
    doc.autoPrint();
    const blobURL = doc.output('bloburl');
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobURL;
    document.body.appendChild(iframe);
    
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.print();
      }, 500); 
    };
  } else {
    doc.save(`Invoice_${invoiceData.mrNo || 'Record'}.pdf`);
  }
};