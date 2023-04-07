import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";


import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

import "./Header.css"


export default function Header(props) {
    const expand = props.expand;
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    function handleSearch() {
        if (search.length >= 1) {
            navigate(`/search/${search}`);
        }
        if (search.length === 0) {
            navigate(`/`);
        }
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    });
    
    return (
        <Container fluid className="Header sticky-top">
            <Navbar expand={expand} variant="dark" className="mb-3 flex-nowrap" >
                <Navbar.Brand>
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} /> <Link to="/">MoviePlus</Link>
                </Navbar.Brand>
                <Form className="d-flex d-lg-none">
                    <Form.Control
                        size="sm"
                        type="search"
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyUp={handleSearch}
                        value={search}
                        placeholder="Buscar"
                    />
                </Form>
                <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-${expand}`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                    placement="start"
                    className="OffCanvas"
                >
                    <Offcanvas.Header className="OffHeader" closeVariant="white" closeButton>
                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                            MoviePlus
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className="OffBody">
                        <Nav className="justify-content-start flex-grow-1 pe-3">
                            <Link className="nav-link" to="/">Home</Link>
                            <Link className="nav-link" to="/movie">Filmes</Link>
                            <Link className="nav-link" to="/tv">TV Shows</Link>
                            <Link className="nav-link" to="/person">Pessoas</Link>
                            <Link className="nav-link" to="/favoritos">Favoritos</Link>
                            
                        </Nav>
                        <Form className="d-none d-lg-flex">
                            <Form.Control
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyUp={handleSearch}
                                type="text"
                                value={search}
                                placeholder="Buscar"
                            />
                        </Form>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Navbar>
        </Container>
    )
}