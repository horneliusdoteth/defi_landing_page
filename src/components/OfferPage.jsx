// OfferPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";


// Sample FAQ data
const faqsData = [
	{
		question: "Question 1",
		answer: "Answer to question 1 goes here. You can talk about the product works, etc.",
	},
	{
		question: "Question 2",
		answer: "Answer to question 2 goes here. Commonly asked questions, etc.",
	},
	{
		question: "Question 3",
		answer: "Answer to question 3 goes here. More clarifications about the offer.",
	},
];

export default function OfferPage() {
	const priceRef = useRef(null);
	const [focused, setFocused] = useState(false);

	// Framer Motion control for the Price & Features section
	const priceControls = useAnimation();

	// Intersection Observer to detect when Price & Features is in the viewport
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				// If the section is in the center, or fairly visible
				if (entry.isIntersecting) {
					// Trigger the "focus" animation
					setFocused(true);
					priceControls.start("focused");
				}
			},
			{
				root: null,
				threshold: 0.5, // Adjust if needed (0.5 means half of it must be visible)
			}
		);

		if (priceRef.current) {
			observer.observe(priceRef.current);
		}

		return () => {
			if (priceRef.current) observer.unobserve(priceRef.current);
		};
	}, [priceControls]);

	const scrollToPrice = () => {
		if (priceRef.current) {
			// Reset the “focused” state if user scrolls again
			setFocused(false);
			// Scroll into view smoothly
			priceRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
	};

	return (
		<div className="text-off-white w-full min-h-screen relative pt-12 md:pt-4">
			{/*
        1) HERO / ABOVE-THE-FOLD
         - One screen height (h-screen => 100vh)
         - We'll animate each item with Framer Motion
      */}
			<div className="w-full h-screen overflow-hidden flex flex-col items-center justify-center px-4">
				{/* HEADLINES container with stagger effect */}
				<motion.div
					className="text-center -mt-24 mb-4 space-y-4"
					initial="hidden"
					animate="show"
					variants={{
						hidden: { opacity: 1 }, // Start with everything ready to animate children
						show: {
							opacity: 1,
							transition: {
								// Stagger children by 0.2s each
								staggerChildren: 0.3,
							},
						},
					}}
				>
					{/* MAIN HEADLINE (drop down from top) */}
					<motion.h1
						className="
              font-extrabold
              bg-gradient-to-r from-blue-light to-blue-mid
              bg-clip-text text-transparent
              drop-shadow-lg shadow-white
              leading-tight tracking-tight
              mb-1
              text-[clamp(1.25rem,3vw,3rem)]
            "
						variants={{
							hidden: { opacity: 0, y: -200 }, // Start 50px above, invisible
							show: {
								opacity: 1,
								y: 0,
								transition: { duration: 1.2, ease: "easeOut" },
							},
						}}
					>
						Earn 25-75% APR <br className="hidden sm:block" />
						Using the Crypto You Already Hold
					</motion.h1>

					{/* SUB-HEADLINE #0 (small paragraph under main) => drop from top as well? Or fade in? */}
					<motion.p
						className="text-off-white/90 leading-snug text-[clamp(0.9rem,2vw,1.5rem)]"
						variants={{
							hidden: { opacity: 0, y: -200 },
							show: {
								opacity: 1,
								y: 0,
								transition: { duration: 1.2, ease: "easeOut" },
							},
						}}
					>
						Learn how to yield farm concentrated pools from DeFi professionals with a proven track
						record
					</motion.p>

					{/* SUBHEADLINE 1 (slide in from left) */}
					<motion.div
						className="space-y-1"
						variants={{
							hidden: { opacity: 0, x: 200 },
							show: {
								opacity: 1,
								x: 0,
								transition: { duration: 1.2, ease: "easeOut" },
							},
						}}
					>
						<h2
							className="
                font-bold drop-shadow-md
                text-off-white
                text-[clamp(1rem,2.5vw,2rem)]
              "
						>
							Replace your income and quit your job with Crypto Yield Farming
						</h2>
						<p
							className="
                text-off-white/80 leading-snug
                text-[clamp(0.8rem,2vw,1.25rem)]
              "
						>
							Earn 25-75% APR on your capital without losing your initial investment, even if you're
							new to yield farming or DeFi
						</p>
					</motion.div>

					{/* SUBHEADLINE 2 (slide in from right) */}
					<motion.div
						className="space-y-1"
						variants={{
							hidden: { opacity: 0, x: 200 },
							show: {
								opacity: 1,
								x: 0,
								transition: { duration: 1.2, ease: "easeOut" },
							},
						}}
					>
						<h3
							className="
                font-bold drop-shadow-md
                text-off-white
                text-[clamp(1rem,2.5vw,2rem)]
              "
						>
							Want to be financially free with passive crypto income?
						</h3>
						<p
							className="
                text-off-white/80 leading-snug
                text-[clamp(0.8rem,2vw,1.25rem)]
              "
						>
							Discover how to become a consistently profitable yield farmer earning 25-75% APR on
							your crypto portfolio
						</p>
					</motion.div>

					{/* SUBHEADLINE 3 (slide in from left again) */}
					<motion.div
						className="space-y-1"
						variants={{
							hidden: { opacity: 0, x: -200 },
							show: {
								opacity: 1,
								x: 0,
								transition: { duration: 1.2, ease: "easeOut" },
							},
						}}
					>
						<h3
							className="
                font-bold drop-shadow-md
                text-off-white
                text-[clamp(1rem,2.5vw,2rem)]
              "
						>
							Become a consistently profitable yield farmer and earn 25-75% APR on your Crypto
							Portfolio
						</h3>
						<p
							className="
                text-off-white/80 leading-snug
                text-[clamp(0.8rem,2vw,1.25rem)]
              "
						>
							Learn from DeFi professionals that have built and scaled multiple 6-figure portfolios
							in crypto
						</p>
					</motion.div>
				</motion.div>

				{/* VIDEO => from bottom */}
				<motion.div
					className="w-full max-w-3xl px-2 mt-16"
					initial={{ opacity: 0, y: 200 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1.2, ease: "easeOut", delay: 1.2 }}
					// Add a small delay so it appears after subheadline 3
				>
					<div className="bg-off-white/10 aspect-video flex items-center justify-center rounded-md shadow-md">
						<span className="text-off-white/60">[Video Sales Letter Placeholder]</span>
					</div>
				</motion.div>
			</div>

			{/*
        2) BELOW-THE-FOLD
        All unchanged except we import <motion> if we want more animations for these sections too
      */}
			<div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
				{/* PROOF (Profit & Loss) */}
				<section className="text-center">
					{/* 1) Center the heading by adding text-center on the section */}
					<h2 className="text-2xl font-semibold mb-4">Proof: Profit &amp; Loss</h2>

					{/* 2) Parent Motion.div with a stagger on its children */}
					<motion.div
						className="grid grid-cols-1 sm:grid-cols-2 gap-4"
						initial="hidden"
						whileInView="show" // or animate="show" if you want them to appear immediately
						viewport={{ once: true }}
						variants={{
							hidden: {},
							show: {
								transition: {
									staggerChildren: 0.3, // fade in one by one, each after 0.3s
								},
							},
						}}
					>
						{[1, 2, 3, 4].map((num) => (
							<motion.div
								key={num}
								className="bg-off-white/10 h-40 flex items-center justify-center rounded-md"
								variants={{
									hidden: { opacity: 0 },
									show: {
										opacity: 1,
										transition: { duration: 2.0, ease: "easeOut" },
									},
								}}
							>
								<span className="text-off-white/60">Screenshot {num}</span>
							</motion.div>
						))}
					</motion.div>
				</section>

				{/* SIGN UP BUTTON #1 */}
				<div className="text-center">
					<button
						onClick={scrollToPrice}
						className="bg-blue-light hover:bg-blue-mid px-6 py-3 text-lg rounded-md font-semibold tracking-wide shadow-sm active:scale-95 transition-transform"
					>
						Sign Up Now!
					</button>
				</div>

				{/* PROOF CASE STUDY + SHORT VIDEO */}
				<section className="space-y-4">
					<h3 className="text-xl font-semibold">Proof Case Study</h3>
					<p className="text-off-white/80">
						Written summary: Explain briefly how someone used the course and got results.
					</p>
					<div className="bg-off-white/10 w-full aspect-video flex items-center justify-center mb-4 rounded-md shadow-md">
						<span className="text-off-white/60">[Case Study Video Placeholder]</span>
					</div>
					<div className="text-center">
						<button
							onClick={scrollToPrice}
							className="bg-blue-light hover:bg-blue-mid px-6 py-3 text-lg rounded-md font-semibold tracking-wide shadow-sm active:scale-95 transition-transform"
						>
							Sign Up Now!
						</button>
					</div>
				</section>

				{/* COURSE MODULES */}
				<section>
					<h3 className="text-xl font-semibold mb-4">Course Modules</h3>
					<ul className="list-disc list-inside space-y-2 text-off-white/80">
						<li>How to set up DeFi wallets</li>
						<li>How to research profitable liquidity pools</li>
						<li>How to minimize impermanent loss</li>
						<li>... etc.</li>
					</ul>
				</section>

				{/* SIGN UP BUTTON #2 */}
				<div className="text-center">
					<button
						onClick={scrollToPrice}
						className="bg-blue-light hover:bg-blue-mid px-6 py-3 text-lg rounded-md font-semibold tracking-wide shadow-sm active:scale-95 transition-transform"
					>
						Sign Up Now!
					</button>
				</div>

				{/* MEET OUR TEAM */}
				<section className="space-y-6">
					<h3 className="text-xl font-semibold text-center">Meet Our Team</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Person 1 (Richard) */}
						<div className="bg-off-white/10 rounded p-4 flex flex-col items-center space-y-4">
							{/* Pfp with link */}
							<a
								href="https://x.com/richardnhsu"
								target="_blank"
								rel="noopener noreferrer"
								className="w-24 h-24 bg-off-white/5 rounded-full flex items-center justify-center overflow-hidden"
							>
								{/* If you have a real image for Richard, replace the <span> below */}
								<span className="text-off-white/60">Pfp 1</span>
							</a>
							{/* Name with link */}
							<a
								href="https://x.com/richardnhsu"
								target="_blank"
								rel="noopener noreferrer"
								className="text-lg font-semibold text-blue-200 hover:text-blue-300 transition-colors"
							>
								Richard Hsu
							</a>
							<p className="text-sm text-off-white/80">
								Short Bio: Expert in DeFi LP &amp; Yield Farming
							</p>
						</div>

						{/* Person 2 (Hornelius) */}
						<div className="bg-off-white/10 rounded p-4 flex flex-col items-center space-y-4">
							{/* Pfp with link */}
							<a
								href="https://x.com/horneliusdoteth"
								target="_blank"
								rel="noopener noreferrer"
								className="w-24 h-24 bg-off-white/5 rounded-full flex items-center justify-center overflow-hidden"
							>
								<img
									src="/src/assets/hornelius.png"
									alt="Hornelius"
									className="object-cover w-full h-full"
								/>
							</a>
							{/* Name with link */}
							<a
								href="https://x.com/horneliusdoteth"
								target="_blank"
								rel="noopener noreferrer"
								className="text-lg font-semibold text-blue-200 hover:text-blue-300 transition-colors"
							>
								Hornelius
							</a>
							<p className="text-sm text-off-white/80">
								Short Bio: Developer and yield-farming strategist
							</p>
						</div>
					</div>
				</section>

				{/* PRICE & FEATURES */}
				<motion.section
					ref={priceRef}
					className="bg-off-white/10 p-6 rounded-md space-y-4 shadow-md text-center"
					// Framer Motion props
					initial="idle"
					animate={priceControls}
					variants={{
						idle: { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" },
						focused: {
							scale: [1, 1.02, 1], // quick “pulse” effect
							boxShadow: [
								"0 0 0 rgba(0,0,0,0)",
								"0 0 20px rgba(255,255,255,0.4)",
								"0 0 0 rgba(0,0,0,0)",
							],
							transition: { duration: 2.5 },
						},
					}}
				>
					<h3 className="text-2xl font-bold">Price &amp; Features</h3>

					{/* Main price line */}
					<p className="text-xl">
						<span className="font-bold">$999</span> lifetime access to course
						<sup>*</sup>
					</p>
					<p className="text-md text-off-white/80">Learn how to XYZ</p>

					{/* Core bullet list with individual values 
      Wrap the <ul> in a div with inline-block 
      so bullets center nicely while still left-aligned inside. */}
					<div className="inline-block text-left">
						<ul className="list-disc list-inside text-off-white/80 space-y-1">
							<li>
								10-week online video course with step-by-step instructions{" "}
								<span className="text-off-white/50">($1500 value)</span>
							</li>
							<li>
								Time-saving, systematized sheets and templates{" "}
								<span className="text-off-white/50">($1000 value)</span>
							</li>
							<li>
								Concentrated Liquidity Pool mindmap{" "}
								<span className="text-off-white/50">($2500 value)</span>
							</li>
							<li>Future Course Updates</li>
						</ul>
					</div>

					{/* Bonus #1 */}
					<div className="space-y-1">
						<p className="font-semibold">
							Bonus #1: 12 months access to Drippy Plus{" "}
							<span className="text-off-white/50">
								($1188 value - renews at $99/month after 12 months)
							</span>
						</p>

						{/* Another inline-block to center bullets as well */}
						<div className="inline-block text-left">
							<ul className="list-disc list-inside text-off-white/80 space-y-1">
								<li>Exclusive live workshops and market updates</li>
								<li>Forum to ask questions and discuss topics</li>
								<li>Chat and connect with community members</li>
								<li>Master Pool Scanner - List of pools our team scans</li>
								<li>Master Thesis Builder - Thesis on tokens that our team researches</li>
							</ul>
						</div>
					</div>

					{/* Bonus #2 */}
					<div>
						<p className="font-semibold">
							Bonus #2: 1-hr 1-on-1 coaching call with Richard{" "}
							<span className="text-off-white/50">($250 value)</span>
						</p>
					</div>

					{/* Limited Offer Blurb */}
					<p className="text-sm text-off-white/60 max-w-xl mx-auto">
						This offer is limited to 50 members only.
						<br />
						Our course is in early-access stage and we want to offer limited spots to further
						improve our program before offering this product to a wider audience. This also means
						that you will be able to get more support directly from Richard before the community
						grows any larger.
					</p>

					{/* Unique CTA Button */}
					<div>
						<button
							className="
      bg-green-700 hover:bg-green-760 
      text-white font-semibold 
      px-8 py-3 text-lg rounded-full 
      tracking-wide shadow-md 
      active:scale-95 transition-transform
    "
						>
							Enroll Now!
						</button>
					</div>
				</motion.section>
				<br />
				<br />
				<br />

				{/* FAQ Section */}
				<FaqSection faqs={faqsData} />

				{/* DISCLAIMER */}
				<p className="text-sm text-off-white/60 text-center">
					Disclaimer: Results vary. This is not financial advice. Always do your own research.
				</p>
			</div>
		</div>
	);
}

// FAQ component unchanged
function FaqSection({ faqs }) {
	const [openIndex, setOpenIndex] = useState(null);

	const toggleFaq = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<section className="space-y-4 mt-16">
			<h3 className="text-xl font-semibold">FAQs (Handle Objections)</h3>
			<div className="space-y-2">
				{faqs.map((faq, idx) => (
					<div key={idx} className="bg-off-white/10 rounded">
						<button
							onClick={() => toggleFaq(idx)}
							className="w-full text-left px-4 py-3 flex justify-between items-center"
						>
							<span className="font-semibold">{faq.question}</span>
							<span>{openIndex === idx ? "-" : "+"}</span>
						</button>
						{openIndex === idx && <div className="px-4 pb-3 text-off-white/80">{faq.answer}</div>}
					</div>
				))}
			</div>
		</section>
	);
}
