document.addEventListener('DOMContentLoaded', () => {
	// ===== LOADER =====
	const loader = document.querySelector('.loader')
	setTimeout(() => {
		loader.classList.add('hidden')
		setTimeout(() => {
			loader.style.display = 'none'
		}, 800)
		launchConfetti()
	}, 2000)

	// ===== PETAL CANVAS =====
	const canvas = document.getElementById('petals-canvas')
	const ctx = canvas.getContext('2d')
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight

	window.addEventListener('resize', () => {
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
	})

	class Petal {
		constructor() {
			this.reset()
		}
		reset() {
			this.x = Math.random() * canvas.width
			this.y = -20 - Math.random() * 100
			this.size = 8 + Math.random() * 12
			this.speedY = 0.5 + Math.random() * 1.5
			this.speedX = -0.5 + Math.random() * 1
			this.rotation = Math.random() * Math.PI * 2
			this.rotSpeed = -0.02 + Math.random() * 0.04
			this.opacity = 0.3 + Math.random() * 0.5
			this.wobble = Math.random() * Math.PI * 2
			this.wobbleSpeed = 0.02 + Math.random() * 0.03
			const colors = [
				'#ffb6c1',
				'#ff69b4',
				'#ff1493',
				'#db7093',
				'#ffc0cb',
				'#e8a0bf',
				'#d4a0d4',
			]
			this.color = colors[Math.floor(Math.random() * colors.length)]
		}
		update() {
			this.y += this.speedY
			this.wobble += this.wobbleSpeed
			this.x += this.speedX + Math.sin(this.wobble) * 0.5
			this.rotation += this.rotSpeed
			if (this.y > canvas.height + 20) this.reset()
		}
		draw() {
			ctx.save()
			ctx.translate(this.x, this.y)
			ctx.rotate(this.rotation)
			ctx.globalAlpha = this.opacity
			ctx.fillStyle = this.color
			ctx.beginPath()
			ctx.ellipse(0, 0, this.size * 0.6, this.size, 0, 0, Math.PI * 2)
			ctx.fill()
			ctx.beginPath()
			ctx.ellipse(
				this.size * 0.3,
				-this.size * 0.2,
				this.size * 0.4,
				this.size * 0.7,
				0.5,
				0,
				Math.PI * 2,
			)
			ctx.fill()
			ctx.restore()
		}
	}

	const petals = []
	const petalCount = window.innerWidth < 768 ? 20 : 40
	for (let i = 0; i < petalCount; i++) {
		const p = new Petal()
		p.y = Math.random() * canvas.height
		petals.push(p)
	}

	function animatePetals() {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		petals.forEach(p => {
			p.update()
			p.draw()
		})
		requestAnimationFrame(animatePetals)
	}
	animatePetals()

	// ===== SCROLL ANIMATIONS =====
	const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
	const observer = new IntersectionObserver(entries => {
		entries.forEach((entry, i) => {
			if (entry.isIntersecting) {
				setTimeout(() => {
					entry.target.classList.add('visible')
				}, i * 150)
			}
		})
	}, observerOptions)

	document
		.querySelectorAll('.person-card, .wish-card, .gallery-item')
		.forEach(el => {
			observer.observe(el)
		})

	// ===== NAV DOTS =====
	const sections = document.querySelectorAll('section[id], .hero')
	const dots = document.querySelectorAll('.nav-dot')

	window.addEventListener('scroll', () => {
		let current = 0
		sections.forEach((section, i) => {
			const top = section.offsetTop - 300
			if (window.scrollY >= top) current = i
		})
		dots.forEach(d => d.classList.remove('active'))
		if (dots[current]) dots[current].classList.add('active')
	})

	dots.forEach((dot, i) => {
		dot.addEventListener('click', () => {
			sections[i]?.scrollIntoView({ behavior: 'smooth' })
		})
	})

	// ===== SPARKLE ON MOUSE MOVE =====
	let lastSparkle = 0
	document.addEventListener('mousemove', e => {
		const now = Date.now()
		if (now - lastSparkle < 100) return
		lastSparkle = now
		const sparkle = document.createElement('div')
		sparkle.className = 'sparkle'
		sparkle.textContent = ['✨', '💖', '🌸', '⭐', '💕'][
			Math.floor(Math.random() * 5)
		]
		sparkle.style.left = e.clientX + 'px'
		sparkle.style.top = e.clientY + 'px'
		document.body.appendChild(sparkle)
		setTimeout(() => sparkle.remove(), 800)
	})

	// ===== HEART CLICK EXPLOSION =====
	const bigHeart = document.querySelector('.big-heart')
	if (bigHeart) {
		bigHeart.addEventListener('click', () => {
			for (let i = 0; i < 20; i++) {
				const heart = document.createElement('div')
				heart.textContent = ['❤️', '💖', '💕', '💗', '🌹', '🌸'][
					Math.floor(Math.random() * 6)
				]
				heart.style.cssText = `
          position: fixed;
          left: ${bigHeart.getBoundingClientRect().left + bigHeart.offsetWidth / 2}px;
          top: ${bigHeart.getBoundingClientRect().top + bigHeart.offsetHeight / 2}px;
          font-size: ${1 + Math.random() * 2}rem;
          pointer-events: none;
          z-index: 99999;
          transition: all 1.5s ease;
        `
				document.body.appendChild(heart)
				requestAnimationFrame(() => {
					heart.style.left = `${parseFloat(heart.style.left) + (-150 + Math.random() * 300)}px`
					heart.style.top = `${parseFloat(heart.style.top) + (-200 + Math.random() * -100)}px`
					heart.style.opacity = '0'
					heart.style.transform = `scale(${0.5 + Math.random()}) rotate(${Math.random() * 360}deg)`
				})
				setTimeout(() => heart.remove(), 1500)
			}
			launchConfetti()
		})
	}

	// ===== CONFETTI =====
	function launchConfetti() {
		const container = document.querySelector('.confetti-container')
		const colors = [
			'#ff6b9d',
			'#c44dff',
			'#ff4081',
			'#ffd54f',
			'#69f0ae',
			'#40c4ff',
			'#ff8a65',
			'#e040fb',
		]
		for (let i = 0; i < 60; i++) {
			const piece = document.createElement('div')
			piece.className = 'confetti-piece'
			const size = 6 + Math.random() * 10
			const shapes = ['50%', '0%']
			piece.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size * (0.5 + Math.random())}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${shapes[Math.floor(Math.random() * 2)]};
        animation-duration: ${2 + Math.random() * 3}s;
        animation-delay: ${Math.random() * 0.5}s;
      `
			container.appendChild(piece)
			setTimeout(() => piece.remove(), 5000)
		}
	}

	// ===== MINI HEARTS ANIMATION =====
	function createMiniHearts() {
		const container = document.querySelector('.mini-hearts')
		if (!container) return
		setInterval(() => {
			const heart = document.createElement('div')
			heart.className = 'mini-heart'
			heart.textContent = ['💖', '💗', '💕', '❤️', '🩷'][
				Math.floor(Math.random() * 5)
			]
			heart.style.left = 10 + Math.random() * 80 + '%'
			heart.style.bottom = '0'
			heart.style.animationDuration = 3 + Math.random() * 3 + 's'
			heart.style.fontSize = 0.8 + Math.random() * 1.5 + 'rem'
			container.appendChild(heart)
			setTimeout(() => heart.remove(), 6000)
		}, 400)
	}
	createMiniHearts()

	// ===== TYPEWRITER EFFECT =====
	const typeEl = document.querySelector('.typewriter')
	if (typeEl) {
		const text = typeEl.getAttribute('data-text')
		typeEl.textContent = ''
		let i = 0
		function typeChar() {
			if (i < text.length) {
				typeEl.textContent += text[i]
				i++
				setTimeout(typeChar, 60)
			}
		}
		setTimeout(typeChar, 2500)
	}

	// ===== PARALLAX EFFECT ON HERO =====
	window.addEventListener('scroll', () => {
		const hero = document.querySelector('.hero-content')
		if (hero) {
			const scrolled = window.scrollY
			hero.style.transform = `translateY(${scrolled * 0.3}px)`
			hero.style.opacity = 1 - scrolled / 600
		}
	})

	// ===== SMOOTH SCROLL INDICATOR =====
	const scrollInd = document.querySelector('.scroll-indicator')
	if (scrollInd) {
		scrollInd.addEventListener('click', () => {
			document
				.querySelector('#congratulations')
				?.scrollIntoView({ behavior: 'smooth' })
		})
	}

	// ===== COUNTER ANIMATION =====
	function animateValue(el, start, end, duration) {
		let startTime = null
		function animate(currentTime) {
			if (!startTime) startTime = currentTime
			const progress = Math.min((currentTime - startTime) / duration, 1)
			el.textContent = Math.floor(progress * (end - start) + start)
			if (progress < 1) requestAnimationFrame(animate)
		}
		requestAnimationFrame(animate)
	}

	// ===== CARD TILT ON HOVER =====
	document.querySelectorAll('.person-card').forEach(card => {
		card.addEventListener('mousemove', e => {
			const rect = card.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top
			const centerX = rect.width / 2
			const centerY = rect.height / 2
			const rotateX = (y - centerY) / 20
			const rotateY = (centerX - x) / 20
			card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`
		})
		card.addEventListener('mouseleave', () => {
			card.style.transform = ''
		})
	})
})
