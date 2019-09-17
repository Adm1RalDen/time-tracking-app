import React from 'react'
import { EditableContext } from './contex';
import { Table, Input, InputNumber, Popconfirm, Form, Button, Icon, Layout, DatePicker, message as alertMessage } from 'antd';

function EditableCell(props) {
    let getInput = () => {
        if (props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input />;
    };
    let renderCell = ({ getFieldDecorator }) => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            children,
            ...restProps
        } = props;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `Please Input ${title}!`,
                                },
                            ],
                            initialValue: record[dataIndex],
                        })(getInput())}
                    </Form.Item>
                ) : (
                        children
                    )}
            </td>
        );
    };
    return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
}
export default EditableCell