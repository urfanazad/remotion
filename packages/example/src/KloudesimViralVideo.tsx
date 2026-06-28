import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	OffthreadVideo,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

// ─── timing constants ─────────────────────────────────────────────────────────
const HOOK_START = 0;
const HOOK_END = 60;

const PROBLEM_START = 60;
const PROBLEM_END = 140;

const SOLUTION_START = 140;
const SOLUTION_END = 225;

const FEATURE1_START = 225;
const FEATURE1_END = 310;

const FEATURE2_START = 310;
const FEATURE2_END = 390;

const FEATURE3_START = 390;
const FEATURE3_END = 470;

const FEATURE4_START = 470;
const FEATURE4_END = 550;

const STATS_START = 550;
const STATS_END = 650;

const CTA_START = 650;
export const KLOUDESIM_VIRAL_DURATION = 780;

// ─── palette ──────────────────────────────────────────────────────────────────
const BRAND = '#00e5ff';
const BRAND2 = '#7c4dff';
const WARN = '#ff6b35';
const SUCCESS = '#00e676';
const GOLD = '#ffd600';

// ─── helpers ──────────────────────────────────────────────────────────────────
function clamp(x: number, lo: number, hi: number) {
	return Math.max(lo, Math.min(hi, x));
}
function fadeIn(frame: number, start: number, dur = 12) {
	return clamp((frame - start) / dur, 0, 1);
}
function fadeOut(frame: number, end: number, dur = 12) {
	return 1 - clamp((frame - (end - dur)) / dur, 0, 1);
}
function slideUp(
	frame: number,
	fps: number,
	start: number,
	cfg = {damping: 18, stiffness: 140},
) {
	const s = spring({frame: frame - start, fps, config: cfg});
	return interpolate(s, [0, 1], [60, 0]);
}

// ─── Phone device mockup wrapping a video ────────────────────────────────────
const PhoneMockup: React.FC<{
	src: string;
	width?: number;
	startFrom?: number;
}> = ({src, width = 280, startFrom = 0}) => {
	const height = Math.round(width * 2.16);
	const bezel = Math.round(width * 0.06);
	const notchW = Math.round(width * 0.3);
	const notchH = Math.round(width * 0.07);

	return (
		<div
			style={{
				width,
				height,
				borderRadius: Math.round(width * 0.12),
				background: '#111',
				border: `${bezel}px solid #2a2a2a`,
				boxShadow: `0 0 0 1px #444, 0 20px 60px rgba(0,0,0,0.7), 0 0 40px ${BRAND}33`,
				position: 'relative',
				overflow: 'hidden',
				flexShrink: 0,
			}}
		>
			{/* screen video */}
			<OffthreadVideo
				src={src}
				startFrom={startFrom}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
				}}
				muted
			/>

			{/* glass sheen */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)',
					pointerEvents: 'none',
				}}
			/>

			{/* notch */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: '50%',
					transform: 'translateX(-50%)',
					width: notchW,
					height: notchH,
					background: '#111',
					borderBottomLeftRadius: 8,
					borderBottomRightRadius: 8,
				}}
			/>
		</div>
	);
};

