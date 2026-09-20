function fixArabicText(text) {
    if (!text) return "";
    return text.split('').reverse().join('');
}

async function startPDFGeneration() {
    try {
        const ownerName = document.getElementById('ownerName').value || '';
        const ownerId = document.getElementById('ownerId').value || '';
        const ownerPhone = document.getElementById('ownerPhone').value || '';
        const tenantName = document.getElementById('tenantName').value || '';
        const tenantId = document.getElementById('tenantId').value || '';
        const tenantPhone = document.getElementById('tenantPhone').value || '';
        const buildingNo = document.getElementById('buildingNo').value || '';
        const plotNo = document.getElementById('plotNo').value || '';
        const blockNo = document.getElementById('blockNo').value || '';
        const areaZone = document.getElementById('areaZone').value || '';
        const electricityNo = document.getElementById('electricityNo').value || '';
        const rentalValue = document.getElementById('rentalValue').value || '';

        const existingPdfBytes = await fetch('./template.pdf').then(res => res.arrayBuffer());
        const fontBytes = await fetch('./Amiri-Regular.ttf').then(res => res.arrayBuffer());

        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
        pdfDoc.registerFontkit(fontkit);
        const customFont = await pdfDoc.embedFont(fontBytes);

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        firstPage.drawText(fixArabicText(ownerName), { x: 440, y: 735, size: 10, font: customFont });
        firstPage.drawText(fixArabicText(ownerId), { x: 440, y: 715, size: 10, font: customFont });
        firstPage.drawText(fixArabicText(ownerPhone), { x: 440, y: 695, size: 10, font: customFont });
        
        firstPage.drawText(fixArabicText(tenantName), { x: 440, y: 600, size: 10, font: customFont });
        firstPage.drawText(fixArabicText(tenantId), { x: 440, y: 580, size: 10, font: customFont });
        firstPage.drawText(fixArabicText(tenantPhone), { x: 440, y: 560, size: 10, font: customFont });

        firstPage.drawText(fixArabicText(buildingNo), { x: 220, y: 450, size: 10, font: customFont });
        firstPage.drawText(fixArabicText(plotNo), { x: 220, y: 430, size: 10, font: customFont });
        firstPage.drawText(fixArabicText(blockNo), { x: 220, y: 410, size: 10, font: customFont });
        firstPage.drawText(fixArabicText(areaZone), { x: 220, y: 390, size: 10, font: customFont });
        firstPage.drawText(fixArabicText(electricityNo), { x: 220, y: 370, size: 10, font: customFont });
        
        firstPage.drawText(fixArabicText(rentalValue), { x: 300, y: 250, size: 12, font: customFont });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "عقد_مسقط.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        alert("Error: " + error.message);
    }
}
