import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

// ─── timing constants ────────────────────────────────────────────────────────
// Scene boundaries (frames)
const HOOK_START = 0;
const HOOK_END = 55;

const PROBLEM_START = 55;
const PROBLEM_END = 130;

const SOLUTION_START = 130;
const SOLUTION_END = 205;

const FEATURE1_START = 205;
const FEATURE1_END = 280;

const FEATURE2_START = 280;
const FEATURE2_END = 355;

const FEATURE3_START = 355;
const FEATURE3_END = 430;

const FEATURE4_START = 430;
const FEATURE4_END = 505;

const STATS_START = 505;
const STATS_END = 600;

const CTA_START = 600;
export const KLOUDESIM_VIRAL_DURATION = 720;

// ─── palette ─────────────────────────────────────────────────────────────────
const BRAND = '#00e5ff';
const BRAND2 = '#7c4dff';
const WARN = '#ff6b35';
const SUCCESS = '#00e676';
const GOLD = '#ffd600';

// ─── tiny helpers ─────────────────────────────────────────────────────────────
function clamp(x: number, lo: number, hi: number) {
	return Math.max(lo, Math.min(hi, x));
}

function fadeIn(frame: number, start: number, dur = 12) {
	return clamp((frame - start) / dur, 0, 1);
}

function slideUp(
	frame: number,
	fps: number,
	start: number,
	config = {damping: 18, stiffness: 140},
) {
	const s = spring({frame: frame - start, fps, config});
	return interpolate(s, [0, 1], [60, 0]);
}

// ─── particle field ───────────────────────────────────────────────────────────
const Particles: React.FC<{color: string; frame: number; count?: number}> = ({
	color,
	frame,
	count = 18,
}) => {
	return (
		<>
			{Array.from({length: count}).map((_, i) => {
				const seed = i * 137.5;
				const x = ((seed * 3.7) % 100);
				const baseY = ((seed * 6.1) % 100);
				const speed = 0.15 + (i % 5) * 0.07;
				const y = ((baseY - frame * speed) % 100 + 100) % 100;
				const size = 2 + (i % 4);
				const opacity = 0.12 + (i % 6) * 0.06;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${x}%`,
							top: `${y}%`,
							width: size,
							height: size,
							borderRadius: '50%',
							background: color,
							opacity,
						}}
					/>
				);
			})}
		</>
	);
};

// ─── Scene wrapper ────────────────────────────────────────────────────────────
const Scene: React.FC<{
	sceneStart: number;
	sceneEnd: number;
	bg1: string;
	bg2: string;
	accentColor: string;
	frame: number;
	children: React.ReactNode;
}> = ({sceneStart, sceneEnd, bg1, bg2, accentColor, frame, children}) => {
	const globalFrame = frame;
	const opacity =
		fadeIn(globalFrame, sceneStart, 10) *
		(1 - fadeIn(globalFrame, sceneEnd - 12, 10));

	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(160deg, ${bg1} 0%, ${bg2} 100%)`,
				opacity,
				overflow: 'hidden',
			}}
		>
			<Particles color={accentColor} frame={frame} />

			{/* top accent stripe */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 5,
					background: `linear-gradient(90deg, ${accentColor}, ${accentColor}44)`,
				}}
			/>

			{children}

			{/* watermark */}
			<div
				style={{
					position: 'absolute',
					bottom: 52,
					left: 0,
					right: 0,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 8,
					opacity: 0.85,
				}}
			>
				<div
					style={{
						width: 8,
						height: 8,
						borderRadius: '50%',
						background: accentColor,
						boxShadow: `0 0 10px ${accentColor}`,
					}}
				/>
				<span
					style={{
						color: '#fff',
						fontSize: 28,
						fontWeight: 700,
						fontFamily:
							'-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
						letterSpacing: 0.5,
					}}
				>
					kloudesim<span style={{color: accentColor}}>.com</span>
				</span>
			</div>
		</AbsoluteFill>
	);
};

