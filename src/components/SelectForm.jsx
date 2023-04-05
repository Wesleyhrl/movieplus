import Dropdown from 'react-bootstrap/Dropdown';
import { Col } from 'react-bootstrap';
import { Row } from 'react-bootstrap';

import "./SelectForm.css"

export default function SelectForm({list , handle}) {
    return (
        <Dropdown className='SelectForm w-100'>
            <Dropdown.Toggle className='BtnSelect'>
                Gêneros
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-2 DropMenu">
                <Row>
                <Dropdown.Item ></Dropdown.Item>
                {list.map((item, i)=>{
                    return(
                        <Col key={i} xs={6}><Dropdown.Item onClick={() => handle(item.name , item.id)}>{item.name}</Dropdown.Item></Col>
                    )   
                    })} 
                </Row>
            </Dropdown.Menu>
        </Dropdown>
    )
}