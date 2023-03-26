import styles from './InputBox.Module.css';

const InputBox = (props) => {
  const {
    displayText,
    value,
    setValue
  } = props
  
  const handleChange = (e) => {
    setValue(e.target.value);
  }

  return (
    <div className={styles.inputCont} style={{display:"flex"}}>
      <div>
        {displayText}:
      </div>
      <input
          style={{borderRadius:"15px",  marginLeft:"5px"}}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="  Enter text here"
      /> 
    </div>
  )
}

export default InputBox;