import React from 'react';
import styles from '../../../../styles/dashboardStyles/projectStyles/actaConstStyles/Button.module.css';

const Button = ({
                    appearance = 'default',
                    state = 'default',
                    spacing = 'default',
                    isDisabled = false,
                    isLoading = false,
                    children
                }) => {
    let classNames = [styles.button, styles[appearance], styles[state], styles[spacing]];

    if (isDisabled) classNames.push(styles.disabled);
    if (isLoading) classNames.push(styles.loading);

    return (
        <button className={classNames.join(' ')} disabled={isDisabled || isLoading}>
            {children}
        </button>
    );
};

export default Button;
