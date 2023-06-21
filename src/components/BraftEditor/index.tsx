// @ts-nocheck
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css';
import { Upload, message, Space, Button } from 'antd';
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { fileUpload } from './service';
import styles from './index.less';
import HtmlToPdf from './HtmlToPdf';
import useHtmlPreView from '@/hooks/useHtmlPreView';
import OperateBraftEditorImg from './OperateBraftEditorImg.ts';
const OperateImg = new OperateBraftEditorImg();

export default forwardRef((props: any, ref) => {
  const { value = '<p></p>', onChange, readonly } = props;
  const [editorState, setEditorState] = useState(BraftEditor.createEditorState(value));
  const htmlToPdfRef = useRef();
  const editorRef = useRef({});

  useImperativeHandle(ref, () => ({
    ...editorRef?.current,
    removeFormBraftEditorImgSrc: OperateImg.removeFormBraftEditorImgSrc,
    getFormBraftEditorRelativePath: OperateImg.getFormBraftEditorRelativePath,
    setFormBraftEditorImgSrc: OperateImg.setFormBraftEditorImgSrc,
  }));

  useEffect(() => {
    if (editorState.toHTML() !== value) setEditorState(BraftEditor.createEditorState(value));
  }, [value]);

  const uploadHandler = async ({ file = undefined }) => {
    if (!file) {
      return false;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bizPath', '/staff');
    const { success = false, data, errorMsg } = await fileUpload(formData);
    if (success) {
      setEditorState(
        ContentUtils.insertMedias(editorState, [
          {
            type: 'IMAGE',
            url: data?.absolutePath,
            meta: {
              relativePath: data?.relativePath,
            },
          },
        ]),
      );
    } else message.error(errorMsg);
  };

  const downloadPdf = () => {
    htmlToPdfRef?.current?.downloadPdf(editorState.toHTML(), `${new Date().getTime()}`);
  };

  const htmlPreView = useHtmlPreView({
    htmlCode: editorState.toHTML(),
  });

  const extendControls = [
    {
      key: 'custom-button',
      type: 'component',
      text: '预览',
      component: (
        <>
          <button
            type="button"
            className="control-item button"
            data-title="预览"
            onClick={htmlPreView}
          >
            预览
          </button>
        </>
      ),
    },
    {
      key: 'download-button',
      type: 'component',
      text: '下载',
      component: (
        <button
          type="button"
          className="control-item button"
          data-title="下载"
          onClick={downloadPdf}
        >
          下载
        </button>
      ),
    },
    {
      key: 'antd-uploader',
      type: 'component',
      component: (
        <Upload accept=".jpg,.jpeg,.png" showUploadList={false} customRequest={uploadHandler}>
          <button type="button" className="control-item button upload-button" data-title="插入图片">
            插入图片
          </button>
        </Upload>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      {readonly && (
        <div className={styles.readonly_operate}>
          <Space>
            <Button type="primary" onClick={htmlPreView}>
              预览
            </Button>
            <Button type="primary" onClick={downloadPdf}>
              导出PDF
            </Button>
          </Space>
        </div>
      )}
      <BraftEditor
        ref={editorRef}
        className={styles.editor_container}
        value={editorState}
        onChange={(state) => {
          onChange(state.toHTML());
          setEditorState(state);
        }}
        placeholder={`请输入`}
        readOnly={readonly}
        extendControls={extendControls}
        excludeControls={['media', 'code']}
      />
      <HtmlToPdf ref={htmlToPdfRef} />
    </div>
  );
});
