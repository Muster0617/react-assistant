import { saveAs } from 'file-saver';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import JSZipUtils from 'jszip-utils';

export default (filePath, wordData, fileName = `${new Date().getTime()}`) => {
  return new Promise((resolve, reject) => {
    try {
      JSZipUtils.getBinaryContent(filePath, function (error, content) {
        console.log(content, 'content--');
        if (error) {
          throw error;
        }
        let zip = new PizZip(content);
        let doc = new Docxtemplater().loadZip(zip).compile();
        doc.resolveData(wordData).then(function () {
          doc.render();
          const out = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          });
          saveAs(out, `${fileName}.docx`);
          resolve();
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};
