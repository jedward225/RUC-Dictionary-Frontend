import * as THREE from 'three';

// 流行语数据
const slangData = [
    // 英文
    { word: "brat", origin: "English", meaning: "叛逆风格" },
    { word: "slay", origin: "English", meaning: "超级厉害" },
    { word: "vibe", origin: "English", meaning: "氛围感" },
    { word: "fire", origin: "English", meaning: "太酷了" },
    { word: "stan", origin: "English", meaning: "狂热粉丝" },
    { word: "lit", origin: "English", meaning: "超嗨的" },
    { word: "tea", origin: "English", meaning: "八卦消息" },
    { word: "flex", origin: "English", meaning: "秀一下" },
    { word: "ghost", origin: "English", meaning: "突然消失" },
    { word: "sus", origin: "English", meaning: "可疑的" },
    { word: "no cap", origin: "English", meaning: "不骗你" },
    { word: "bussin", origin: "English", meaning: "超好吃" },
    { word: "rizz", origin: "English", meaning: "魅力值" },
    { word: "era", origin: "English", meaning: "人生阶段" },
    { word: "ate", origin: "English", meaning: "太绝了" },
    { word: "bet", origin: "English", meaning: "没问题" },
    { word: "cap", origin: "English", meaning: "说谎" },
    { word: "lowkey", origin: "English", meaning: "有点儿" },
    { word: "highkey", origin: "English", meaning: "非常" },
    { word: "snatched", origin: "English", meaning: "好看极了" },
    { word: "periodt", origin: "English", meaning: "就这样" },
    { word: "iconic", origin: "English", meaning: "经典的" },
    { word: "valid", origin: "English", meaning: "合理的" },
    { word: "based", origin: "English", meaning: "有主见" },
    { word: "mid", origin: "English", meaning: "一般般" },
    { word: "L", origin: "English", meaning: "失败" },
    { word: "W", origin: "English", meaning: "胜利" },
    { word: "NPC", origin: "English", meaning: "路人" },
    { word: "main character", origin: "English", meaning: "主角" },
    // 中文
    { word: "YYDS", origin: "中文", meaning: "永远的神" },
    { word: "躺平", origin: "中文", meaning: "放弃内卷" },
    { word: "内卷", origin: "中文", meaning: "过度竞争" },
    { word: "绝绝子", origin: "中文", meaning: "太绝了" },
    { word: "破防", origin: "中文", meaning: "情绪触动" },
    { word: "凡尔赛", origin: "中文", meaning: "低调炫耀" },
    { word: "社恐", origin: "中文", meaning: "社交恐惧" },
    { word: "摆烂", origin: "中文", meaning: "放弃努力" },
    { word: "佛系", origin: "中文", meaning: "随缘心态" },
    { word: "芭比Q", origin: "中文", meaning: "完蛋了" },
    { word: "栓Q", origin: "中文", meaning: "无语了" },
    { word: "显眼包", origin: "中文", meaning: "爱出风头" },
    { word: "搭子", origin: "中文", meaning: "临时伙伴" },
    // 日语
    { word: "やばい", origin: "日本語", meaning: "不得了" },
    { word: "草", origin: "日本語", meaning: "笑死了" },
    { word: "推し", origin: "日本語", meaning: "最爱" },
    // 韩语
    { word: "대박", origin: "한국어", meaning: "太棒了" },
    { word: "헐", origin: "한국어", meaning: "天哪" },
    // 其他语言
    { word: "guay", origin: "Español", meaning: "很酷" },
    { word: "ouf", origin: "Français", meaning: "疯狂" },
    { word: "krass", origin: "Deutsch", meaning: "太猛了" },
];

