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

const slides = [
	{
		icon: '📱',
		title: 'No Physical SIM Needed',
		description:
			'Switch carriers instantly without swapping cards. Your eSIM is embedded directly in your device.',
		color: '#6c63ff',
	},
	{
		icon: '⚡',
		title: 'Instant Activation',
		description:
			'Get connected in seconds. Activate your plan digitally — no waiting for a SIM card to arrive.',
		color: '#f7b731',
	},
	{
		icon: '🌍',
		title: 'Global Coverage',
		description:
			'Travel to 190+ countries with affordable local data rates. Stay connected wherever life takes you.',
		color: '#26de81',
	},
	{
		icon: '🔄',
		title: 'Multiple Profiles',
		description:
			'Store multiple carrier plans on one device. Seamlessly switch between personal and business lines.',
		color: '#45aaf2',
	},
	{
		icon: '💰',
		title: 'Save on Roaming',
		description:
			'Avoid expensive international roaming fees by switching to local data plans at local prices.',
		color: '#fd9644',
	},
	{
		icon: '🔒',
		title: 'Enhanced Security',
		description:
			"eSIMs can't be physically stolen or swapped. Your identity and connection stay safe at all times.",
		color: '#fc5c65',
	},
	{
		icon: '🌱',
		title: 'Eco-Friendly',
		description:
			'No plastic SIM cards. No packaging waste. A smarter, greener way to stay connected globally.',
		color: '#2bcbba',
	},
	{
		icon: '🚀',
		title: 'Future-Ready Technology',
		description:
			'eSIM is the global standard for next-gen devices. Be ahead of the curve with technology built for tomorrow.',
		color: '#a55eea',
	},
];

const Slide: React.FC<{
	slide: (typeof slides)[0];
	slideIndex: number;
}> = ({slide, slideIndex}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const iconScale = spring({
		frame,
		fps,
		config: {damping: 14, stiffness: 180},
		durationInFrames: 35,
	});

	const titleOpacity = interpolate(frame, [10, 30], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const titleY = interpolate(frame, [10, 30], [40, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const descOpacity = interpolate(frame, [25, 45], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const descY = interpolate(frame, [25, 45], [30, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const lineWidth = interpolate(frame, [30, 55], [0, 180], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(145deg, #0a0a1a 0%, #12122a 60%, #1a1040 100%)',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				fontFamily:
					'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
			}}
		>
			{/* Top bar accent */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 6,
					background: `linear-gradient(90deg, ${slide.color}, transparent)`,
				}}
			/>

			{/* Logo top-right */}
			<div
				style={{
					position: 'absolute',
					top: 48,
					right: 72,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
				}}
			>
				<div
					style={{
						width: 10,
						height: 10,
						borderRadius: '50%',
						backgroundColor: slide.color,
						boxShadow: `0 0 12px ${slide.color}`,
					}}
				/>
				<span
					style={{
						color: '#ffffff',
						fontSize: 30,
						fontWeight: 700,
						letterSpacing: 1,
					}}
				>
					kloudesim
					<span style={{color: slide.color}}>.com</span>
				</span>
			</div>

			{/* Slide number bottom-right */}
			<div
				style={{
					position: 'absolute',
					bottom: 48,
					right: 72,
					color: 'rgba(255,255,255,0.3)',
					fontSize: 24,
					fontWeight: 500,
				}}
			>
				{String(slideIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
			</div>

			{/* Dot indicators */}
			<div
				style={{
					position: 'absolute',
					bottom: 52,
					left: '50%',
					transform: 'translateX(-50%)',
					display: 'flex',
					gap: 10,
				}}
			>
				{slides.map((_, i) => (
					<div
						key={i}
						style={{
							width: i === slideIndex ? 28 : 10,
							height: 10,
							borderRadius: 5,
							backgroundColor:
								i === slideIndex ? slide.color : 'rgba(255,255,255,0.2)',
							transition: 'all 0.3s',
						}}
					/>
				))}
			</div>

			{/* Main content */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 36,
					maxWidth: 1100,
					padding: '0 80px',
					textAlign: 'center',
				}}
			>
				{/* Icon circle */}
				<div
					style={{
						width: 160,
						height: 160,
						borderRadius: '50%',
						background: `radial-gradient(circle, ${slide.color}22, ${slide.color}08)`,
						border: `2px solid ${slide.color}44`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 80,
						transform: `scale(${iconScale})`,
						boxShadow: `0 0 40px ${slide.color}33`,
					}}
				>
					{slide.icon}
				</div>

				{/* Title */}
				<div
					style={{
						color: '#ffffff',
						fontSize: 72,
						fontWeight: 800,
						lineHeight: 1.15,
						opacity: titleOpacity,
						transform: `translateY(${titleY}px)`,
						letterSpacing: -1,
					}}
				>
					{slide.title}
				</div>

				{/* Accent line */}
				<div
					style={{
						height: 4,
						width: lineWidth,
						borderRadius: 2,
						background: `linear-gradient(90deg, ${slide.color}, transparent)`,
					}}
				/>

				{/* Description */}
				<div
					style={{
						color: 'rgba(200, 210, 240, 0.85)',
						fontSize: 38,
						fontWeight: 400,
						lineHeight: 1.6,
						opacity: descOpacity,
						transform: `translateY(${descY}px)`,
						maxWidth: 900,
					}}
				>
					{slide.description}
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const KloudesimSlides: React.FC = () => {
	return (
		<AbsoluteFill style={{background: '#0a0a1a'}}>
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
