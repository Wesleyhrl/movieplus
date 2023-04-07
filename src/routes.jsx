import { Route, Routes } from "react-router-dom";
import Error from "./pages/error/Error.jsx";
import Favorites from "./pages/favorites/Favorites.jsx";
import Home from "./pages/home/Home.jsx";
import Details from "./pages/details/Details.jsx";
import Search from "./pages/search/Search.jsx";
import Streaming from "./pages/streaming/Streaming.jsx";
import PersonDetails from "./pages/personDetails/PersonDetails.jsx";
import Person from "./pages/person/Person.jsx";


export default function RoutesApp() {
    return (
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/movie" element={<Streaming />}/>
            <Route path="/tv" element={<Streaming />}/>
            <Route path="/person" element={<Person />}/>
            <Route path="/person/:id" element={<PersonDetails />}/>
            <Route path="/:type/:id" element={<Details />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/search/:value" element={<Search/>} />


            <Route path="*" element={<Error/> }/>
        </Routes>
    )
}