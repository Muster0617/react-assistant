import ExportJsonExcel from 'js-export-excel';
import { message } from 'antd';

export default ({ columns = [], data = [], fileName = '默认' }) => {
  const option = {
    fileName,
    datas: [
      {
        sheetData: data, //导出的数据
        sheetName: fileName, //sheet页名字
        sheetFilter: columns?.map((item) => item?.dataIndex),
        sheetHeader: columns?.map((item) => item?.title), //表格头部的标题
        columnWidths: columns?.map(() => 10),
      },
    ],
  };
  const toExcel = new ExportJsonExcel(option);
  message.success('导出成功');
  toExcel.saveExcel();
};
