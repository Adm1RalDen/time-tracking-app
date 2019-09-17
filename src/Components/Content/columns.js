import React from 'react'
import { EditableContext } from './contex';
import { Popconfirm, Icon, DatePicker } from 'antd';
import Store from '../../Store/Store';
const moment = require('moment');

class ClassColumns {
    isEditing = record => record.key === Store.editingKey;

    cancel = () => {
        Store.setEditingKey('');
    }

    putDATA = async (dataTempPut, id) => {
        // console.log('some props', dataTempPut, id);
        const sendInfo = await fetch(`/${id}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataTempPut)
        });
        const temp = await sendInfo.json();
        return temp;
    }

    deleteDATA = async (id) => {
        const sendInfo = await fetch(`/${id}`, {
            method: "DELETE",
        });
        const temp = await sendInfo.json();
        return temp;
    }

    deleteItem = (key) => {
        let dataSourse = [...Store.data];
        this.deleteDATA(key);
        Store.setData(dataSourse.filter(item => item.key !== key));
    }

    save = (form, key) => {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...Store.data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                this.putDATA({
                    "date": item.date,
                    "message": row.message,
                    "futurePlan": row.futurePlan,
                    "workHours": row.workHours
                }, item._id)
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                Store.setData(newData);
                Store.setEditingKey('');
            } else {
                newData.push(row);
                Store.setData(newData);
                Store.setEditingKey('');
            }
        });
    }

    edit = (key) => {
        Store.setEditingKey(key);
    }
    columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            render: (text, record) => {
                const editable = this.isEditing(record);
                return editable ? (
                    <DatePicker
                        value={moment(record.date)}
                        onChange={(res, resStr) => {
                            const newData = [...Store.data];
                            const index = newData.findIndex(item => record.key === item.key);
                            newData[index].date = resStr;
                            Store.setData(newData)
                        }}
                    />
                ) : (
                        <span>{record.date}</span>
                    )
            },
        },
        {
            title: 'Message',
            dataIndex: 'message',
            width: '25%',
            editable: true,
        },
        {
            title: 'Future plan',
            dataIndex: 'futurePlan',
            width: '40%',
            editable: true,
        },
        {
            title: 'Worked hours',
            dataIndex: 'workHours',
            width: '10%',
            editable: true,
        },
        {
            title: 'Delete / Edit',
            dataIndex: 'operation',
            render: (text, record) => {
                const editable = this.isEditing(record);
                return editable ? (
                    <span className='icon-div'>
                        <EditableContext.Consumer>
                            {form => (
                                <a
                                    href
                                    onClick={() => this.save(form, record.key)}
                                    style={{ marginRight: 8 }}
                                >
                                    Save
                </a>
                            )}
                        </EditableContext.Consumer>
                        <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                            <a href>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                        <div className="icon-div">
                            <a disabled={Store.editingKey !== ''} >
                                <Popconfirm
                                    title=" Sure delete this task?"
                                    onConfirm={() => this.deleteItem(record.key)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Icon type="delete" className='icon' />
                                </Popconfirm>
                            </a>

                            <a disabled={Store.editingKey !== ''} onClick={() => this.edit(record.key)} >
                                <Icon type="edit" className='icon' />
                            </a>
                        </div>

                    );
            },
        },
    ];
}
let temp = new ClassColumns();
export default temp;
export { ClassColumns }