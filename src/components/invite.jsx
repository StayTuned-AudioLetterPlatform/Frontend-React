import React from 'react';
import styles from '../assets/css/invite.module.css';

export default function Invite () {
    return(
        <div className={styles.container}>
            <h1 className={styles.inviteGuide}>친구를 초대해 보세요!</h1>
            <div className={styles.box}>
                <p className={styles.inviteInfo}>
                    {window.localStorage.getItem("inviteURL")}
                </p>
            </div>
        </div>
    );
}