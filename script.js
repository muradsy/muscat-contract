function fixArabicText(text) {
    if (!text) return "";
    return text.split('').reverse().join('');
}

async function startPDFGeneration() {
    try {
        // 1. جلب البيانات المدخلة من الواجهة
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

        // 2. تحميل ملف التصميم، الخط العربي، وصورتي الشعار والباركود
        const existingPdfBytes = await fetch('./template.pdf').then(res => res.arrayBuffer());
        const fontBytes = await fetch('./Amiri-Regular.ttf').then(res => res.arrayBuffer());
        const logoBytes = await fetch('./logo.png').then(res => res.arrayBuffer());
        const qrBytes = await fetch('./qr.png').then(res => res.arrayBuffer());

        // 3. إعداد وثيقة الـ PDF والخط
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
        pdfDoc.registerFontkit(fontkit);
        const customFont = await pdfDoc.embedFont(fontBytes);

        // 4. دمج وتضمين الصور داخل نظام الـ PDF البرمجي
        const logoImage = await pdfDoc.embedPng(logoBytes);
        const qrImage = await pdfDoc.embedPng(qrBytes);

        const pages = pdfDoc.getPages();
        const firstPage = pages[0]; // تحديد الصفحة الأولى للكتابة والرسم

        // 5. رسم وتحديد مكان صورة الشعار والباركود بدقة بالبكسل (أعلى الصفحة)
        // رسم الشعار في المربع العلوي المخصص له
        firstPage.drawImage(logoImage, {
            x: 250,       // البعد الأفقي من اليسار
            y: 740,       // البعد العمودي من الأسفل للأعلى
            width: 90,    // عرض الصورة بالبكسل
            height: 50    // ارتفاع الصورة بالبكسل
        });

        // رسم الباركود في المنتصف العلوي المخصص له
        firstPage.drawImage(qrImage, {
            x: 370,
            y: 740,
            width: 55,
            height: 55
        });

        // 6. إسقاط الحقول النصية الرسمية فوق التصميم الجاهز
        firstPage.drawText(fixArabicText(ownerName), { x: 440, y: 710, size: 10, font: customFont });
        firstPage.drawText(fixArabicText(ownerId), { x: 440, y: 690, size: 10, font: customFont });
        firstPage.drawText(fixArabicText(ownerPhone), { x: 440, y: 670, size: 10, font: customFont });
        
        firstPage.drawText(fixArabicText(tenantName), { x: 440, y: 580, size: 10, font: customFont });
        firstPage.drawText(fixArabicText(tenantId), { x: 440, y: 560, size: 10, font: customFont });
        firstPage.drawText(fixArabicText(tenantPhone), { x: 440, y: 540, size: 10, font: customFont });

        firstPage.drawText(fixArabicText(buildingNo), { x: 220, y: 430, size: 10, font: customFont });
        firstPage.drawText(fixArabicText(plotNo), { x: 220, y: 410, size: 10, font: customFont });
        firstPage.drawText(fixArabicText(blockNo), { x: 220, y: 390, size: 10, font: customFont });
        firstPage.drawText(fixArabicText(areaZone), { x: 220, y: 370, size: 10, font: customFont });
        firstPage.drawText(fixArabicText(electricityNo), { x: 220, y: 350, size: 10, font: customFont });
        
        firstPage.drawText(fixArabicText(rentalValue), { x: 300, y: 230, size: 12, font: customFont });

        // 7. حفظ وتوليد وتحميل الملف النهائي فوراً على الموبايل
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "استمارة_عقد_مسقط_المكتملة.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        alert("خطأ برميجي: " + error.message);
    }
}
