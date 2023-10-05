import styles from './Avatar.module.css';

function Avatar({ size }) {
    let avatarClass = styles.avatar;

    if (size === 'small') {
        avatarClass += ` ${styles.small}`;
    } else if (size === 'medium') {
        avatarClass += ` ${styles.medium}`;
    } else if (size === 'large') {
        avatarClass += ` ${styles.large}`;
    } else if (size === 'xlarge') {
        avatarClass += ` ${styles.xlarge}`;
    }

    return <div className={avatarClass}></div>;
}

export default Avatar;