// ==================== 背景星座网络 ====================
class StarfieldBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'bg-canvas';
        document.body.prepend(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.connections = [];
        this.mouse = { x: null, y: null };

        this.resize();
        this.createStars();
        this.setupEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStars() {
        const starCount = Math.floor((this.canvas.width * this.canvas.height) / 8000);
        this.stars = [];

        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.5 + 0.3
            });
        }
    }

    setupEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createStars();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新和绘制星星
        this.stars.forEach(star => {
            star.x += star.vx;
            star.y += star.vy;

            // 边界处理
            if (star.x < 0 || star.x > this.canvas.width) star.vx *= -1;
            if (star.y < 0 || star.y > this.canvas.height) star.vy *= -1;

            // 鼠标交互
            if (this.mouse.x !== null) {
                const dx = star.x - this.mouse.x;
                const dy = star.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    star.x += dx * 0.02;
                    star.y += dy * 0.02;
                }
            }

            // 绘制星星
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(147, 181, 207, ${star.alpha})`;
            this.ctx.fill();
        });

        // 绘制连线
        for (let i = 0; i < this.stars.length; i++) {
            for (let j = i + 1; j < this.stars.length; j++) {
                const dx = this.stars[i].x - this.stars[j].x;
                const dy = this.stars[i].y - this.stars[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const alpha = (1 - dist / 120) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.stars[i].x, this.stars[i].y);
                    this.ctx.lineTo(this.stars[j].x, this.stars[j].y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ==================== 3D 地球 ====================
class Globe3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.globeGroup = new THREE.Group();
        this.slangSprites = [];
        this.time = 0;

        // 交互状态
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.autoRotate = true;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.currentRotationX = 0;
        this.currentRotationY = 0;
        this.rotationVelocityX = 0;
        this.rotationVelocityY = 0;
        this.zoomTarget = 2.8;

        // Tooltip
        this.tooltip = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.init();
        this.createGlobe();
        this.createGlowingRings();
        this.createSlangRings();
        this.createTooltip();
        this.setupInteraction();
        this.animate();
        this.setupResize();
    }

    init() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = this.zoomTarget;
        this.scene.add(this.globeGroup);
    }

    createGlobe() {
        // 发光粒子球体
        const particles = 20000;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const radius = 1;

        for (let i = 0; i < particles; i++) {
            const phi = Math.acos(-1 + (2 * i) / particles);
            const theta = Math.sqrt(particles * Math.PI) * phi;

            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);

            if (Math.random() > 0.3) {
                positions.push(x, y, z);

                // 渐变颜色：从青色到蓝色
                const t = (y + 1) / 2; // 0到1
                colors.push(
                    0 + t * 0.58,      // R: 0 -> 147
                    0.83 - t * 0.12,   // G: 212 -> 181
                    1 - t * 0.19       // B: 255 -> 207
                );
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.008,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            sizeAttenuation: true,
            vertexColors: true
        });

        this.pointCloud = new THREE.Points(geometry, material);
        this.pointCloud.renderOrder = 1;
        this.globeGroup.add(this.pointCloud);

        // 半透明球体核心（用于点击检测和内发光效果）
        const sphereGeometry = new THREE.SphereGeometry(radius * 0.95, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x001d3d,
            transparent: true,
            opacity: 0.3,
            depthWrite: false
        });
        this.globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.globe.renderOrder = 0;
        this.globeGroup.add(this.globe);
    }

    createGlowingRings() {
        // 创建发光轨道环
        const ringConfigs = [
            { radius: 1.15, tilt: Math.PI / 6, color: 0x00d4ff, opacity: 0.4 },
            { radius: 1.25, tilt: -Math.PI / 8, color: 0x2474B5, opacity: 0.3 },
            { radius: 1.35, tilt: Math.PI / 4, color: 0x8A4B9C, opacity: 0.25 }
        ];

        this.rings = [];

        ringConfigs.forEach(config => {
            // 创建环形轨道
            const ringGeometry = new THREE.TorusGeometry(config.radius, 0.003, 16, 100);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: config.opacity,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2 + config.tilt;
            this.globeGroup.add(ring);
            this.rings.push(ring);

            // 在环上添加流动光点
            const dotCount = 50;
            const dotGeometry = new THREE.BufferGeometry();
            const dotPositions = [];

            for (let i = 0; i < dotCount; i++) {
                const angle = (i / dotCount) * Math.PI * 2;
                const x = Math.cos(angle) * config.radius;
                const z = Math.sin(angle) * config.radius;
                dotPositions.push(x, 0, z);
            }

            dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));

            const dotMaterial = new THREE.PointsMaterial({
                color: config.color,
                size: 0.02,
                transparent: true,
                opacity: config.opacity * 1.5,
                depthWrite: false
            });

            const dots = new THREE.Points(dotGeometry, dotMaterial);
            dots.rotation.x = Math.PI / 2 + config.tilt;
            dots.userData.rotationSpeed = 0.002 + Math.random() * 0.003;
            this.globeGroup.add(dots);
            this.rings.push(dots);
        });

        // 添加流星效果点
        this.createMeteorTrails();
    }

    createMeteorTrails() {
        // 创建几条流星轨迹
        const meteorCount = 3;
        this.meteors = [];

        for (let i = 0; i < meteorCount; i++) {
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-2, 1, -1),
                new THREE.Vector3(-0.5, 0.5, 0.5),
                new THREE.Vector3(0.5, -0.3, 1),
                new THREE.Vector3(2, -1, 0)
            ]);

            const points = curve.getPoints(50);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            // 创建渐变线条
            const colors = [];
            for (let j = 0; j < points.length; j++) {
                const t = j / points.length;
                colors.push(0, 0.83 * t, t); // 从透明到青色
            }
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

            const material = new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: 0.3
            });

            const meteor = new THREE.Line(geometry, material);
            meteor.rotation.y = (i / meteorCount) * Math.PI * 2;
            meteor.rotation.x = Math.random() * 0.5 - 0.25;
            this.globeGroup.add(meteor);
            this.meteors.push(meteor);
        }
    }

    createTextSprite(text, data) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;

        context.clearRect(0, 0, canvas.width, canvas.height);

        // 根据文字长度调整字体大小
        let fontSize = 26;
        if (text.length > 4) fontSize = 22;
        if (text.length > 6) fontSize = 18;

        context.font = `bold ${fontSize}px "Microsoft YaHei", "PingFang SC", sans-serif`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // 外发光效果 - 青色
        context.shadowColor = '#00d4ff';
        context.shadowBlur = 20;
        context.fillStyle = '#ffffff';
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        // 再画一次增强发光
        context.shadowBlur = 10;
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.9,
            depthTest: true,
            depthWrite: false
        });

        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(0.5, 0.125, 1);
        sprite.userData = {
            originalScale: { x: 0.5, y: 0.125, z: 1 },
            data: data,
            isAnimating: false,
            ringIndex: 0,
            wordIndex: 0,
            baseAngle: 0
        };

        return sprite;
    }

    createSlangRings() {
        const ringCount = 5;
        const globeRadius = 1;
        const orbitRadius = globeRadius + 0.2;

        for (let ring = 0; ring < ringCount; ring++) {
            const ringY = -0.7 + (ring / (ringCount - 1)) * 1.4;
            const horizontalRadius = Math.sqrt(orbitRadius * orbitRadius - ringY * ringY);
            const wordsPerRing = Math.max(6, Math.floor(10 * (horizontalRadius / orbitRadius)));

            for (let i = 0; i < wordsPerRing; i++) {
                const slangIndex = (ring * 8 + i) % slangData.length;
                const slang = slangData[slangIndex];

                const sprite = this.createTextSprite(slang.word, slang);

                const angle = (i / wordsPerRing) * Math.PI * 2;
                sprite.userData.ringIndex = ring;
                sprite.userData.wordIndex = i;
                sprite.userData.baseAngle = angle;
                sprite.userData.ringY = ringY;
                sprite.userData.horizontalRadius = horizontalRadius;
                sprite.userData.orbitRadius = orbitRadius;

                const x = Math.cos(angle) * horizontalRadius;
                const y = ringY;
                const z = Math.sin(angle) * horizontalRadius;

                sprite.position.set(x, y, z);

                this.globeGroup.add(sprite);
                this.slangSprites.push(sprite);
            }
        }
    }

    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'globe-tooltip';
        this.tooltip.innerHTML = `
            <div class="tooltip-word"></div>
            <div class="tooltip-info"></div>
        `;
        document.body.appendChild(this.tooltip);
    }

    showTooltip(x, y, data) {
        this.tooltip.querySelector('.tooltip-word').textContent = data.word;
        this.tooltip.querySelector('.tooltip-info').textContent = `${data.origin} · ${data.meaning}`;

        let posX = x + 15;
        let posY = y - 15;

        if (posX + 200 > window.innerWidth) posX = x - 215;
        if (posY + 80 > window.innerHeight) posY = y - 80;

        this.tooltip.style.left = posX + 'px';
        this.tooltip.style.top = posY + 'px';
        this.tooltip.classList.add('visible');
    }

    hideTooltip() {
        this.tooltip.classList.remove('visible');
    }

    setupInteraction() {
        const canvas = this.renderer.domElement;

        canvas.addEventListener('mousedown', (e) => this.onPointerDown(e));
        canvas.addEventListener('mousemove', (e) => this.onPointerMove(e));
        canvas.addEventListener('mouseup', () => this.onPointerUp());
        canvas.addEventListener('mouseleave', () => this.onPointerUp());
        canvas.addEventListener('click', (e) => this.onClick(e));
        canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
        canvas.addEventListener('dblclick', () => this.onDoubleClick());

        canvas.addEventListener('touchstart', (e) => this.onPointerDown(e));
        canvas.addEventListener('touchmove', (e) => this.onPointerMove(e));
        canvas.addEventListener('touchend', () => this.onPointerUp());
    }

    onPointerDown(event) {
        this.isDragging = true;
        this.autoRotate = false;
        this.previousMousePosition = {
            x: event.clientX || event.touches[0].clientX,
            y: event.clientY || event.touches[0].clientY
        };
    }

    onPointerMove(event) {
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);

        if (this.isDragging) {
            const deltaX = clientX - this.previousMousePosition.x;
            const deltaY = clientY - this.previousMousePosition.y;

            this.rotationVelocityY = deltaX * 0.005;
            this.rotationVelocityX = deltaY * 0.003;

            this.targetRotationY += deltaX * 0.005;
            this.targetRotationX += deltaY * 0.003;

            this.targetRotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, this.targetRotationX));

            this.previousMousePosition = { x: clientX, y: clientY };
        }

        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    }

    onPointerUp() {
        this.isDragging = false;
        setTimeout(() => {
            if (!this.isDragging) this.autoRotate = true;
        }, 2000);
    }

    onClick(event) {
        const clientX = event.clientX || (event.changedTouches && event.changedTouches[0].clientX);
        const clientY = event.clientY || (event.changedTouches && event.changedTouches[0].clientY);

        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.slangSprites);

        if (intersects.length > 0) {
            const clickedSprite = intersects[0].object;

            if (!clickedSprite.userData.isAnimating) {
                this.animateSlangClick(clickedSprite);
                this.showTooltip(clientX, clientY, clickedSprite.userData.data);
            }
        }
    }

    animateSlangClick(sprite) {
        sprite.userData.isAnimating = true;
        const original = sprite.userData.originalScale;
        let phase = 0;

        const bounce = () => {
            phase += 0.12;

            if (phase < Math.PI) {
                const scale = 1 + Math.sin(phase) * 0.8;
                sprite.scale.set(original.x * scale, original.y * scale, original.z);
                requestAnimationFrame(bounce);
            } else {
                sprite.scale.set(original.x, original.y, original.z);
                setTimeout(() => {
                    sprite.userData.isAnimating = false;
                    this.hideTooltip();
                }, 1500);
            }
        };

        bounce();
    }

    onWheel(event) {
        event.preventDefault();
        this.zoomTarget += event.deltaY * 0.002;
        this.zoomTarget = Math.max(2.2, Math.min(4, this.zoomTarget));
    }

    onDoubleClick() {
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.zoomTarget = 2.8;
        this.autoRotate = true;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 0.008;

        // 自动旋转
        if (this.autoRotate) {
            this.targetRotationY += 0.002;
        }

        // 惯性效果
        if (!this.isDragging) {
            this.rotationVelocityX *= 0.95;
            this.rotationVelocityY *= 0.95;
            this.targetRotationY += this.rotationVelocityY;
            this.targetRotationX += this.rotationVelocityX;
            this.targetRotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, this.targetRotationX));
        }

        // 平滑旋转
        this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.05;
        this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.05;

        this.globeGroup.rotation.x = this.currentRotationX;
        this.globeGroup.rotation.y = this.currentRotationY;

        // 平滑缩放
        this.camera.position.z += (this.zoomTarget - this.camera.position.z) * 0.05;

        // 轨道环旋转
        this.rings.forEach((ring, index) => {
            if (ring.userData.rotationSpeed) {
                ring.rotation.z += ring.userData.rotationSpeed;
            }
        });

        // 流星旋转
        if (this.meteors) {
            this.meteors.forEach((meteor, index) => {
                meteor.rotation.y += 0.001 * (index + 1);
            });
        }

        // 环绕文字动画
        this.slangSprites.forEach((sprite, index) => {
            if (!sprite.userData.isAnimating) {
                const { ringIndex, baseAngle, ringY, horizontalRadius } = sprite.userData;

                const rotationSpeed = 0.06 + ringIndex * 0.012;
                const direction = ringIndex % 2 === 0 ? 1 : -1;
                const angle = baseAngle + this.time * rotationSpeed * direction;

                const x = Math.cos(angle) * horizontalRadius;
                const y = ringY;
                const z = Math.sin(angle) * horizontalRadius;

                sprite.position.set(x, y, z);

                // 脉动效果
                const pulse = 1 + Math.sin(this.time * 1.5 + index * 0.3) * 0.06;
                const original = sprite.userData.originalScale;
                sprite.scale.set(original.x * pulse, original.y * pulse, original.z);

                // 根据深度调整透明度
                const opacity = 0.5 + (z + horizontalRadius) / (horizontalRadius * 2) * 0.5;
                sprite.material.opacity = opacity;
            }
        });

        // 地球呼吸效果
        const breathe = 1 + Math.sin(this.time * 0.5) * 0.008;
        this.pointCloud.scale.set(breathe, breathe, breathe);

        this.renderer.render(this.scene, this.camera);
    }

    setupResize() {
        window.addEventListener('resize', () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }
}

// ==================== 搜索处理 ====================
class SearchHandler {
    constructor() {
        this.searchForm = document.getElementById('search-form');
        this.searchInput = document.getElementById('search-input');
        this.hotWords = document.querySelectorAll('.hot-word');
        this.init();
    }

    init() {
        this.searchForm.addEventListener('submit', (event) => this.handleSearch(event));

        this.hotWords.forEach(btn => {
            btn.addEventListener('click', () => {
                const word = btn.dataset.word;
                this.searchInput.value = word;
                this.doSearch(word);
            });
        });
    }

    handleSearch(event) {
        event.preventDefault();
        const searchTerm = this.searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            this.doSearch(searchTerm);
        }
    }

    doSearch(term) {
        // 直接跳转到 word.html，由 word.html 处理 404
        window.location.href = `word.html?term=${encodeURIComponent(term.toLowerCase())}`;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new StarfieldBackground();
    new Globe3D('globe-container');
    new SearchHandler();
});
