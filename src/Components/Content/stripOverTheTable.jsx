import React, { useState } from 'react'
import { inject, observer } from 'mobx-react';
import { Table, Input, InputNumber, Popconfirm, Form, Button, Icon, Layout, DatePicker, message as alertMessage } from 'antd';
const moment = require('moment');

export default inject('Store')(observer(function (props) {
    const [today, setToday] = useState({ today: moment(), todayStr: moment().format('YYYY-MM-DD') });
    const [message, setMessage] = useState('');
    const [futurePlan, setFuturePlan] = useState('');
    const [workHours, setHours] = useState();
    const { data, setData, counts, setCounts } = props.Store;

    let postDATA = async (dataTempForPost) => {
        const sendInfo = await fetch('/', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataTempForPost)
        });
        const temp = await sendInfo.json();
        return temp;
    }

    let add = async () => {
        if (today !== null && workHours > 0 && message !== '' && futurePlan !== '') {
            postDATA({
                "date": today.todayStr,
                "message": message,
                "futurePlan": futurePlan,
                "workHours": workHours
            }).then(result => {
                const temp = result;
                temp.key = temp._id;
                // console.log(result);
                setData([...data, temp]);
                setCounts(counts + 1);
                setToday({ today: moment(), todayStr: moment().format('YYYY-MM-DD') })
                setMessage('')
                setFuturePlan('')
                setHours(null)
            })

        } else {
            if (workHours <= 0) {
                alertMessage.error('!!!No correct input hours!!!');
            }
            else {
                alertMessage.error('Fill in all the fields')
            }
        }

    }

    return (
        <Form>
            <Form.Item>
                <DatePicker
                    value={today.today}
                    onChange={(res, resStr) => setToday({ today: res, todayStr: resStr })}
                />

                <Input.TextArea
                    value={message}
                    onChange={({ target: { value } }) => setMessage(value)}
                    autosize={{ minRows: 1, maxRows: 1 }}
                    style={{ maxWidth: '35vw' }}
                    placeholder='input your message'
                />

                <Input.TextArea
                    value={futurePlan}
                    onChange={({ target: { value } }) => setFuturePlan(value)}
                    autosize={{ minRows: 1, maxRows: 1 }}
                    style={{ maxWidth: '35vw' }}
                    placeholder='input your future plan'
                />

                <InputNumber
                    value={workHours}
                    placeholder='hours'
                    onChange={value => setHours(value)}
                />

                <Button type='primary' onClick={add}><Icon type="plus" /></Button>

            </Form.Item>
        </Form>
    );
}))