import  Button  from 'react-bootstrap/Button';
import "./Btn.css"

export default function Btn(props){
    return(
        <div className={`Btn ${props.className}`}>
            <Button onClick={props.onClick} size={props.size}>{props.children}</Button>
        </div>
        
    )
}