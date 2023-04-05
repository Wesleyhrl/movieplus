import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import CardMovie from "../../components/CardMovie.jsx";

import "./Favorites.css"



export default function Favorites(props) {
    const [filmes, setFilmes] = useState([]);

    useEffect(() => {
        const myList = localStorage.getItem("@movieplus");
        setFilmes(JSON.parse(myList) || []);
    }, []);

    return (
        <div className="Favorites">
            <h2>Favoritos</h2>
            
            <Row className="listFavorites">
            {filmes.map((filme) => {
                 return(
                    <Col xs={12} sm={6} md={4} lg={3} xl={2}  key={filme.id} className="p-3">
                        <CardMovie type={filme.type} id={filme.id} title={filme.title || filme.name} poster={filme.poster_path} average={filme.vote_average} date={filme.release_date || filme.first_air_date} />
                    </Col>
                    
                )
            })}
            {filmes.length === 0 && <span id="vazio" className="text-center">Você não possui filmes favoritos</span>}
            </Row>

        </div>
    )
}