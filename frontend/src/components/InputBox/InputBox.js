import styles from './InputBox.css';

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
    <div className={styles.inputBox} style={{display:"flex"}}>
      <div>
        {displayText}:
      </div>
      <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Enter text here"
      /> 
    </div>
  )
}

export default InputBox;