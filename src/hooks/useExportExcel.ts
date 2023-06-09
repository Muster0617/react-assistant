import ExportJsonExcel from 'js-export-excel';
import { message } from 'antd';

export default (props: any) => {
  return () => {
    const { columns = [], data = [], fileName = '默认' } = props;
    const option: any = {
      fileName,
      datas: [
        {
          sheetData: data, //导出的数据
          sheetName: fileName, //sheet页名字
          sheetFilter: columns?.map((item: any) => item?.dataIndex),
          sheetHeader: columns?.map((item: any) => item?.title), //表格头部的标题
          columnWidths: columns?.map(() => 10),
        },
      ],
    };
    const toExcel = new ExportJsonExcel(option);
    message.success('导出成功');
    toExcel.saveExcel();
  };
};
