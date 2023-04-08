import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";


import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

import "./Header.css"
import { useEffect } from "react";


export default function Header(props) {
    const location = useLocation();
    const expand = props.expand;
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [focus , SetFocus] = useState();


    useEffect(() => {
      if(!focus && !location.pathname.includes("search")){
        setSearch("");
      }
    }, [location, focus])
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
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} /> <Link id="logo" to="/">MoviePlus</Link>
                </Navbar.Brand>
                <Form className="d-flex d-lg-none">
                    <Form.Control
                        size="sm"
                        type="search"
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyUp={handleSearch}
                        onFocus={()=> SetFocus(true)}
                        onBlur={()=> SetFocus(false)}
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
                            <Link id="logo" to="/">MoviePlus</Link>
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className="OffBody">
                        <Nav className="justify-content-start flex-grow-1 pe-3">
                            <NavLink className={`${({ isActive }) => isActive ? "active" : ""} nav-link`} to="/">Home</NavLink>
                            <NavLink className={`${({ isActive }) => isActive ? "active" : ""} nav-link`} to="/movie">Filmes</NavLink>
                            <NavLink className={`${({ isActive }) => isActive ? "active" : ""} nav-link`} to="/tv">TV Shows</NavLink>
                            <NavLink className={`${({ isActive }) => isActive ? "active" : ""} nav-link`} to="/person">Pessoas</NavLink>
                            <NavLink className={`${({ isActive }) => isActive ? "active" : ""} nav-link`} to="/favoritos">Favoritos</NavLink>
                        </Nav>
                        <Form className="d-none d-lg-flex">
                            <Form.Control
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyUp={handleSearch}
                                onFocus={()=> SetFocus(true)}
                                onBlur={()=> SetFocus(false)}
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