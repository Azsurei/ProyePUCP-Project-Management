import React from 'react';
import styles from './Button.module.css';

const Button = ({
                    appearance = 'default',
                    state = 'default',
                    spacing = 'default',
                    isDisabled = false,
                    isLoading = false,
                    iconOnly = false,
                    icon,
                    children
                }) => {
    let classNames = [styles.button, styles[appearance], styles[state], styles[spacing]];

    if (isDisabled) classNames.push(styles.disabled);
    if (isLoading) classNames.push(styles.loading);
    if (iconOnly) classNames.push(styles.iconOnly);

    return (
        <button className={classNames.join(' ')} disabled={isDisabled || isLoading}>
            {icon}
            {!iconOnly && children}
        </button>
    );
};

export default Button;