// ─── Scene 1: HOOK ────────────────────────────────────────────────────────────
const HookScene: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
	const local = frame - HOOK_START;

	const line1Y = slideUp(frame, fps, HOOK_START + 5);
	const line1Op = fadeIn(frame, HOOK_START + 5);

	const line2Y = slideUp(frame, fps, HOOK_START + 18);
	const line2Op = fadeIn(frame, HOOK_START + 18);

	const emojiScale = spring({
		frame: local - 30,
		fps,
		config: {damping: 8, stiffness: 250},
	});
	const emojiOp = fadeIn(frame, HOOK_START + 30);

	return (
		<Scene
			sceneStart={HOOK_START}
			sceneEnd={HOOK_END}
			bg1="#0a0012"
			bg2="#160028"
			accentColor={BRAND2}
			frame={frame}
		>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '0 60px',
					gap: 24,
					fontFamily:
						'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
				}}
			>
				{/* big emoji */}
				<div
					style={{
						fontSize: 130,
						opacity: emojiOp,
						transform: `scale(${interpolate(emojiScale, [0, 1], [0.3, 1])})`,
						filter: `drop-shadow(0 0 30px ${BRAND2}cc)`,
					}}
				>
					📵
				</div>

				<div
					style={{
						opacity: line1Op,
						transform: `translateY(${line1Y}px)`,
						textAlign: 'center',
					}}
				>
					<span
						style={{
							color: '#fff',
							fontSize: 72,
							fontWeight: 900,
							lineHeight: 1.1,
							display: 'block',
							letterSpacing: -1,
						}}
					>
						Still using a
					</span>
					<span
						style={{
							color: BRAND2,
							fontSize: 82,
							fontWeight: 900,
							lineHeight: 1.1,
							display: 'block',
							letterSpacing: -1,
						}}
					>
						physical SIM?
					</span>
				</div>

				<div
					style={{
						opacity: line2Op,
						transform: `translateY(${line2Y}px)`,
						textAlign: 'center',
						background: `${BRAND2}22`,
						border: `2px solid ${BRAND2}66`,
						borderRadius: 20,
						padding: '18px 36px',
					}}
				>
					<span
						style={{
							color: 'rgba(220,210,255,0.9)',
							fontSize: 36,
							fontWeight: 500,
							lineHeight: 1.5,
						}}
					>
						You're missing out on{' '}
						<span style={{color: GOLD, fontWeight: 800}}>
							massive savings
						</span>
					</span>
				</div>
			</div>
		</Scene>
	);
};

// ─── Scene 2: PROBLEM ─────────────────────────────────────────────────────────
const ProblemScene: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
	const titleY = slideUp(frame, fps, PROBLEM_START + 5);
	const titleOp = fadeIn(frame, PROBLEM_START + 5);

	const stat1Op = fadeIn(frame, PROBLEM_START + 20);
	const stat1Y = slideUp(frame, fps, PROBLEM_START + 20);

	const stat2Op = fadeIn(frame, PROBLEM_START + 35);
	const stat2Y = slideUp(frame, fps, PROBLEM_START + 35);

	const stat3Op = fadeIn(frame, PROBLEM_START + 50);
	const stat3Y = slideUp(frame, fps, PROBLEM_START + 50);

	const statRow = (
		icon: string,
		text: string,
		op: number,
		y: number,
	) => (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 20,
				opacity: op,
				transform: `translateY(${y}px)`,
				background: 'rgba(255,107,53,0.1)',
				border: '1.5px solid rgba(255,107,53,0.35)',
				borderRadius: 20,
				padding: '22px 32px',
				width: '100%',
			}}
		>
			<span style={{fontSize: 48}}>{icon}</span>
			<span
				style={{
					color: 'rgba(255,230,215,0.95)',
					fontSize: 34,
					fontWeight: 600,
					lineHeight: 1.4,
				}}
			>
				{text}
			</span>
		</div>
	);

	return (
		<Scene
			sceneStart={PROBLEM_START}
			sceneEnd={PROBLEM_END}
			bg1="#1a0500"
			bg2="#0d0300"
			accentColor={WARN}
			frame={frame}
		>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '0 60px',
					gap: 24,
					fontFamily:
						'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
				}}
			>
				<div
					style={{
						opacity: titleOp,
						transform: `translateY(${titleY}px)`,
						textAlign: 'center',
						marginBottom: 16,
					}}
				>
					<span
						style={{
							color: WARN,
							fontSize: 50,
							fontWeight: 900,
							letterSpacing: -0.5,
						}}
					>
						The Problem 💸
					</span>
				</div>

				{statRow('😤', 'Roaming costs up to $20/day abroad', stat1Op, stat1Y)}
				{statRow('⏳', 'Waiting days for a SIM to arrive', stat2Op, stat2Y)}
				{statRow('♻️', 'Plastic waste from disposable SIMs', stat3Op, stat3Y)}
			</div>
		</Scene>
	);
};

