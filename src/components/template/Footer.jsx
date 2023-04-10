import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Footer.css"
import { faCode } from '@fortawesome/free-solid-svg-icons';

export default function Footer(props) {
    return (
        <footer className="Footer">
            <div className="d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <h6><span>Desenvolvido por </span>
                        <a target="blank" href="https://whrl.vercel.app">Wesley Henrique</a></h6>
                    <h6>Base de dados de TMDb <a target="blank"  href="https://github.com/Wesleyhrl/movieplus">
                        <FontAwesomeIcon icon={faCode}/> veja o código</a></h6>
                </div>
            </div>
        </footer>
    )
}