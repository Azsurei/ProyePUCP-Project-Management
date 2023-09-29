import React from 'react';
import styles from '../../../../styles/dashboardStyles/projectStyles/actaConstStyles/BreadCrumb.module.css'

const Breadcrumb = ({ items }) => (
    <div className={styles.header}>
        {items.map((item, index) => (
            <span key={index}>
                {item}
                {index < items.length - 1 && ' / '}
            </span>
        ))}
    </div>
);

export default Breadcrumb;