// ─── floating particles ───────────────────────────────────────────────────────
const Particles: React.FC<{color: string; frame: number; count?: number}> = ({
	color,
	frame,
	count = 18,
}) => (
	<>
		{Array.from({length: count}).map((_, i) => {
			const seed = i * 137.5;
			const x = (seed * 3.7) % 100;
			const baseY = (seed * 6.1) % 100;
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

// ─── kloudesim watermark ──────────────────────────────────────────────────────
const Watermark: React.FC<{accent: string}> = ({accent}) => (
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
			opacity: 0.88,
		}}
	>
		<div
			style={{
				width: 8,
				height: 8,
				borderRadius: '50%',
				background: accent,
				boxShadow: `0 0 10px ${accent}`,
			}}
		/>
		<span
			style={{
				color: '#fff',
				fontSize: 28,
				fontWeight: 700,
				fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
			}}
		>
			kloudesim<span style={{color: accent}}>.com</span>
		</span>
	</div>
);

// ─── Scene 1: HOOK  (phone.mp4 as hero b-roll) ───────────────────────────────
const HookScene: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
	const op = fadeIn(frame, HOOK_START, 10) * fadeOut(frame, HOOK_END);

	const line1Y = slideUp(frame, fps, HOOK_START + 5);
	const line1Op = fadeIn(frame, HOOK_START + 5);

	const line2Y = slideUp(frame, fps, HOOK_START + 20);
	const line2Op = fadeIn(frame, HOOK_START + 20);

	const phoneScale = spring({
		frame: frame - HOOK_START - 8,
		fps,
		config: {damping: 14, stiffness: 120},
	});
	const phoneOp = fadeIn(frame, HOOK_START + 8);

	return (
		<AbsoluteFill
			style={{
				opacity: op,
				overflow: 'hidden',
				fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
			}}
		>
			{/* full-bleed video background (phone.mp4) */}
			<OffthreadVideo
				src={staticFile('phone.mp4')}
				style={{
					position: 'absolute',
					inset: 0,
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					opacity: 0.18,
				}}
				muted
				loop
			/>

			{/* dark tinted gradient over the video */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'linear-gradient(160deg, #0a0012ee 0%, #160028ee 100%)',
				}}
			/>

			<Particles color={BRAND2} frame={frame} />

			{/* top accent */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 5,
					background: `linear-gradient(90deg, ${BRAND2}, transparent)`,
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
					gap: 32,
					padding: '0 64px',
				}}
			>
				{/* Phone mockup centrepiece */}
				<div
					style={{
						opacity: phoneOp,
						transform: `scale(${interpolate(phoneScale, [0, 1], [0.5, 1])}) translateY(${Math.sin((frame / 45) * Math.PI * 2) * 8}px)`,
					}}
				>
					<PhoneMockup src={staticFile('phone.mp4')} width={220} />
				</div>

				{/* "Are you STILL paying…" */}
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
							fontSize: 64,
							fontWeight: 900,
							lineHeight: 1.12,
							letterSpacing: -1,
						}}
					>
						Still using a
					</span>
					<br />
					<span
						style={{
							color: BRAND2,
							fontSize: 76,
							fontWeight: 900,
							lineHeight: 1.1,
							letterSpacing: -1,
							textShadow: `0 0 40px ${BRAND2}99`,
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
						border: `2px solid ${BRAND2}55`,
						borderRadius: 20,
						padding: '16px 36px',
					}}
				>
					<span
						style={{color: 'rgba(220,210,255,0.92)', fontSize: 34, fontWeight: 500}}
					>
						You&apos;re missing out on{' '}
						<span style={{color: GOLD, fontWeight: 800}}>massive savings</span>
					</span>
				</div>
			</div>

			<Watermark accent={BRAND2} />
		</AbsoluteFill>
	);
};

// ─── Scene 2: PROBLEM ─────────────────────────────────────────────────────────
const ProblemScene: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
	const op = fadeIn(frame, PROBLEM_START) * fadeOut(frame, PROBLEM_END);

	const titleY = slideUp(frame, fps, PROBLEM_START + 5);
	const titleOp = fadeIn(frame, PROBLEM_START + 5);

	const statRow = (icon: string, text: string, delay: number) => {
		const rowOp = fadeIn(frame, delay);
		const rowY = slideUp(frame, fps, delay);
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 20,
					opacity: rowOp,
					transform: `translateY(${rowY}px)`,
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
	};

	return (
		<AbsoluteFill style={{opacity: op, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: 'linear-gradient(160deg, #1a0500 0%, #0d0300 100%)',
				}}
			/>
			<Particles color={WARN} frame={frame} />
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 5,
					background: `linear-gradient(90deg, ${WARN}, transparent)`,
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
					gap: 24,
					fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
				}}
			>
				<div
					style={{
						opacity: titleOp,
						transform: `translateY(${titleY}px)`,
						textAlign: 'center',
						marginBottom: 8,
					}}
				>
					<span style={{color: WARN, fontSize: 52, fontWeight: 900}}>
						The Problem 💸
					</span>
				</div>
				{statRow('😤', 'Roaming costs up to $20/day abroad', PROBLEM_START + 22)}
				{statRow('⏳', 'Waiting days for a SIM to arrive', PROBLEM_START + 38)}
				{statRow('🌍', 'Locked into one carrier worldwide', PROBLEM_START + 54)}
			</div>

			<Watermark accent={WARN} />
		</AbsoluteFill>
	);
};

