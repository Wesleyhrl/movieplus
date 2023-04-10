import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import "./BtnChange.css"

export default function BtnChange(props) {
    return (
        <div className='text-center p-2'>
            <ButtonGroup size={props.size}className={`BtnChange`}>
                <Button onClick={() => props.onClick(props.name1)}  variant='dark' className={`${props.type === props.name1 ? "isActive" : ""}`} >{props.text1}</Button>
                <Button onClick={() => props.onClick(props.name2)} variant='dark' className={`${props.type === props.name2 ? "isActive" : ""}`}  >{props.text2}</Button>
            </ButtonGroup>
        </div>
    )
}