import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

const SLIDE_DURATION = 90; // 3 seconds per slide at 30fps
const ENTER_FRAMES = 22;
const EXIT_FRAMES = 18;

const slides = [
	{
		icon: '📱',
		title: 'No Physical SIM Needed',
		description:
			'Switch carriers instantly without swapping cards. Your eSIM is embedded directly in your device.',
		color: '#6c63ff',
		bg1: '#1a0933',
		bg2: '#0f0826',
	},
	{
		icon: '⚡',
		title: 'Instant Activation',
		description:
			'Get connected in seconds. Activate your plan digitally — no waiting for a SIM card to arrive.',
		color: '#f7b731',
		bg1: '#1a1200',
		bg2: '#0f0b00',
	},
	{
		icon: '🌍',
		title: 'Global Coverage',
		description:
			'Travel to 190+ countries with affordable local data rates. Stay connected wherever life takes you.',
		color: '#26de81',
		bg1: '#001a0e',
		bg2: '#000f08',
	},
	{
		icon: '🔄',
		title: 'Multiple Profiles',
		description:
			'Store multiple carrier plans on one device. Seamlessly switch between personal and business lines.',
		color: '#45aaf2',
		bg1: '#001322',
		bg2: '#000b14',
	},
	{
		icon: '💰',
		title: 'Save on Roaming',
		description:
			'Avoid expensive international roaming fees by switching to local data plans at local prices.',
		color: '#fd9644',
		bg1: '#1a0a00',
		bg2: '#0f0600',
	},
	{
		icon: '🔒',
		title: 'Enhanced Security',
		description:
			"eSIMs can't be physically stolen or swapped. Your identity and connection stay safe at all times.",
		color: '#fc5c65',
		bg1: '#1a0005',
		bg2: '#0f0003',
	},
	{
		icon: '🌱',
		title: 'Eco-Friendly',
		description:
			'No plastic SIM cards. No packaging waste. A smarter, greener way to stay connected globally.',
		color: '#2bcbba',
		bg1: '#001714',
		bg2: '#000e0c',
	},
	{
		icon: '🚀',
		title: 'Future-Ready Technology',
		description:
			'eSIM is the global standard for next-gen devices. Be ahead of the curve with technology built for tomorrow.',
		color: '#a55eea',
		bg1: '#110022',
		bg2: '#0a0014',
	},
];

// Floating background blob
const Blob: React.FC<{
	cx: number;
	cy: number;
	r: number;
	color: string;
	phaseX: number;
	phaseY: number;
	ampX: number;
	ampY: number;
	frame: number;
}> = ({cx, cy, r, color, phaseX, phaseY, ampX, ampY, frame}) => {
	const x = cx + Math.sin((frame / 90) * Math.PI * 2 + phaseX) * ampX;
	const y = cy + Math.cos((frame / 70) * Math.PI * 2 + phaseY) * ampY;
	return (
		<div
			style={{
				position: 'absolute',
				left: `${x}%`,
				top: `${y}%`,
				width: r * 2,
				height: r * 2,
				borderRadius: '50%',
				background: `radial-gradient(circle, ${color}28 0%, ${color}00 70%)`,
				transform: 'translate(-50%, -50%)',
				filter: 'blur(60px)',
				pointerEvents: 'none',
			}}
		/>
	);
};

// Animated word-by-word title
const AnimatedTitle: React.FC<{text: string}> = ({text}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const words = text.split(' ');

	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				gap: '0 18px',
				lineHeight: 1.15,
			}}
		>
			{words.map((word, i) => {
				const delay = ENTER_FRAMES / 2 + i * 7;
				const wordSpring = spring({
					frame: frame - delay,
					fps,
					config: {damping: 16, stiffness: 160},
				});
				const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				return (
					<span
						key={i}
						style={{
							color: '#ffffff',
							fontSize: 68,
							fontWeight: 800,
							letterSpacing: -1,
							display: 'inline-block',
							opacity,
							transform: `translateY(${interpolate(wordSpring, [0, 1], [40, 0])}px)`,
						}}
					>
						{word}
					</span>
				);
			})}
		</div>
	);
};

