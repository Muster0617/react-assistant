import { data } from './constant';
import { Button } from 'antd';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default () => {
  const exportPdfColumns = [
    {
      title: 'Class Code',
      dataIndex: 'class_code',
    },
    {
      title: 'Manufacture',
      dataIndex: 'manufacturer',
    },
    {
      title: 'Model',
      dataIndex: 'model_number',
    },
    {
      title: 'Model Year',
      dataIndex: 'date_of_manufacture',
    },
    {
      title: 'Business Unit',
      dataIndex: 'businessUnit',
    },
    {
      title: 'Unit Number',
      dataIndex: 'unit_number',
    },
  ];

  const handleExport = (dataSource: any[] = [], columns: any[] = []) => {
    const head = [columns?.map((column) => column.title)];
    const body = dataSource?.reduce((pre, cur, index) => {
      const dataMap = [];
      for (const column of columns) {
        dataMap.push(cur?.[column?.dataIndex] || '-');
      }
      pre.push(dataMap);
      return pre;
    }, []);
    console.log(body, 'headers');
    jsPDF.autoTableSetDefaults({
      headStyles: { fillColor: [39, 38, 48] },
    });

    const doc = new jsPDF();
    doc.text('Title', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text('Total assets : 14', 14, 28);

    autoTable(doc, {
      startY: 32,
      head: head,
      body: body,
    });
    doc.save('table.pdf');
  };
  return <Button onClick={() => handleExport(data, exportPdfColumns)}>导出</Button>;
};
