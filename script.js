// استدعاء الملحقات البرمجية والخطوط بشكل آمن وديناميكي لضمان عملها على الهاتف
async function loadExternalLibraries() {
    if (typeof window.PDFLib === 'undefined') {
        await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }
    if (typeof window.fontkit === 'undefined') {
        await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }
}

// دالة برمجية ذكية لمعالجة النصوص العربية حتى لا تظهر مقلوبة أو متقطعة في الـ PDF
function fixArabicText(text) {
    if (!text) return "";
    // عكس النص برمجياً ليتناسب مع آلية الرسم داخل مكتبة PDF-Lib الافتراضية
    return text.split('').reverse().join('');
}

async function startPDFGeneration() {
    try {
        // تحميل المكتبات أولاً
        await loadExternalLibraries();

        // 1. جلب البيانات التي كتبها المستخدم في واجهة الموقع
        const ownerName = document.getElementById('ownerName').value;
        const ownerId = document.getElementById('ownerId').value;
        const ownerPhone = document.getElementById('ownerPhone').value;
        const buildingNo = document.getElementById('buildingNo').value;
        const plotNo = document.getElementById('plotNo').value;
        const electricityNo = document.getElementById('electricityNo').value;
        const rentalValue = document.getElementById('rentalValue').value;

        // 2. قراءة ملف الـ PDF الفارغ والخط العربي من المجلد
        const existingPdfBytes = await fetch('./template.pdf').then(res => {
            if (!res.ok) throw new Error('لم يتم العثور على ملف template.pdf في المجلد');
            return res.arrayBuffer();
        });
        
        const fontBytes = await fetch('./Amiri-Regular.ttf').then(res => {
            if (!res.ok) throw new Error('لم يتم العثور على ملف الخط Amiri-Regular.ttf');
            return res.arrayBuffer();
        });

        // 3. إنشاء وثيقة الـ PDF ودمج الخط العربي بها
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
        pdfDoc.registerFontkit(fontkit);
        const customFont = await pdfDoc.embedFont(fontBytes);

        // جلب الصفحة الأولى من التصميم الخاص بك للكتابة عليها
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // 4. إسقاط النصوص فوق مربعات التصميم (الإحداثيات الافتراضية)
        // ملاحظة: يمكنك تعديل أرقام x و y لاحقاً لتطابق مربعات ملفك بدقة بالبكسل
        
        // طباعة اسم المؤجر
        firstPage.drawText(fixArabicText(ownerName), { x: 450, y: 740, size: 11, font: customFont });
        
        // طباعة الرقم المدني
        firstPage.drawText(fixArabicText(ownerId), { x: 450, y: 720, size: 11, font: customFont });
        
        // طباعة رقم الهاتف
        firstPage.drawText(fixArabicText(ownerPhone), { x: 450, y: 700, size: 11, font: customFont });

        // طباعة رقم المبنى
        firstPage.drawText(fixArabicText(buildingNo), { x: 200, y: 550, size: 11, font: customFont });

        // طباعة رقم القطعة
        firstPage.drawText(fixArabicText(plotNo), { x: 200, y: 530, size: 11, font: customFont });

        // طباعة رقم الكهرباء
        firstPage.drawText(fixArabicText(electricityNo), { x: 200, y: 510, size: 11, font: customFont });

        // طباعة القيمة الإيجارية
        firstPage.drawText(fixArabicText(rentalValue), { x: 300, y: 400, size: 12, font: customFont });

        // 5. حفظ وتوليد الملف النهائي وتحميله فوراً على الهاتف
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "عقد_إيجار_بلدية_مسقط.pdf";
        link.click();

    } catch (error) {
        alert("تنبيه: " + error.message + "\nتأكد من تشغيل الموقع عبر خادم مؤقت أو رفعه على GitHub Pages ليعمل جلب الملفات بنجاح.");
    }
}