// Pulsing icon with orbit ring
const AnimatedIcon: React.FC<{icon: string; color: string}> = ({
	icon,
	color,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const popScale = spring({
		frame,
		fps,
		config: {damping: 10, stiffness: 200},
		durationInFrames: 30,
	});

	const floatY = Math.sin((frame / 45) * Math.PI * 2) * 10;
	const glowPulse = 0.6 + Math.sin((frame / 30) * Math.PI * 2) * 0.4;
	const ringScale = 1 + Math.sin((frame / 40) * Math.PI * 2) * 0.08;
	const ringOpacity = 0.3 + Math.sin((frame / 40) * Math.PI * 2) * 0.2;

	return (
		<div
			style={{
				position: 'relative',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				transform: `scale(${popScale}) translateY(${floatY}px)`,
			}}
		>
			{/* Outer pulse ring */}
			<div
				style={{
					position: 'absolute',
					width: 200,
					height: 200,
					borderRadius: '50%',
					border: `2px solid ${color}`,
					opacity: ringOpacity,
					transform: `scale(${ringScale})`,
				}}
			/>
			{/* Inner glow ring */}
			<div
				style={{
					position: 'absolute',
					width: 160,
					height: 160,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${color}${Math.round(glowPulse * 50).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
					boxShadow: `0 0 ${40 + glowPulse * 30}px ${color}60`,
				}}
			/>
			{/* Icon */}
			<div
				style={{
					fontSize: 90,
					lineHeight: 1,
					filter: `drop-shadow(0 0 20px ${color}80)`,
					zIndex: 1,
				}}
			>
				{icon}
			</div>
		</div>
	);
};

const Slide: React.FC<{
	slide: (typeof slides)[0];
	slideIndex: number;
}> = ({slide, slideIndex}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Slide-in: 0 → ENTER_FRAMES (from right)
	const enterProgress = spring({
		frame,
		fps,
		config: {damping: 20, stiffness: 120},
		durationInFrames: ENTER_FRAMES,
	});

	// Slide-out: EXIT_FRAMES before end
	const exitStart = SLIDE_DURATION - EXIT_FRAMES;
	const exitProgress = interpolate(
		frame,
		[exitStart, SLIDE_DURATION],
		[0, 1],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	const translateX = interpolate(enterProgress, [0, 1], [120, 0]) - exitProgress * 120;
	const opacity = interpolate(frame, [0, 8], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	}) * interpolate(frame, [exitStart, SLIDE_DURATION], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Progress bar fill
	const progress = interpolate(frame, [0, SLIDE_DURATION], [0, 100], {
		extrapolateRight: 'clamp',
	});

	// Accent line width
	const lineWidth = interpolate(frame, [ENTER_FRAMES + 5, ENTER_FRAMES + 30], [0, 220], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Description
	const descOpacity = interpolate(frame, [ENTER_FRAMES + 20, ENTER_FRAMES + 40], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const descY = interpolate(frame, [ENTER_FRAMES + 20, ENTER_FRAMES + 40], [25, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(145deg, ${slide.bg1} 0%, ${slide.bg2} 100%)`,
				overflow: 'hidden',
				fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
				opacity,
				transform: `translateX(${translateX}px)`,
			}}
		>
			{/* Animated background blobs */}
			<Blob cx={15} cy={20} r={340} color={slide.color} phaseX={0} phaseY={0} ampX={6} ampY={8} frame={frame} />
			<Blob cx={85} cy={75} r={280} color={slide.color} phaseX={2} phaseY={1.5} ampX={5} ampY={7} frame={frame} />
			<Blob cx={50} cy={50} r={200} color={slide.color} phaseX={4} phaseY={3} ampX={4} ampY={5} frame={frame} />

			{/* Subtle grid overlay */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage: `linear-gradient(${slide.color}08 1px, transparent 1px), linear-gradient(90deg, ${slide.color}08 1px, transparent 1px)`,
					backgroundSize: '80px 80px',
				}}
			/>

			{/* Top accent bar */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 5,
					background: `linear-gradient(90deg, ${slide.color}, ${slide.color}44, transparent)`,
				}}
			/>

			{/* Logo */}
			<div
				style={{
					position: 'absolute',
					top: 44,
					right: 64,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
				}}
			>
				<div
					style={{
						width: 9,
						height: 9,
						borderRadius: '50%',
						backgroundColor: slide.color,
						boxShadow: `0 0 14px ${slide.color}, 0 0 28px ${slide.color}80`,
					}}
				/>
				<span
					style={{
						color: '#ffffff',
						fontSize: 28,
						fontWeight: 700,
						letterSpacing: 0.5,
						opacity: 0.9,
					}}
				>
					kloudesim
					<span style={{color: slide.color}}>.com</span>
				</span>
			</div>

			{/* Slide number */}
			<div
				style={{
					position: 'absolute',
					top: 44,
					left: 64,
					color: `${slide.color}99`,
					fontSize: 22,
					fontWeight: 700,
					letterSpacing: 3,
					fontVariantNumeric: 'tabular-nums',
				}}
			>
				{String(slideIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
			</div>

			{/* Main content */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					gap: 32,
					padding: '120px 100px 120px',
					textAlign: 'center',
				}}
			>
				<AnimatedIcon icon={slide.icon} color={slide.color} />

				<AnimatedTitle text={slide.title} />

				{/* Animated accent line */}
				<div
					style={{
						height: 4,
						width: lineWidth,
						borderRadius: 2,
						background: `linear-gradient(90deg, ${slide.color}, ${slide.color}44)`,
						boxShadow: `0 0 12px ${slide.color}80`,
					}}
				/>

				{/* Description */}
				<div
					style={{
						color: 'rgba(210, 220, 245, 0.82)',
						fontSize: 36,
						fontWeight: 400,
						lineHeight: 1.65,
						maxWidth: 920,
						opacity: descOpacity,
						transform: `translateY(${descY}px)`,
					}}
				>
					{slide.description}
				</div>
			</div>

			{/* Bottom progress bar */}
			<div
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					height: 4,
					background: 'rgba(255,255,255,0.08)',
				}}
			>
				<div
					style={{
						height: '100%',
						width: `${progress}%`,
						background: `linear-gradient(90deg, ${slide.color}cc, ${slide.color})`,
						boxShadow: `0 0 8px ${slide.color}`,
					}}
				/>
			</div>

			{/* Dot indicators */}
			<div
				style={{
					position: 'absolute',
					bottom: 28,
					left: '50%',
					transform: 'translateX(-50%)',
					display: 'flex',
					gap: 10,
					alignItems: 'center',
				}}
			>
				{slides.map((_, i) => (
					<div
						key={i}
						style={{
							width: i === slideIndex ? 30 : 9,
							height: 9,
							borderRadius: 4.5,
							backgroundColor:
								i === slideIndex ? slide.color : 'rgba(255,255,255,0.18)',
							boxShadow: i === slideIndex ? `0 0 8px ${slide.color}` : 'none',
							transition: 'all 0.3s',
						}}
					/>
				))}
			</div>
		</AbsoluteFill>
	);
};

export const KloudesimSlides: React.FC = () => {
	return (
		<AbsoluteFill style={{background: '#08060f'}}>
			{slides.map((slide, index) => (
				<Sequence
					key={index}
					from={index * SLIDE_DURATION}
					durationInFrames={SLIDE_DURATION}
				>
					<Slide slide={slide} slideIndex={index} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