// ─── Scene 3: SOLUTION ────────────────────────────────────────────────────────
const SolutionScene: React.FC<{frame: number; fps: number}> = ({
	frame,
	fps,
}) => {
	const ringScale = spring({
		frame: frame - SOLUTION_START - 5,
		fps,
		config: {damping: 12, stiffness: 120},
	});
	const logoOp = fadeIn(frame, SOLUTION_START + 5);

	const taglineY = slideUp(frame, fps, SOLUTION_START + 22);
	const taglineOp = fadeIn(frame, SOLUTION_START + 22);

	const subtitleY = slideUp(frame, fps, SOLUTION_START + 36);
	const subtitleOp = fadeIn(frame, SOLUTION_START + 36);

	return (
		<Scene
			sceneStart={SOLUTION_START}
			sceneEnd={SOLUTION_END}
			bg1="#001220"
			bg2="#00060f"
			accentColor={BRAND}
			frame={frame}
		>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '0 60px',
					gap: 28,
					fontFamily:
						'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
				}}
			>
				{/* Animated logo rings */}
				<div
					style={{
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						opacity: logoOp,
					}}
				>
					{[220, 170, 120].map((size, i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								width: size,
								height: size,
								borderRadius: '50%',
								border: `2px solid ${BRAND}`,
								opacity: interpolate(ringScale, [0, 1], [0, 0.3 - i * 0.08]),
								transform: `scale(${interpolate(ringScale, [0, 1], [0.5, 1 + i * 0.05])})`,
							}}
						/>
					))}
					<div
						style={{
							width: 90,
							height: 90,
							borderRadius: '50%',
							background: `radial-gradient(circle, ${BRAND}44, ${BRAND}11)`,
							boxShadow: `0 0 40px ${BRAND}99`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 44,
							transform: `scale(${interpolate(ringScale, [0, 1], [0.3, 1])})`,
						}}
					>
						📶
					</div>
				</div>

				<div
					style={{
						opacity: taglineOp,
						transform: `translateY(${taglineY}px)`,
						textAlign: 'center',
					}}
				>
					<span
						style={{
							color: '#ffffff',
							fontSize: 44,
							fontWeight: 700,
							display: 'block',
							opacity: 0.7,
							marginBottom: 8,
						}}
					>
						The solution is
					</span>
					<span
						style={{
							color: BRAND,
							fontSize: 96,
							fontWeight: 900,
							lineHeight: 1,
							letterSpacing: -2,
							display: 'block',
							textShadow: `0 0 40px ${BRAND}99`,
						}}
					>
						eSIM
					</span>
				</div>

				<div
					style={{
						opacity: subtitleOp,
						transform: `translateY(${subtitleY}px)`,
						textAlign: 'center',
						background: `${BRAND}11`,
						border: `1.5px solid ${BRAND}44`,
						borderRadius: 20,
						padding: '20px 36px',
					}}
				>
					<span
						style={{
							color: 'rgba(190,240,255,0.9)',
							fontSize: 36,
							fontWeight: 500,
							lineHeight: 1.5,
						}}
					>
						A digital SIM built right into your phone — no card, no waiting, no
						hassle.
					</span>
				</div>
			</div>
		</Scene>
	);
};

