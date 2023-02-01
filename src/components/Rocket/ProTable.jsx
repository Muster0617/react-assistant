import ProTable from '@ant-design/pro-table';
import react from 'react'
import { useEffect, useState, useRef } from 'react';
import { getLocalStorage, setLocalStorage, handleTextEllipsis } from './utils';

/**
 * app.tsx：layout
 * layout/index.jsx
    menuItemRender: (item, dom) => {
      return (
        <div
          onClick={() => {
            if (item?.path !== window.location.pathname) {
              window.localStorage.removeItem('pro_table_search_data');
            }
            history.push(item?.path);
          }}
        >
          {dom}
        </div>
      );
    },
*/


export default props => {
  const { request, columns, pagination, search, ...tableProps } = props;
  const formRef = useRef();
  const [searchData, setSearchData] = useState({});

  const handleColumns = (list) => {
    for (const item of list) {
      if (item.valueType === 'longText') {
        const render = item.render
        item.render = (_, record) => {
          if (render) {
            return typeof render(_, record)?.['$$typeof'] === 'symbol' ?
              render(_, record) : handleTextEllipsis(render(_, record), item?.width)
          } else {
            return handleTextEllipsis(record?.[item?.dataIndex], item?.width)
          }
        }
      }
    }
    return list
  }

  const init = () => {
    const storageSearchData = getLocalStorage('pro_table_search_data');
    if (storageSearchData) {
      setSearchData(storageSearchData)
      formRef.current.setFieldsValue(storageSearchData);
    }
  };


  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <ProTable
        columns={handleColumns(columns)}
        formRef={formRef}
        tableAlertRender={false}
        search={{
          defaultCollapsed: false,
          labelWidth: 'auto',
          ...search
        }}
        scroll={{ x: 'max-content' }}
        options={false}
        pagination={{
          pageSize: 10,
          current: searchData?.current || 1,
          onChange: (current) => {
            setLocalStorage('pro_table_search_data', { ...getLocalStorage('pro_table_search_data'), current })
            setSearchData({ ...getLocalStorage('pro_table_search_data'), current })
          },
          ...pagination,
        }}
        request={async params => {
          const payload = { ...params, ...formRef.current.getFieldsValue() };
          for (const key in payload) {
            if (payload[key] === '' || payload[key] === undefined || payload[key] === null) {
              delete payload[key];
            }
          }
          setLocalStorage('pro_table_search_data', payload);
          setSearchData(payload)
          return request(payload);
        }}
        {...tableProps}
      />
    </div>
  );
}
