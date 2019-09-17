import React from 'react'
import '../Style/Header.css';
import { inject, observer } from 'mobx-react';
import { Typography} from 'antd';
import { Layout } from 'antd';

const { Title } = Typography;

const Header = inject('Store')(observer((props) => {
    // const { data, setData,  } = props.Store;

    return (
        <Layout.Header>
            <Title level={4} type='secondary' id='headerText'>Time Tracking</Title>
            <div className='button-container'>
                
            </div>

        </Layout.Header>

    );
}))
export default Header