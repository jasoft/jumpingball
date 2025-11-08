<script>
    import { onMount, onDestroy } from "svelte"
    import Phaser from "phaser"
    import { DEFAULT_CONFIG, PARAM_METADATA, MUSIC_LIBRARY, MUSIC_OPTIONS } from "./config"

    let game
    let restartHandle
    let controls = { ...DEFAULT_CONFIG }
    let musicSlider = Math.max(
        0,
        MUSIC_OPTIONS.findIndex((option) => option.key === controls.musicKey)
    )

    function initGame() {
        game?.destroy(true)
        const size = Math.min(window.innerWidth, window.innerHeight) * 0.8
        const dimension = Phaser.Math.Clamp(size, 420, 820)
        const scene = new BouncyOrbScene(controls)

        game = new Phaser.Game({
            type: Phaser.AUTO,
            parent: "phaser-stage",
            backgroundColor: "#03050f",
            transparent: true,
            scene: [scene],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: dimension,
                height: dimension,
            },
            physics: {
                default: "arcade",
            },
            audio: {
                noAudio: false,
            },
        })
    }

    function scheduleRestart() {
        clearTimeout(restartHandle)
        restartHandle = setTimeout(() => {
            initGame()
        }, 150)
    }

    function updateControl(key, rawValue) {
        const value = Number(rawValue)
        controls = { ...controls, [key]: value }
        scheduleRestart()
    }

    function updateMusic(index) {
        const idx = Number(index)
        musicSlider = idx
        const musicKey = MUSIC_OPTIONS[idx]?.key ?? MUSIC_OPTIONS[0].key
        controls = { ...controls, musicKey }
        scheduleRestart()
    }

    function formatValue(key, value) {
        if (key === "collisionCooldown") return `${Math.round(value)} ms`
        if (key === "minGravity") return `${Math.round(value)} px/s²`
        if (key === "beatLength" || key === "sustainExtra") return `${value.toFixed(2)} s`
        if (key === "noteGain") return value.toFixed(2)
        return value.toFixed(3)
    }

    onMount(() => {
        initGame()
        return () => {
            clearTimeout(restartHandle)
            game?.destroy(true)
            game = null
        }
    })

    onDestroy(() => {
        clearTimeout(restartHandle)
        game?.destroy(true)
        game = null
    })

    class BouncyOrbScene extends Phaser.Scene {
        constructor(settings = DEFAULT_CONFIG) {
            super("BouncyOrbScene")
            this.config = { ...DEFAULT_CONFIG, ...settings }
            this.center = new Phaser.Math.Vector2()
            this.playRadius = 0
            this.ballRadius = 0
            this.velocity = new Phaser.Math.Vector2(260, -220)
            this.hue = Phaser.Math.Between(0, 360)
            this.trailTexture = null
            this.trailPainter = null
            this.ball = null
            this.boundary = null
            this.ringImage = null
            this.tip = null
            this.particleEmitter = null
            this.audioCtx = null
            this.melodyIndex = 0
            this.currentFillColor = 0xffffff
            this.gravity = new Phaser.Math.Vector2(0, 0)
            this.isComplete = false
            this.collisionCooldown = 0
            this.melodySequence = MUSIC_LIBRARY[this.config.musicKey] ?? MUSIC_LIBRARY.twinkle ?? []
        }

        preload() {
            const glow = this.make.graphics({ x: 0, y: 0, add: false })
            glow.fillStyle(0xffffff, 1)
            glow.fillCircle(64, 64, 64)
            glow.generateTexture("glowDot", 128, 128)
            glow.destroy()

            const spark = this.make.graphics({ x: 0, y: 0, add: false })
            spark.fillStyle(0xffffff, 1)
            spark.fillCircle(16, 16, 16)
            spark.generateTexture("spark", 32, 32)
            spark.destroy()
        }

        create() {
            const shortEdge = Math.min(this.scale.width, this.scale.height)
            this.center.set(this.scale.width / 2, this.scale.height / 2)
            this.playRadius = shortEdge * this.config.playRadiusRatio
            this.ballRadius = shortEdge * this.config.initialBallRatio
            this.hue = Phaser.Math.Between(0, 360)
            this.gravity.set(0, Math.max(this.config.minGravity, this.playRadius * this.config.gravityScale))
            this.isComplete = false
            this.melodyIndex = 0
            this.collisionCooldown = 0
            this.melodySequence = MUSIC_LIBRARY[this.config.musicKey] ?? MUSIC_LIBRARY.twinkle ?? []

            this.createTrail()
            this.addParticles()
            this.drawBoundary()
            this.snapshotBoundaryTrail()
            this.createBall()
            this.addTextHints()

            this.input.once("pointerdown", () => this.resumeAudio(), this)
            this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
                this.trailTexture?.destroy()
                this.trailTexture = null
                this.particleEmitter?.destroy()
                this.particleEmitter = null
                this.trailPainter?.destroy()
                this.trailPainter = null
            })
        }

        addParticles() {
            const halo = this.add.image(this.center.x, this.center.y, "glowDot")
            halo.setScale((this.playRadius * 2.2) / 128)
            halo.setTint(0x142952)
            halo.setAlpha(0.25)

            this.particleEmitter?.destroy()
            this.particleEmitter = this.add.particles(this.center.x, this.center.y, "spark", {
                speed: { min: 10, max: 60 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.4, end: 0 },
                blendMode: "ADD",
                lifespan: { min: 2000, max: 4000 },
                frequency: 100,
                radial: true,
                alpha: { start: 0.2, end: 0 },
            })
        }

        drawBoundary() {
            this.boundary?.destroy()
            this.boundary = this.add.graphics()
            this.boundary.setDepth(1)

            this.ringImage?.destroy()
            this.ringImage = this.add.image(this.center.x, this.center.y, "glowDot")
            this.ringImage.setScale((this.playRadius * 2.1) / 128)
            this.ringImage.setTint(0x1b4c8f)
            this.ringImage.setAlpha(0.35)
            this.ringImage.setDepth(0)

            this.boundary.lineStyle(6, 0x000000, 0.9)
            this.boundary.strokeCircle(this.center.x, this.center.y, this.playRadius)
            this.boundary.lineStyle(2, 0x000000, 0.4)
            this.boundary.strokeCircle(this.center.x, this.center.y, this.playRadius - 4)
        }

        snapshotBoundaryTrail() {
            if (!this.trailTexture) return
            if (this.ringImage) {
                this.trailTexture.draw(this.ringImage)
            }
            if (this.boundary) {
                this.trailTexture.draw(this.boundary)
            }
        }

        createTrail() {
            this.trailTexture?.destroy()
            this.trailTexture = this.add.renderTexture(0, 0, this.scale.width, this.scale.height)
            this.trailTexture.setOrigin(0)
            this.trailTexture.setDepth(1.25)
            this.trailTexture.setBlendMode(Phaser.BlendModes.NORMAL)
            this.trailTexture.clear()

            if (!this.trailPainter) {
                this.trailPainter = this.add.graphics()
                this.trailPainter.setVisible(false)
            } else {
                this.trailPainter.clear()
            }
        }

        createBall() {
            this.ball = this.add.circle(this.center.x, this.center.y - this.playRadius * 0.3, this.ballRadius)
            this.ball.setStrokeStyle(3, 0x000000, 1)
            this.ball.setDepth(2)

            const angle = Phaser.Math.FloatBetween(20, 70)
            const speed = 260
            const sign = Phaser.Math.Between(0, 1) ? 1 : -1
            this.velocity.setToPolar(Phaser.Math.DEG_TO_RAD * angle, speed)
            this.velocity.x *= sign

            const initialFill = Phaser.Display.Color.HSLToColor(this.hue / 360, 0.85, 0.55).color
            this.currentFillColor = initialFill
            this.ball.setFillStyle(initialFill, 1)
            this.stampTrail()
        }

        addTextHints() {
            this.tip = this.add
                .text(this.scale.width / 2, this.scale.height - 32, "点击/触碰以激活音频", {
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "16px",
                    color: "#8ad8ff",
                })
                .setOrigin(0.5, 0.5)
                .setAlpha(0.8)
        }

        resumeAudio() {
            if (!this.audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext
                this.audioCtx = new AudioContext()
            }
            if (this.audioCtx.state === "suspended") {
                this.audioCtx.resume()
            }
            if (this.tip) {
                this.tweens.add({
                    targets: this.tip,
                    alpha: 0,
                    duration: 600,
                    ease: "Sine.easeInOut",
                })
            }
        }

        scheduleNote(ctx, freq, startTime, duration) {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.frequency.setValueAtTime(freq, startTime)
            osc.type = "sine"
            gain.gain.setValueAtTime(this.config.noteGain ?? 0.25, startTime)
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start(startTime)
            osc.stop(startTime + duration + 0.02)
        }

        playMelodySegment() {
            if (this.isComplete) return
            if (!this.audioCtx) {
                this.resumeAudio()
            }
            if (!this.audioCtx || !this.melodySequence.length) return

            const ctx = this.audioCtx
            const now = ctx.currentTime
            const beatLength = this.config.beatLength ?? 0.45
            const sequenceIndex = this.melodyIndex % this.melodySequence.length
            const { freq, beats } = this.melodySequence[sequenceIndex]
            const duration = beatLength * beats
            const sustain = duration + (this.config.sustainExtra ?? 0.8)
            this.scheduleNote(ctx, freq, now, sustain)
            this.melodyIndex = (this.melodyIndex + 1) % this.melodySequence.length
        }

        finishSimulation() {
            if (this.isComplete) return
            this.isComplete = true
            this.velocity.set(0, 0)
            this.gravity.set(0, 0)
            this.particleEmitter?.stop()
            this.collisionCooldown = Infinity
            this.stampTrail()
        }

        enlargeBall() {
            if (this.isComplete) return
            const maxRadius = this.playRadius
            const currentRatio = this.ballRadius / maxRadius
            const multiplier =
                currentRatio >= this.config.nearBoundaryRatio
                    ? this.config.nearBoundaryMultiplier
                    : this.config.normalMultiplier
            this.ballRadius = Math.min(this.ballRadius * multiplier, maxRadius)
            this.ball.setRadius(this.ballRadius)
            if (this.ballRadius >= maxRadius - this.config.placementPadding) {
                this.ball.setRadius(maxRadius)
                this.finishSimulation()
            }
        }

        reflectVelocity(normalX, normalY) {
            const dot = this.velocity.x * normalX + this.velocity.y * normalY
            this.velocity.x -= 2 * dot * normalX
            this.velocity.y -= 2 * dot * normalY
            this.velocity.scale(1.01)
        }

        flashBoundary() {
            if (this.boundary) {
                this.tweens.add({
                    targets: this.boundary,
                    alpha: { from: 1, to: 0.2 },
                    duration: 160,
                    ease: "Sine.easeOut",
                    yoyo: true,
                    onComplete: () => this.boundary?.setAlpha(1),
                })
            }
            this.spawnGlowPulse()
        }

        spawnGlowPulse() {
            if (!this.ringImage) return
            const baseScale = (this.playRadius * 2.15) / 128
            const pulse = this.add.image(this.center.x, this.center.y, "glowDot")
            pulse.setScale(baseScale)
            pulse.setTint(0x7ce9ff)
            pulse.setAlpha(0.4)
            pulse.setDepth(0.5)
            pulse.setBlendMode(Phaser.BlendModes.ADD)

            this.tweens.add({
                targets: pulse,
                scale: baseScale * 1.2,
                alpha: 0,
                duration: 220,
                ease: "Cubic.easeOut",
                onComplete: () => pulse.destroy(),
            })
        }

        stampTrail() {
            if (!this.trailTexture || !this.ball || !this.trailPainter) return
            this.trailPainter.clear()
            this.trailPainter.fillStyle(this.currentFillColor ?? 0xffffff, 1)
            this.trailPainter.fillCircle(this.ball.x, this.ball.y, this.ballRadius)
            this.trailTexture.draw(this.trailPainter)
        }

        updateBallColor(delta) {
            this.hue = (this.hue + delta * 0.04) % 360
            const fill = Phaser.Display.Color.HSLToColor(this.hue / 360, 0.85, 0.55).color
            this.currentFillColor = fill
            this.ball.setFillStyle(fill, 1)
            this.ball.setStrokeStyle(3, 0x000000, 1)
        }

        playMelodyIfNeeded() {
            if (this.collisionCooldown <= 0) {
                this.enlargeBall()
                this.flashBoundary()
                this.playMelodySegment()
                this.collisionCooldown = this.config.collisionCooldown
            }
        }

        update(time, delta) {
            if (!this.ball || this.isComplete) return

            const dt = delta / 1000
            this.collisionCooldown = Math.max(0, this.collisionCooldown - delta)
            this.velocity.x += this.gravity.x * dt
            this.velocity.y += this.gravity.y * dt

            const maxSpeed = this.playRadius * 3
            const currentSpeed = this.velocity.length()
            if (currentSpeed > maxSpeed) {
                this.velocity.scale(maxSpeed / currentSpeed)
            }

            this.ball.x += this.velocity.x * dt
            this.ball.y += this.velocity.y * dt

            const offsetX = this.ball.x - this.center.x
            const offsetY = this.ball.y - this.center.y
            const distance = Math.hypot(offsetX, offsetY)

            if (distance + this.ballRadius > this.playRadius) {
                const normalX = offsetX / distance
                const normalY = offsetY / distance
                const overlap = distance + this.ballRadius - this.playRadius
                this.ball.x -= normalX * overlap
                this.ball.y -= normalY * overlap

                this.reflectVelocity(normalX, normalY)
                const placementRadius = Math.max(0, this.playRadius - this.ballRadius - this.config.placementPadding)
                this.ball.x = this.center.x + normalX * placementRadius
                this.ball.y = this.center.y + normalY * placementRadius

                this.playMelodyIfNeeded()
            }

            this.stampTrail()
            this.updateBallColor(delta)
        }
    }

    const controlList = PARAM_METADATA.filter((item) => item.key in DEFAULT_CONFIG)
