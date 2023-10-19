import * as PDFJS from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const getPage = (pdf, num) => {
  return new Promise((resolve) => {
    pdf.getPage(num).then((page) => {
      const scale = '1.5';
      const viewport = page.getViewport({
        scale: scale,
      });
      const canvas = document.createElement('canvas');
      const canvasContext = canvas.getContext('2d');
      canvas.height = viewport.height || viewport.viewBox[3];
      canvas.width = viewport.width || viewport.viewBox[2];
      page
        .render({
          canvasContext,
          viewport,
        })
        .promise.then(() => {
          // resolve(canvas.toDataURL());
          canvas.toBlob((blob) => resolve(blob));
        });
    });
  });
};

export default (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = function () {
        const typedarray = new Uint8Array(this.result);
        PDFJS.getDocument(typedarray).promise.then(async (pdf) => {
          const pages = [];
          for (let i = 0; i < pdf?._pdfInfo?.numPages; i++) {
            await getPage(pdf, i + 1).then((result) => {
              pages.push(result);
            });
          }
          console.log(pages, 'pages--');
          resolve(
            pages?.map(
              (item, index) =>
                new File([item], `${new Date().getTime()}_${index}.png`, {
                  type: 'image/png',
                }),
            ),
          );
        });
      };
    } catch (error) {
      reject(error);
    }
  });
};