// ─── Feature slide template ────────────────────────────────────────────────────
const FeatureScene: React.FC<{
	frame: number;
	fps: number;
	sceneStart: number;
	sceneEnd: number;
	bg1: string;
	bg2: string;
	accentColor: string;
	icon: string;
	badge: string;
	headline: string;
	body: string;
}> = ({
	frame,
	fps,
	sceneStart,
	sceneEnd,
	bg1,
	bg2,
	accentColor,
	icon,
	badge,
	headline,
	body,
}) => {
	const iconScale = spring({
		frame: frame - sceneStart - 4,
		fps,
		config: {damping: 10, stiffness: 220},
	});
	const iconOp = fadeIn(frame, sceneStart + 4);

	const headY = slideUp(frame, fps, sceneStart + 16);
	const headOp = fadeIn(frame, sceneStart + 16);

	const bodyY = slideUp(frame, fps, sceneStart + 28);
	const bodyOp = fadeIn(frame, sceneStart + 28);

	const badgeOp = fadeIn(frame, sceneStart + 8);
	const badgeScale = spring({
		frame: frame - sceneStart - 8,
		fps,
		config: {damping: 14, stiffness: 200},
	});

	const floatY = Math.sin((frame / 40) * Math.PI * 2) * 8;
	const glowSize = 30 + Math.sin((frame / 30) * Math.PI * 2) * 10;

	return (
		<Scene
			sceneStart={sceneStart}
			sceneEnd={sceneEnd}
			bg1={bg1}
			bg2={bg2}
			accentColor={accentColor}
			frame={frame}
		>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '0 60px',
					gap: 32,
					fontFamily:
						'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
				}}
			>
				{/* Icon */}
				<div
					style={{
						opacity: iconOp,
						transform: `scale(${interpolate(iconScale, [0, 1], [0.2, 1])}) translateY(${floatY}px)`,
						filter: `drop-shadow(0 0 ${glowSize}px ${accentColor}88)`,
						fontSize: 120,
					}}
				>
					{icon}
				</div>

				{/* Badge */}
				<div
					style={{
						opacity: badgeOp,
						transform: `scale(${interpolate(badgeScale, [0, 1], [0.5, 1])})`,
						background: `${accentColor}22`,
						border: `2px solid ${accentColor}`,
						borderRadius: 100,
						padding: '10px 32px',
					}}
				>
					<span
						style={{
							color: accentColor,
							fontSize: 28,
							fontWeight: 800,
							letterSpacing: 1,
						}}
					>
						{badge}
					</span>
				</div>

				{/* Headline */}
				<div
					style={{
						opacity: headOp,
						transform: `translateY(${headY}px)`,
						textAlign: 'center',
					}}
				>
					<span
						style={{
							color: '#ffffff',
							fontSize: 66,
							fontWeight: 900,
							lineHeight: 1.15,
							letterSpacing: -1,
						}}
					>
						{headline}
					</span>
				</div>

				{/* Body */}
				<div
					style={{
						opacity: bodyOp,
						transform: `translateY(${bodyY}px)`,
						textAlign: 'center',
						background: `${accentColor}0f`,
						border: `1.5px solid ${accentColor}33`,
						borderRadius: 20,
						padding: '20px 32px',
						maxWidth: 860,
					}}
				>
					<span
						style={{
							color: 'rgba(220, 235, 255, 0.88)',
							fontSize: 34,
							fontWeight: 400,
							lineHeight: 1.6,
						}}
					>
						{body}
					</span>
				</div>
			</div>
		</Scene>
	);
};

