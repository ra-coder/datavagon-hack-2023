interface TrainSvgProps {
	fill?: string;
	width?: string;
}

export function TrainSvg({fill, width}: TrainSvgProps) {
	return (
		<svg fill={fill} width={width} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
			<polygon points="30 25 2 25 2 27 4 27 4 29 6 29 6 27 11 27 11 29 13 29 13 27 18 27 18 29 20 29 20 27 25 27 25 29 27 29 27 27 30 27 30 25"/>
			<path d="M8,16H2V14H8V12H2V10H8a2.0021,2.0021,0,0,1,2,2v2A2.0021,2.0021,0,0,1,8,16Z" transform="translate(0 0)"/>
			<path d="M28.55,14.2305,19.97,6.3657A8.9775,8.9775,0,0,0,13.8882,4H2V6H12v4a2.0023,2.0023,0,0,0,2,2h9.1565l4.0417,3.7051A2.4723,2.4723,0,0,1,25.5273,20H2v2H25.5273a4.4726,4.4726,0,0,0,3.0225-7.77ZM14,10V6.0054A6.9774,6.9774,0,0,1,18.6182,7.84L20.9746,10Z" transform="translate(0 0)"/>
			<rect width="32" height="32" fill="none"/>
		</svg>
	)
}
