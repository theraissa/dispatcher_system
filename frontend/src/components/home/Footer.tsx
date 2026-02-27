export default function Footer() {
    return (
    <footer>
        <div className="footer-grid">
            <div className="footer-coluna">
                <h4>Use cases</h4>
                <ul>
                    <li><a href="#">UI design</a></li>
                    <li><a href="#">UX design</a></li>
                    <li><a href="#">Wireframing</a></li>
                    <li><a href="#">Diagramming</a></li>
                    <li><a href="#">User Research</a></li>
                    <li><a href="#">Prototyping</a></li>
                </ul>
            </div>
            <div className="footer-coluna">
                <h4>Explore</h4>
                <ul>
                    <li><a href="#">Design</a></li>
                    <li><a href="#">Prototyping</a></li>
                    <li><a href="#">Development features</a></li>
                    <li><a href="#">Integrations</a></li>
                    <li><a href="#">Templates</a></li>
                </ul>
            </div>
            <div className="footer-coluna">
                <h4>Resources</h4>
                <ul>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Best practices</a></li>
                    <li><a href="#">Suporte</a></li>
                    <li><a href="#">Documentation</a></li>
                    <li><a href="#">FAQ</a></li>
                </ul>
            </div>
            <div className="footer-coluna">
                <h4>Company</h4>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">Press</a></li>
                </ul>
            </div>
            <div className="footer-coluna contato">
                <h4>Contact</h4>
                <p>Email: info@seudominio.com</p>
                <p>Phone: (XX) XXXX-XXXX</p>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; 2025 Seu Domínio. Todos os direitos reservados. | <a href="#">Termos de Uso</a> | <a href="#">Política de Privacidade</a></p>
        </div>
    </footer>
    );
}