// ─── Scene 8: STATS ───────────────────────────────────────────────────────────
const StatsScene: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
	const titleY = slideUp(frame, fps, STATS_START + 5);
	const titleOp = fadeIn(frame, STATS_START + 5);

	const stats = [
		{icon: '🌍', value: '190+', label: 'Countries covered', color: SUCCESS},
		{icon: '⚡', value: '<60s', label: 'To activate', color: BRAND},
		{icon: '💰', value: '90%', label: 'Cheaper than roaming', color: GOLD},
	];

	return (
		<Scene
			sceneStart={STATS_START}
			sceneEnd={STATS_END}
			bg1="#001a0e"
			bg2="#000d07"
			accentColor={SUCCESS}
			frame={frame}
		>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '0 56px',
					gap: 36,
					fontFamily:
						'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
				}}
			>
				<div
					style={{
						opacity: titleOp,
						transform: `translateY(${titleY}px)`,
						textAlign: 'center',
					}}
				>
					<span
						style={{
							color: SUCCESS,
							fontSize: 52,
							fontWeight: 900,
						}}
					>
						By the numbers 📊
					</span>
				</div>

				{stats.map(({icon, value, label, color}, i) => {
					const delay = STATS_START + 18 + i * 16;
					const op = fadeIn(frame, delay);
					const y = slideUp(frame, fps, delay);
					const statPulse = 0.7 + Math.sin((frame / 25 + i) * Math.PI * 2) * 0.3;

					return (
						<div
							key={i}
							style={{
								opacity: op,
								transform: `translateY(${y}px)`,
								display: 'flex',
								alignItems: 'center',
								gap: 28,
								background: `${color}11`,
								border: `2px solid ${color}44`,
								borderRadius: 24,
								padding: '24px 36px',
								width: '100%',
							}}
						>
							<span style={{fontSize: 56}}>{icon}</span>
							<div>
								<div
									style={{
										color,
										fontSize: 68,
										fontWeight: 900,
										lineHeight: 1,
										textShadow: `0 0 ${20 * statPulse}px ${color}88`,
									}}
								>
									{value}
								</div>
								<div
									style={{
										color: 'rgba(200,235,215,0.8)',
										fontSize: 30,
										fontWeight: 500,
										marginTop: 4,
									}}
								>
									{label}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</Scene>
	);
};

// ─── Scene 9: CTA ─────────────────────────────────────────────────────────────
const CtaScene: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
	const local = frame - CTA_START;

	const bgPulse =
		0.5 + Math.sin((frame / 35) * Math.PI * 2) * 0.15;

	const logoScale = spring({
		frame: local - 5,
		fps,
		config: {damping: 12, stiffness: 160},
	});
	const logoOp = fadeIn(frame, CTA_START + 5);

	const line1Y = slideUp(frame, fps, CTA_START + 18);
	const line1Op = fadeIn(frame, CTA_START + 18);

	const line2Y = slideUp(frame, fps, CTA_START + 32);
	const line2Op = fadeIn(frame, CTA_START + 32);

	const btnScale = spring({
		frame: local - 50,
		fps,
		config: {damping: 10, stiffness: 200},
	});
	const btnOp = fadeIn(frame, CTA_START + 50);
	const btnPulse = 1 + Math.sin((frame / 20) * Math.PI * 2) * 0.025;

	const urlY = slideUp(frame, fps, CTA_START + 68);
	const urlOp = fadeIn(frame, CTA_START + 68);

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(ellipse at 50% 40%, ${BRAND}${Math.round(bgPulse * 30).toString(16).padStart(2, '0')} 0%, #001830 45%, #000810 100%)`,
				overflow: 'hidden',
				fontFamily:
					'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
			}}
		>
			<Particles color={BRAND} frame={frame} count={28} />

			{/* animated glow orb */}
			<div
				style={{
					position: 'absolute',
					top: '28%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 500,
					height: 500,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${BRAND}${Math.round(bgPulse * 55).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
					filter: 'blur(40px)',
					pointerEvents: 'none',
				}}
			/>

			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '0 60px',
					gap: 32,
				}}
			>
				{/* Brand logo */}
				<div
					style={{
						opacity: logoOp,
						transform: `scale(${interpolate(logoScale, [0, 1], [0.3, 1])})`,
						display: 'flex',
						alignItems: 'center',
						gap: 14,
					}}
				>
					<div
						style={{
							width: 14,
							height: 14,
							borderRadius: '50%',
							background: BRAND,
							boxShadow: `0 0 20px ${BRAND}, 0 0 40px ${BRAND}88`,
						}}
					/>
					<span
						style={{
							color: '#ffffff',
							fontSize: 52,
							fontWeight: 800,
							letterSpacing: 0.5,
						}}
					>
						kloudesim<span style={{color: BRAND}}>.com</span>
					</span>
				</div>

				{/* Headline */}
				<div
					style={{
						opacity: line1Op,
						transform: `translateY(${line1Y}px)`,
						textAlign: 'center',
					}}
				>
					<span
						style={{
							color: '#fff',
							fontSize: 68,
							fontWeight: 900,
							lineHeight: 1.15,
							letterSpacing: -1,
						}}
					>
						Travel smarter.
						<br />
						<span style={{color: BRAND}}>Pay less.</span>
					</span>
				</div>

				{/* Sub */}
				<div
					style={{
						opacity: line2Op,
						transform: `translateY(${line2Y}px)`,
						textAlign: 'center',
					}}
				>
					<span
						style={{
							color: 'rgba(180, 235, 255, 0.85)',
							fontSize: 34,
							fontWeight: 400,
							lineHeight: 1.6,
						}}
					>
						Join thousands of smart travelers who've switched to eSIM and never
						looked back.
					</span>
				</div>

				{/* CTA button */}
				<div
					style={{
						opacity: btnOp,
						transform: `scale(${interpolate(btnScale, [0, 1], [0.5, btnPulse])})`,
						background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND2} 100%)`,
						borderRadius: 100,
						padding: '28px 72px',
						boxShadow: `0 0 40px ${BRAND}66, 0 12px 40px rgba(0,0,0,0.4)`,
					}}
				>
					<span
						style={{
							color: '#000',
							fontSize: 42,
							fontWeight: 900,
							letterSpacing: 0.5,
						}}
					>
						Get Your eSIM Now →
					</span>
				</div>

				{/* URL */}
				<div
					style={{
						opacity: urlOp,
						transform: `translateY(${urlY}px)`,
					}}
				>
					<span
						style={{
							color: `${BRAND}cc`,
							fontSize: 30,
							fontWeight: 600,
							letterSpacing: 1,
						}}
					>
						kloudesim.com
					</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ─── Root composition ─────────────────────────────────────────────────────────
export const KloudesimViralVideo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{background: '#000'}}>
			<HookScene frame={frame} fps={fps} />
			<ProblemScene frame={frame} fps={fps} />
			<SolutionScene frame={frame} fps={fps} />
			<FeatureScene
				frame={frame}
				fps={fps}
				sceneStart={FEATURE1_START}
				sceneEnd={FEATURE1_END}
				bg1="#001320"
				bg2="#000a14"
				accentColor={BRAND}
				icon="🌍"
				badge="COVERAGE"
				headline="190+ countries at your fingertips"
				body="Activate a local data plan in seconds. No SIM swapping. No hunting for a kiosk at the airport."
			/>
			<FeatureScene
				frame={frame}
				fps={fps}
				sceneStart={FEATURE2_START}
				sceneEnd={FEATURE2_END}
				bg1="#0d1200"
				bg2="#060a00"
				accentColor={GOLD}
				icon="💰"
				badge="SAVINGS"
				headline="Up to 90% cheaper than roaming"
				body="Stop getting hit with shocking phone bills every time you travel. Switch to local rates instantly."
			/>
			<FeatureScene
				frame={frame}
				fps={fps}
				sceneStart={FEATURE3_START}
				sceneEnd={FEATURE3_END}
				bg1="#001a00"
				bg2="#000f00"
				accentColor={SUCCESS}
				icon="⚡"
				badge="INSTANT"
				headline="Activate in under 60 seconds"
				body="Scan a QR code, tap confirm, and you're online. No shipping wait, no store visit, no hassle."
			/>
			<FeatureScene
				frame={frame}
				fps={fps}
				sceneStart={FEATURE4_START}
				sceneEnd={FEATURE4_END}
				bg1="#150020"
				bg2="#0a0014"
				accentColor={BRAND2}
				icon="📱"
				badge="MULTI-PROFILE"
				headline="Multiple plans, one device"
				body="Keep your home number AND a local travel plan active simultaneously. Perfect for business travelers."
			/>
			<StatsScene frame={frame} fps={fps} />
			<CtaScene frame={frame} fps={fps} />
		</AbsoluteFill>
	);
};
