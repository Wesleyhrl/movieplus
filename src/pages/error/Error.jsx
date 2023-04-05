import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import "./Error.css"

export default function Error(){
    return(
        <div className="Error d-flex justify-content-center align-items-center">
            <Card className="Text text-center p-5">
            <h1>404</h1>
            <h2>Pagina não encontrada!!!</h2>
            <Link to="/"><FontAwesomeIcon icon={faAnglesLeft} /> Voltar para os filmes</Link>
            </Card>
            
        </div>
    )
}