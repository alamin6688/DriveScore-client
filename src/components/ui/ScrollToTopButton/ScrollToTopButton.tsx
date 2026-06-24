'use client'
import { FloatButton } from 'antd';
import React from 'react';

const ScrollToTopButton = () => {
    return (
        <div>
            <FloatButton.BackTop style={{ right: 24, left: 'auto' }} />
        </div>
    );
};

export default ScrollToTopButton;
