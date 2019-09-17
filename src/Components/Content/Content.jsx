
import React, { useEffect } from 'react';
import 'antd/dist/antd.css';
import '../../Style/Content.css';
import { Table, Input, InputNumber, Popconfirm, Form, Button, Icon, Layout, DatePicker, message as alertMessage } from 'antd';
import { inject, observer } from 'mobx-react';
import StripOverTheTable from './stripOverTheTable';
import { EditableContext } from './contex';
import classColumns from './columns';
import EditableCell from './editableCell.js';

const EditableTable = inject('Store')(observer(function (props) {
  const { data, setData, editingKey, setEditingKey } = props.Store;
  const columns = classColumns.columns;

  useEffect(() => {
    getDATA().then(res => {
      return res.map(item => { item.key = item._id; return item })
    }).then(res => setData(res))
  }, [])

  let isEditing = record => record.key === editingKey;

  let cancel = () => {
    setEditingKey('');
  }

  let getDATA = async () => {
    try {
      const getInfo = await fetch('/getTodos', {
        method: "GET",
      });
      const temp = await getInfo.json();
      return temp;
    }
    catch (error) {
      alertMessage.error(error);
    }
  }

  const components = {
    body: {
      cell: EditableCell,
    },
  };

  const columnsMap = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Layout.Content className='content'>
      <StripOverTheTable />
      <EditableContext.Provider value={props.form}>
        <Table
          components={components}
          bordered
          dataSource={data}
          columns={columnsMap}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
            pageSize: 7
          }}
        />
      </EditableContext.Provider>
    </Layout.Content>

  );
}));

const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable
