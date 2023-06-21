import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReactDOM from 'react-dom';
import styles from './index.less';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

export default forwardRef((props: any, ref: any) => {
  const [htmlCode, setHtmlCode] = useState('');
  const [showDOM, setShowDOM] = useState(false);
  const domRef = useRef<any>();

  useImperativeHandle(ref, () => ({
    downloadPdf: (html: string, pdfName: string) => {
      setHtmlCode(html);
      setShowDOM(true);
      setTimeout(() => {
        html2canvas(domRef.current, {
          allowTaint: false,
          scale: 2, // 提升画面质量，但是会增加文件大小
          useCORS: true,
          //   foreignObjectRendering: true,
        }).then(function (canvas) {
          /**jspdf将html转为pdf一页显示不截断，整体思路：
           * 1. 获取DOM
           * 2. 将DOM转换为canvas
           * 3. 获取canvas的宽度、高度（稍微大一点）
           * 4. 将pdf的宽高设置为canvas的宽高
           * 5. 将canvas转为图片
           * 6. 实例化jspdf，将内容图片放在pdf中（因为内容宽高和pdf宽高一样，就只需要一页，也防止内容截断问题）
           */

          // 得到canvas画布的单位是px 像素单位
          const contentWidth = canvas.width;
          const contentHeight = canvas.height;

          // 将canvas转为base64图片
          const pageData = canvas.toDataURL('image/jpeg', 1.0);

          // 设置pdf的尺寸，pdf要使用pt单位 已知 1pt/1px = 0.75   pt = (px/scale)* 0.75
          // 2为上面的scale 缩放了2倍
          const pdfX = ((contentWidth + 10) / 2) * 0.75;
          const pdfY = ((contentHeight + 10) / 2) * 0.75; // 500为底部留白

          // 设置内容图片的尺寸，img是pt单位
          const imgX = pdfX;
          const imgY = (contentHeight / 2) * 0.75; //内容图片这里不需要留白的距离

          // 初始化jspdf 第一个参数方向：默认''时为纵向，第二个参数设置pdf内容图片使用的长度单位为pt，第三个参数为PDF的大小，单位是pt
          const PDF = new jsPDF('', 'pt', [pdfX, pdfY]);

          // 将内容图片添加到pdf中，因为内容宽高和pdf宽高一样，就只需要一页，位置就是 0,0
          PDF.addImage(pageData, 'jpeg', 0, 0, imgX, imgY);
          PDF.save(pdfName + '.pdf');
          setShowDOM(false);
        });
      }, 0);
    },
  }));

  return (
    <>
      {showDOM &&
        ReactDOM.createPortal(
          <div
            ref={domRef}
            id="editor_container"
            className={styles.editor_container}
            dangerouslySetInnerHTML={{ __html: htmlCode }}
          />,
          document.body,
        )}
    </>
  );
});
