import React from 'react';

import './styles.scss'

const gifs = [
    "url(/assets/gifs/orig.gif)",
    "url(/assets/gifs/bluewater.gif)",
    "url(/assets/gifs/bubbles.gif)",
    "url(/assets/gifs/green.gif)"
]

function ClipText (props) {
	var gif = props.gif;

	if (props.type) {
		switch (props.type) {
			case "original":
				gif = "url(https://media.giphy.com/media/3o6Ztb45EYezY9x9gQ/giphy.gif)";
				break;
			case "fire":
				gif = "url(https://media.giphy.com/media/6wpHEQNjkd74Q/giphy.gif)";
				break;
			case "green":
				gif = "url(https://media.giphy.com/media/3NeSk2IVEd2FYUQEcM/giphy.gif)";
				break;
			case "bluewater":
				gif = "url(https://media.giphy.com/media/9PcvOTnh6lyfs2mFON/giphy.gif)";
				break;
			case "dna":
				gif = "url(https://media.giphy.com/media/YMT43RuQJ2Ut8ghTpM/giphy.gif)";
				break;
			case "particles":
				gif = "url(https://media.giphy.com/media/RfMEN7KrjX153ubUQH/giphy.gif)";
				break;
			case "electric":
				gif = "url(https://media.giphy.com/media/KznLJtpg1kRXBNRaH2/giphy.gif)";
				break; 
			case "bubbles":
				gif = "url(https://media.giphy.com/media/l41Yv7dUQOqgcnalW/giphy.gif)";
				break;
            case "random":
                gif = gifs[Math.floor(Math.random()*gifs.length)]
                break;
			default:
				gif = "url(https://media.giphy.com/media/3o6Ztb45EYezY9x9gQ/giphy.gif)";
		}
	} 

	return(
		<div onClick={() => props.onClick()} className="cliptext__main">
			<div className="cliptext" style={{
					background: ` ${gif}`, 
					backgroundSize: "contain",
					backgroundPosition: "top left",
					WebkitBackgroundClip: "text"
					}}>
				{props.value}
			</div>
		</div>
	)
}

export default ClipText;