// ─── Scene 3: SOLUTION  (tablet.mp4 on the right, text on left) ───────────────
const SolutionScene: React.FC<{frame: number; fps: number}> = ({
	frame,
	fps,
}) => {
	const op = fadeIn(frame, SOLUTION_START) * fadeOut(frame, SOLUTION_END);

	const tabletSlide = spring({
		frame: frame - SOLUTION_START - 5,
		fps,
		config: {damping: 16, stiffness: 110},
	});
	const tabletX = interpolate(tabletSlide, [0, 1], [200, 0]);
	const tabletOp = fadeIn(frame, SOLUTION_START + 5);

	const textY = slideUp(frame, fps, SOLUTION_START + 18);
	const textOp = fadeIn(frame, SOLUTION_START + 18);

	const subY = slideUp(frame, fps, SOLUTION_START + 34);
	const subOp = fadeIn(frame, SOLUTION_START + 34);

	const floatY = Math.sin((frame / 40) * Math.PI * 2) * 10;

	return (
		<AbsoluteFill style={{opacity: op, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: 'linear-gradient(160deg, #001220 0%, #00060f 100%)',
				}}
			/>
			<Particles color={BRAND} frame={frame} />
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 5,
					background: `linear-gradient(90deg, ${BRAND}, transparent)`,
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
					gap: 36,
					fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
				}}
			>
				{/* headline */}
				<div
					style={{
						opacity: textOp,
						transform: `translateY(${textY}px)`,
						textAlign: 'center',
					}}
				>
					<span
						style={{
							color: '#fff',
							fontSize: 46,
							fontWeight: 700,
							opacity: 0.7,
							display: 'block',
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
							textShadow: `0 0 40px ${BRAND}88`,
						}}
					>
						eSIM
					</span>
				</div>

				{/* tablet mockup */}
				<div
					style={{
						opacity: tabletOp,
						transform: `translateX(${tabletX}px) translateY(${floatY}px)`,
					}}
				>
					<TabletMockup src={staticFile('tablet.mp4')} width={380} />
				</div>

				{/* subtitle */}
				<div
					style={{
						opacity: subOp,
						transform: `translateY(${subY}px)`,
						textAlign: 'center',
						background: `${BRAND}11`,
						border: `1.5px solid ${BRAND}44`,
						borderRadius: 20,
						padding: '18px 36px',
					}}
				>
					<span
						style={{
							color: 'rgba(190,240,255,0.9)',
							fontSize: 34,
							fontWeight: 400,
							lineHeight: 1.55,
						}}
					>
						A digital SIM built into your phone. No card, no waiting, no hassle.
					</span>
				</div>
			</div>

			<Watermark accent={BRAND} />
		</AbsoluteFill>
	);
};

// ─── Tablet mockup ─────────────────────────────────────────────────────────────
const TabletMockup: React.FC<{src: string; width?: number}> = ({
	src,
	width = 320,
}) => {
	const height = Math.round(width * 0.72);
	const bezel = Math.round(width * 0.04);

	return (
		<div
			style={{
				width,
				height,
				borderRadius: Math.round(width * 0.06),
				background: '#111',
				border: `${bezel}px solid #2a2a2a`,
				boxShadow: `0 0 0 1px #444, 0 20px 60px rgba(0,0,0,0.7), 0 0 40px ${BRAND}33`,
				position: 'relative',
				overflow: 'hidden',
				flexShrink: 0,
			}}
		>
			<OffthreadVideo
				src={src}
				style={{width: '100%', height: '100%', objectFit: 'cover'}}
				muted
			/>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
					pointerEvents: 'none',
				}}
			/>
		</div>
	);
};

