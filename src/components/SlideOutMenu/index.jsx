import React, { useState } from 'react';
import './styles.scss'

const SlideOutMenu = ({links, isMenuOpen}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [linksHovered, setLinksHovered] = useState(false);

	const toggleOpenMenu = () => {
		setIsOpen(prevState => !prevState);
		// isMenuOpen(!isOpen);
	}
	
	return (
		<div className="byrdmenu">
			<div className="menu-container" onClick={() => toggleOpenMenu()}>
				<div className="menu-open-button-container">
					<div className={`menu-open-line-one ${isOpen ? 'open' : ''}`} />
					<div className={`menu-open-line-two ${isOpen ? 'open' : ''}`}/>
				</div>
			</div>
			<div className={`underlay ${isOpen ? 'menu-open' : 'menu-closed' }`}></div>
			<div className={`menu-content ${isOpen ? 'menu-open' : 'menu-closed' }`}>
			{isOpen && (
				<>
				<div className="menu-header"></div>
				<div 
					className={`menu-links ${linksHovered ? 'hovered' : ''}`} 
					onMouseEnter={() => setLinksHovered(true)} 
					onMouseLeave={() => setLinksHovered(false)}
				>
			  	{links.map((link, index) => { 
			  		const delay = `${0 + (0.1 * index)}s`;
			  		return <a style={{'animationDelay': delay}} className="menu-link" href="#">{link.label}</a>;
			  	})}
				</div>
				</>
			)}
			</div>
		</div>
	);
};

export default SlideOutMenu;