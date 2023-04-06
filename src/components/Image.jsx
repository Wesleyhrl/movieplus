import { useState } from 'react';
import Placeholder from 'react-bootstrap/Placeholder';

import "./Image.css"
export default function Image(props) {
    const [loading, setLoading] = useState(true);
    return (
        <div className='Image'>
            {loading && (<Placeholder bg="secondary" animation='wave'>
                    <div className={props.classLoad}></div>
                </Placeholder>)}
            <div className={loading && "d-none"}>
                <img className={props.classImg} src={props.src} alt={props.alt} onError={props.onError} onLoad={(()=> setLoading(false))} />
            </div>
        </div>
    )
}