</script>

<main class="layout">
    <aside class="control-panel">
        <h2>参数调节</h2>
        {#each controlList as control}
            <label class="control">
                <span>
                    {control.label}: {formatValue(control.key, controls[control.key])}
                </span>
                <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={controls[control.key]}
                    on:input={(event) => updateControl(control.key, event.target.value)}
                />
                <small>{control.description}</small>
            </label>
        {/each}

        <div class="control">
            <span>音乐选择: {MUSIC_OPTIONS[musicSlider]?.label}</span>
            <input
                type="range"
                min="0"
                max={MUSIC_OPTIONS.length - 1}
                step="1"
                value={musicSlider}
                on:input={(event) => updateMusic(event.target.value)}
            />
            <small>《小星星》</small>
        </div>
    </aside>

    <section class="stage-area">
        <header class="intro">
            <h1>光影弹跳球</h1>
            <p>调整参数感受不同的物理节奏、音色与视觉效果，点击画面即可激活音频并让小球演奏选定的乐曲。</p>
        </header>
        <section id="phaser-stage" class="stage"></section>
    </section>
</main>

<style>
    :global(body) {
        margin: 0;
        min-height: 100vh;
        background: radial-gradient(circle at center, #111 0%, #050505 80%);
        color: #f2f2f2;
        font-family:
            "Inter",
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
    }

    main.layout {
        min-height: 100vh;
        display: flex;
        gap: 2rem;
        padding: 2rem clamp(1rem, 4vw, 3rem);
        box-sizing: border-box;
    }

    .control-panel {
        flex: 0 0 320px;
        background: rgba(7, 10, 20, 0.8);
        border-radius: 20px;
        padding: 1.5rem;
        box-shadow: 0 12px 40px rgba(5, 10, 30, 0.6);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .control-panel h2 {
        margin: 0 0 0.5rem;
        font-size: 1.2rem;
        letter-spacing: 0.08rem;
    }

    .control {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    .control span {
        font-size: 0.95rem;
    }

    .control input[type="range"] {
        width: 100%;
    }

    .control small {
        color: #9acdfd;
        font-size: 0.75rem;
    }

    .stage-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }

    .intro {
        text-align: center;
        max-width: 640px;
    }

    .intro h1 {
        margin: 0 0 0.4rem;
        font-size: clamp(1.8rem, 2.5vw, 2.8rem);
        letter-spacing: 0.2rem;
        color: #f6faff;
    }

    .intro p {
        margin: 0;
        color: #cde9ff;
        line-height: 1.6;
    }

    .stage {
        width: min(70vw, 820px);
        aspect-ratio: 1 / 1;
        border-radius: 32px;
        box-shadow: 0 20px 80px rgba(7, 15, 40, 0.8);
        background: radial-gradient(circle at center, rgba(10, 15, 40, 0.85), rgba(2, 4, 12, 0.95));
        padding: 1rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    :global(.stage canvas) {
        width: 100%;
        height: 100%;
        border-radius: 24px;
    }

    @media (max-width: 1080px) {
        main.layout {
            flex-direction: column;
            align-items: stretch;
        }

        .control-panel {
            flex: none;
            width: 100%;
        }

        .stage {
            width: min(90vw, 640px);
        }
    }
</style>
