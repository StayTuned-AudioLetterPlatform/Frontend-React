import React, {useState, useRef} from 'react';
import IconSelector from "./iconSelector";
import styles from '../assets/css/nameSelector.module.css'

export default function NameSelector (props) {

    const [nameInput, setNameInput] = useState('');

    const nameRef = useRef();

    const onChange = ({target}) => {
        const value = target.value;
        setNameInput(value);
    }

    const saveName = () => {
        console.log(nameInput);
        props.setContent(<IconSelector name={nameInput} setContent={props.setContent}/>);
    }

    return(
        <div className={styles.container}>
            <input className={styles.nameInput} ref={nameRef} onChange={onChange} placeholder={"enter name"}></input>
            <button className={styles.nextButton} onClick={saveName}>next</button>
        </div>
    );
}