// ─── Feature scene with optional b-roll background ────────────────────────────
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
	brollSrc?: string;
	brollOpacity?: number;
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
	brollSrc,
	brollOpacity = 0.22,
}) => {
	const op = fadeIn(frame, sceneStart) * fadeOut(frame, sceneEnd);

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
		<AbsoluteFill style={{opacity: op, overflow: 'hidden'}}>
			{/* tinted gradient */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: `linear-gradient(160deg, ${bg1} 0%, ${bg2} 100%)`,
				}}
			/>

			{/* optional b-roll video */}
			{brollSrc ? (
				<OffthreadVideo
					src={brollSrc}
					style={{
						position: 'absolute',
						inset: 0,
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						opacity: brollOpacity,
					}}
					muted
					loop
				/>
			) : null}

			{/* darken to keep text readable */}
			{brollSrc ? (
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: `${bg1}bb`,
					}}
				/>
			) : null}

			<Particles color={accentColor} frame={frame} />
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 5,
					background: `linear-gradient(90deg, ${accentColor}, transparent)`,
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
					fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
				}}
			>
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
						style={{color: accentColor, fontSize: 28, fontWeight: 800, letterSpacing: 1}}
					>
						{badge}
					</span>
				</div>

				<div
					style={{
						opacity: headOp,
						transform: `translateY(${headY}px)`,
						textAlign: 'center',
					}}
				>
					<span
						style={{color: '#fff', fontSize: 66, fontWeight: 900, lineHeight: 1.15, letterSpacing: -1}}
					>
						{headline}
					</span>
				</div>

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
							color: 'rgba(220,235,255,0.88)',
							fontSize: 34,
							fontWeight: 400,
							lineHeight: 1.6,
						}}
					>
						{body}
					</span>
				</div>
			</div>

			<Watermark accent={accentColor} />
		</AbsoluteFill>
	);
};

// ─── Scene 7: MULTI-PROFILE  — two phones side by side ───────────────────────
const MultiProfileScene: React.FC<{frame: number; fps: number}> = ({
	frame,
	fps,
}) => {
	const op = fadeIn(frame, FEATURE4_START) * fadeOut(frame, FEATURE4_END);

	const phone1S = spring({
		frame: frame - FEATURE4_START - 5,
		fps,
		config: {damping: 14, stiffness: 120},
	});
	const phone2S = spring({
		frame: frame - FEATURE4_START - 18,
		fps,
		config: {damping: 14, stiffness: 120},
	});
	const phoneOp = fadeIn(frame, FEATURE4_START + 5);

	const headY = slideUp(frame, fps, FEATURE4_START + 30);
	const headOp = fadeIn(frame, FEATURE4_START + 30);

	const bodyY = slideUp(frame, fps, FEATURE4_START + 44);
	const bodyOp = fadeIn(frame, FEATURE4_START + 44);

	const float1 = Math.sin((frame / 38) * Math.PI * 2) * 8;
	const float2 = Math.sin((frame / 38) * Math.PI * 2 + 1.2) * 8;

	return (
		<AbsoluteFill style={{opacity: op, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: 'linear-gradient(160deg, #150020 0%, #0a0014 100%)',
				}}
			/>
			<Particles color={BRAND2} frame={frame} />
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 5,
					background: `linear-gradient(90deg, ${BRAND2}, transparent)`,
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
					padding: '0 48px',
					gap: 32,
					fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
				}}
			>
				{/* two phones side-by-side */}
				<div
					style={{
						display: 'flex',
						gap: 28,
						alignItems: 'flex-end',
						opacity: phoneOp,
					}}
				>
					{/* personal SIM phone */}
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
						<div
							style={{
								transform: `scale(${interpolate(phone1S, [0, 1], [0.3, 1])}) translateY(${float1}px)`,
							}}
						>
							<PhoneMockup src={staticFile('phone.mp4')} width={190} startFrom={0} />
						</div>
						<div
							style={{
								background: `${SUCCESS}22`,
								border: `1.5px solid ${SUCCESS}88`,
								borderRadius: 12,
								padding: '6px 18px',
							}}
						>
							<span style={{color: SUCCESS, fontSize: 24, fontWeight: 700}}>
								🏠 Home SIM
							</span>
						</div>
					</div>

					{/* divider */}
					<div
						style={{
							width: 2,
							height: 320,
							background: `linear-gradient(180deg, transparent, ${BRAND2}88, transparent)`,
							marginBottom: 44,
						}}
					/>

					{/* travel SIM phone */}
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
						<div
							style={{
								transform: `scale(${interpolate(phone2S, [0, 1], [0.3, 1])}) translateY(${float2}px)`,
							}}
						>
							<PhoneMockup src={staticFile('phone.mp4')} width={190} startFrom={10} />
						</div>
						<div
							style={{
								background: `${BRAND}22`,
								border: `1.5px solid ${BRAND}88`,
								borderRadius: 12,
								padding: '6px 18px',
							}}
						>
							<span style={{color: BRAND, fontSize: 24, fontWeight: 700}}>
								✈️ Travel eSIM
							</span>
						</div>
					</div>
				</div>

				<div
					style={{opacity: headOp, transform: `translateY(${headY}px)`, textAlign: 'center'}}
				>
					<span style={{color: '#fff', fontSize: 62, fontWeight: 900, lineHeight: 1.15, letterSpacing: -1}}>
						Multiple plans,
						<br />
						<span style={{color: BRAND2}}>one device</span>
					</span>
				</div>

				<div
					style={{
						opacity: bodyOp,
						transform: `translateY(${bodyY}px)`,
						textAlign: 'center',
						background: `${BRAND2}0f`,
						border: `1.5px solid ${BRAND2}33`,
						borderRadius: 20,
						padding: '18px 32px',
						maxWidth: 860,
					}}
				>
					<span
						style={{color: 'rgba(220,210,255,0.88)', fontSize: 32, fontWeight: 400, lineHeight: 1.6}}
					>
						Keep your home number AND a local travel plan active simultaneously.
					</span>
				</div>
			</div>

			<Watermark accent={BRAND2} />
		</AbsoluteFill>
	);
};

