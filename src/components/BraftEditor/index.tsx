import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css';
import { Upload } from 'antd';
import { useEffect, useState } from 'react';
import { fileUpload } from './service';
import { preview } from './util';

export default (props) => {
  const { value, onChange, readonly } = props;

  const [editorState, setEditorState] = useState(BraftEditor.createEditorState(value));

  useEffect(() => {
    if (editorState.toHTML() !== value) setEditorState(BraftEditor.createEditorState(value));
  }, [value]);

  const uploadHandler = async ({ file = undefined }) => {
    if (!file) {
      return false;
    }
    let formData = new FormData();
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
    }
  };

  const extendControls = [
    {
      key: 'custom-button',
      type: 'component',
      text: '预览',
      component: (
        <button type="button" className="control-item button" data-title="预览" onClick={preview}>
          预览
        </button>
      ),
    },
    {
      key: 'antd-uploader',
      type: 'component',
      component: (
        <Upload accept="image/*" showUploadList={false} customRequest={uploadHandler}>
          {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
          <button type="button" className="control-item button upload-button" data-title="插入图片">
            插入图片
          </button>
        </Upload>
      ),
    },
  ];

  return (
    <BraftEditor
      className="my-editor"
      value={editorState}
      onChange={(state) => {
        onChange(state.toHTML());
        setEditorState(state);
      }}
      placeholder={`请输入`}
      readOnly={readonly}
      {...(readonly
        ? {
            controls: [],
          }
        : {
            extendControls: extendControls,
            excludeControls: ['media', 'code'],
          })}
    />
  );
};
