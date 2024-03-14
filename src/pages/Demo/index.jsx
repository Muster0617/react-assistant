import { Card, Tabs } from 'antd';
import EmployLazyLoadTree from './EmployLazyLoadTree';
import EmployBraftEditor from './EmployBraftEditor';
import EmployQRCode from './EmployQRCode';
import EmployImgCropper from './EmployImgCropper';
import EmployDragDrop from './EmployDragDrop';
import EmployMap from './EmployMap';
import { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const num = 1223456.8;
    const handle = (number) => {
      const strNum = String(num)
      let newNum = ''
      const i = strNum.split('.')[0]
      for (let k =i.length-1 ; k>=0 ; k--) {
        newNum = newNum+ i[k]
        if(k%3==0){
          newNum += ','
        }
      }
      // const strNum
      return strNum.indexOf('.') === -1? newNum:newNum+'.'+strNum.split('.')[1]
      
    }
    console.log(handle(num))

  }, []);

  return (
    <Card>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: '高德地图',
            key: '1',
            children: (
              <Card title="高德地图">
                <EmployMap />
              </Card>
            ),
          },
          {
            label: '拖拽排序',
            key: '2',
            children: (
              <Card title="拖拽排序">
                <EmployDragDrop />
              </Card>
            ),
          },
          {
            label: '图片裁切',
            key: '3',
            children: (
              <Card title="图片裁切">
                <EmployImgCropper />
              </Card>
            ),
          },
          {
            label: 'BraftEditor富文本',
            key: '4',
            children: (
              <Card title="BraftEditor富文本">
                <EmployBraftEditor />
              </Card>
            ),
          },
          {
            label: 'Tree组件子节点异步加载和局部刷新',
            key: '5',
            children: (
              <Card title="Tree组件子节点异步加载和局部刷新">
                <EmployLazyLoadTree />
              </Card>
            ),
          },
          {
            label: '可下载和打印的二维码',
            key: '6',
            children: (
              <Card title="可下载和打印的二维码">
                <EmployQRCode value="我就是一个二维码" />
              </Card>
            ),
          },
        ]}
      />
    </Card>
  );
};