// ─── Scene 8: STATS ───────────────────────────────────────────────────────────
const StatsScene: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
	const op = fadeIn(frame, STATS_START) * fadeOut(frame, STATS_END);

	const titleY = slideUp(frame, fps, STATS_START + 5);
	const titleOp = fadeIn(frame, STATS_START + 5);

	const stats = [
		{icon: '🌍', value: '190+', label: 'Countries covered', color: SUCCESS},
		{icon: '⚡', value: '<60s', label: 'To activate', color: BRAND},
		{icon: '💰', value: '90%', label: 'Cheaper than roaming', color: GOLD},
	];

	return (
		<AbsoluteFill style={{opacity: op, overflow: 'hidden'}}>
			{/* av1-bbb as subtle b-roll background in stats too */}
			<OffthreadVideo
				src={staticFile('av1-bbb.mp4')}
				style={{
					position: 'absolute',
					inset: 0,
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					opacity: 0.15,
				}}
				muted
				loop
			/>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: 'linear-gradient(160deg, #001a0ecc 0%, #000d07cc 100%)',
				}}
			/>
			<Particles color={SUCCESS} frame={frame} />
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 5,
					background: `linear-gradient(90deg, ${SUCCESS}, transparent)`,
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
					padding: '0 56px',
					gap: 36,
					fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
				}}
			>
				<div
					style={{opacity: titleOp, transform: `translateY(${titleY}px)`, textAlign: 'center'}}
				>
					<span style={{color: SUCCESS, fontSize: 52, fontWeight: 900}}>
						By the numbers 📊
					</span>
				</div>

				{stats.map(({icon, value, label, color}, i) => {
					const delay = STATS_START + 18 + i * 18;
					const rowOp = fadeIn(frame, delay);
					const rowY = slideUp(frame, fps, delay);
					const pulse = 0.7 + Math.sin((frame / 25 + i) * Math.PI * 2) * 0.3;

					return (
						<div
							key={i}
							style={{
								opacity: rowOp,
								transform: `translateY(${rowY}px)`,
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
										textShadow: `0 0 ${20 * pulse}px ${color}88`,
									}}
								>
									{value}
								</div>
								<div
									style={{color: 'rgba(200,235,215,0.8)', fontSize: 30, fontWeight: 500, marginTop: 4}}
								>
									{label}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<Watermark accent={SUCCESS} />
		</AbsoluteFill>
	);
};

// ─── Scene 9: CTA  (phone as hero + glowing orb) ─────────────────────────────
const CtaScene: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
	const op = fadeIn(frame, CTA_START, 15);
	const bgPulse = 0.5 + Math.sin((frame / 35) * Math.PI * 2) * 0.15;

	const phoneS = spring({
		frame: frame - CTA_START - 5,
		fps,
		config: {damping: 12, stiffness: 130},
	});
	const phoneOp = fadeIn(frame, CTA_START + 5);

	const line1Y = slideUp(frame, fps, CTA_START + 22);
	const line1Op = fadeIn(frame, CTA_START + 22);

	const line2Y = slideUp(frame, fps, CTA_START + 36);
	const line2Op = fadeIn(frame, CTA_START + 36);

	const btnS = spring({
		frame: frame - CTA_START - 54,
		fps,
		config: {damping: 10, stiffness: 200},
	});
	const btnOp = fadeIn(frame, CTA_START + 54);
	const btnPulse = 1 + Math.sin((frame / 20) * Math.PI * 2) * 0.025;

	const floatY = Math.sin((frame / 42) * Math.PI * 2) * 10;

	return (
		<AbsoluteFill style={{opacity: op, overflow: 'hidden'}}>
			{/* animated radial bg */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: `radial-gradient(ellipse at 50% 30%, ${BRAND}${Math.round(bgPulse * 30).toString(16).padStart(2, '0')} 0%, #001830 45%, #000810 100%)`,
				}}
			/>

			{/* glow orb */}
			<div
				style={{
					position: 'absolute',
					top: '22%',
					left: '50%',
					transform: 'translate(-50%,-50%)',
					width: 500,
					height: 500,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${BRAND}${Math.round(bgPulse * 50).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
					filter: 'blur(40px)',
					pointerEvents: 'none',
				}}
			/>

			<Particles color={BRAND} frame={frame} count={28} />

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
					fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
				}}
			>
				{/* phone hero */}
				<div
					style={{
						opacity: phoneOp,
						transform: `scale(${interpolate(phoneS, [0, 1], [0.4, 1])}) translateY(${floatY}px)`,
					}}
				>
					<PhoneMockup src={staticFile('phone.mp4')} width={240} />
				</div>

				{/* brand */}
				<div
					style={{display: 'flex', alignItems: 'center', gap: 14, opacity: line1Op}}
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
					<span style={{color: '#fff', fontSize: 52, fontWeight: 800}}>
						kloudesim<span style={{color: BRAND}}>.com</span>
					</span>
				</div>

				{/* tagline */}
				<div
					style={{
						opacity: line1Op,
						transform: `translateY(${line1Y}px)`,
						textAlign: 'center',
					}}
				>
					<span
						style={{color: '#fff', fontSize: 64, fontWeight: 900, lineHeight: 1.15, letterSpacing: -1}}
					>
						Travel smarter.
						<br />
						<span style={{color: BRAND}}>Pay less.</span>
					</span>
				</div>

				<div
					style={{opacity: line2Op, transform: `translateY(${line2Y}px)`, textAlign: 'center'}}
				>
					<span style={{color: 'rgba(180,235,255,0.85)', fontSize: 32, fontWeight: 400, lineHeight: 1.6}}>
						Join thousands of smart travelers who&apos;ve switched to eSIM.
					</span>
				</div>

				{/* CTA button */}
				<div
					style={{
						opacity: btnOp,
						transform: `scale(${interpolate(btnS, [0, 1], [0.5, btnPulse])})`,
						background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND2} 100%)`,
						borderRadius: 100,
						padding: '28px 72px',
						boxShadow: `0 0 40px ${BRAND}66, 0 12px 40px rgba(0,0,0,0.4)`,
					}}
				>
					<span style={{color: '#000', fontSize: 42, fontWeight: 900}}>
						Get Your eSIM Now →
					</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ─── Root composition ──────────────────────────────────────────────────────────
export const KloudesimViralVideo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{background: '#000'}}>
			<HookScene frame={frame} fps={fps} />
			<ProblemScene frame={frame} fps={fps} />
			<SolutionScene frame={frame} fps={fps} />

			{/* Coverage — av1-bbb.mp4 as travel b-roll background */}
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
				body="Activate a local data plan in seconds. No SIM swapping. No kiosk hunting."
				brollSrc={staticFile('av1-bbb.mp4')}
				brollOpacity={0.28}
			/>

			{/* Savings */}
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
				body="Stop getting shocked by international phone bills. Switch to local rates instantly."
			/>

			{/* Speed — phone.mp4 b-roll */}
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
				body="Scan a QR code, tap confirm, you're online. No shipping, no store visit."
				brollSrc={staticFile('phone.mp4')}
				brollOpacity={0.2}
			/>

			{/* Multi-profile — two phones side-by-side */}
			<MultiProfileScene frame={frame} fps={fps} />

			<StatsScene frame={frame} fps={fps} />
			<CtaScene frame={frame} fps={fps} />
		</AbsoluteFill>
	);
};
