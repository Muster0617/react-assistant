import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './NotoSansCJKjp-Regular-normal';

export default ({
  dataSource = [],
  columns = [],
  title = 'Title',
  fileName = '默认文件名',
}: any) => {
  return () => {
    const head = [columns?.map((column) => column.title)];
    const body = dataSource?.reduce((pre, cur, index) => {
      const dataMap = [];
      for (const column of columns) {
        dataMap.push(cur?.[column?.dataIndex] || '-');
      }
      pre.push(dataMap);
      return pre;
    }, []);
    jsPDF.autoTableSetDefaults({
      headStyles: { fillColor: [39, 38, 48] },
    });
    console.log(body, 'body');
    console.log(head, 'head');

    const doc = new jsPDF();
    doc.setFont('NotoSansCJKjp-Regular');
    doc.text(`${title}`, 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Total assets : ${dataSource?.length || 0}`, 14, 28);

    autoTable(doc, {
      startY: 32,
      head: head,
      body: body,
      styles: {
        font: 'NotoSansCJKjp-Regular',
      },
    });
    doc.save(`${fileName}.pdf`);
  };
};
