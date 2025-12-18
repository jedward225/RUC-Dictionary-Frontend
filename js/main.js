import * as THREE from 'three';

// 大洲轮廓坐标数据 [经度, 纬度]
const continentData = {
    // 北美洲
    // northAmerica: [
    //     [-130, 55], [-125, 50], [-124, 45], [-117, 33], [-105, 25], [-98, 26],
    //     [-97, 28], [-92, 30], [-85, 30], [-82, 25], [-80, 25], [-75, 35],
    //     [-70, 42], [-67, 45], [-65, 48], [-58, 48], [-55, 50], [-65, 60],
    //     [-75, 62], [-95, 62], [-105, 70], [-125, 70], [-140, 62], [-165, 62],
    //     [-168, 55], [-160, 58], [-150, 60], [-140, 58], [-130, 55]
    // ],
    // // 南美洲
    // southAmerica: [
    //     [-80, 10], [-75, 10], [-70, 12], [-62, 10], [-55, 5], [-50, 0],
    //     [-45, -5], [-40, -10], [-38, -15], [-40, -22], [-48, -25], [-55, -30],
    //     [-58, -35], [-65, -42], [-68, -50], [-72, -55], [-75, -52], [-73, -45],
    //     [-72, -35], [-70, -25], [-70, -18], [-75, -10], [-78, -5], [-80, 0],
    //     [-82, 5], [-80, 10]
    // ],
    // // 欧洲
    // europe: [
    //     [-10, 35], [-10, 40], [-5, 45], [0, 45], [5, 48], [10, 55],
    //     [20, 55], [30, 60], [35, 65], [30, 70], [20, 70], [10, 62],
    //     [0, 58], [-5, 55], [-10, 50], [-10, 42], [-8, 38], [-10, 35]
    // ],
    // // 非洲
    // africa: [
    //     [-17, 15], [-15, 28], [-5, 35], [10, 37], [15, 32], [25, 32],
    //     [33, 30], [38, 22], [43, 12], [51, 12], [50, 5], [42, 0],
    //     [40, -10], [35, -20], [30, -30], [20, -35], [18, -30], [15, -25],
    //     [12, -15], [15, -5], [10, 5], [5, 5], [-5, 5], [-10, 8],
    //     [-17, 15]
    // ],
    // // 亚洲（大陆部分）
    // asia: [
    //     [30, 35], [35, 38], [40, 42], [50, 45], [60, 55], [70, 60],
    //     [80, 70], [100, 75], [120, 72], [140, 62], [150, 60], [160, 62],
    //     [170, 65], [180, 65], [180, 50], [165, 50], [155, 48], [145, 45],
    //     [140, 38], [130, 35], [120, 25], [110, 20], [105, 10], [100, 5],
    //     [95, 8], [90, 22], [85, 25], [80, 15], [75, 12], [70, 22],
    //     [65, 25], [55, 25], [50, 30], [40, 38], [35, 35], [30, 35]
    // ],
    // // 东南亚岛屿（简化）
    // seAsia: [
    //     [95, 6], [100, 2], [105, -5], [115, -8], [120, -10], [130, -5],
    //     [140, -2], [145, -5], [140, -8], [130, -8], [120, -5], [110, 0],
    //     [105, 5], [100, 8], [95, 6]
    // ],
    // // 澳大利亚
    // australia: [
    //     [115, -20], [120, -18], [130, -12], [140, -12], [145, -15],
    //     [150, -22], [153, -28], [150, -35], [145, -40], [138, -35],
    //     [130, -32], [122, -35], [115, -30], [113, -25], [115, -20]
    // ],
    // // 日本
    // japan: [
    //     [130, 32], [133, 35], [137, 38], [140, 42], [142, 45],
    //     [140, 42], [138, 38], [135, 35], [132, 33], [130, 32]
    // ],
    // // 台湾
    // taiwan: [
    //     [120, 22], [121, 23], [122, 25], [121, 25], [120, 23], [120, 22]
    // ],
    // // 英国爱尔兰
    // ukIreland: [
    //     [-10, 52], [-6, 52], [-5, 55], [-3, 58], [-5, 59], [-8, 57],
    //     [-10, 54], [-10, 52]
    // ],
    // // 新西兰
    // newZealand: [
    //     [168, -35], [175, -37], [178, -40], [175, -45], [170, -46],
    //     [168, -44], [166, -40], [168, -35]
    // ],
    // // 马达加斯加
    // madagascar: [
    //     [44, -13], [50, -15], [50, -22], [47, -25], [44, -23], [43, -18], [44, -13]
    // ]
};

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
    { word: "understood the assignment", origin: "English", meaning: "完美完成" },
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
    { word: "CPU", origin: "中文", meaning: "被骗了" },
    { word: "显眼包", origin: "中文", meaning: "爱出风头" },
    { word: "搭子", origin: "中文", meaning: "临时伙伴" },
    { word: "嘴替", origin: "中文", meaning: "说出心声" },
    { word: "遥遥领先", origin: "中文", meaning: "领先很多" },
    { word: "泼天富贵", origin: "中文", meaning: "意外走红" },
    { word: "命运的齿轮", origin: "中文", meaning: "转折点" },
    { word: "小镇做题家", origin: "中文", meaning: "努力学生" },
    { word: "鼠鼠我啊", origin: "中文", meaning: "自嘲语气" },
    { word: "电子榨菜", origin: "中文", meaning: "下饭视频" },
    { word: "精神状态", origin: "中文", meaning: "情绪状态" },
    { word: "发疯文学", origin: "中文", meaning: "情绪宣泄" },
    { word: "i人e人", origin: "中文", meaning: "内向外向" },
    { word: "挖呀挖", origin: "中文", meaning: "洗脑神曲" },
    // 日语
    { word: "やばい", origin: "日本語", meaning: "不得了" },
    { word: "草", origin: "日本語", meaning: "笑死了" },
    { word: "推し", origin: "日本語", meaning: "最爱" },
    { word: "エモい", origin: "日本語", meaning: "有感觉" },
    { word: "尊い", origin: "日本語", meaning: "太珍贵" },
    { word: "沼", origin: "日本語", meaning: "入坑了" },
    { word: "ガチ", origin: "日本語", meaning: "认真的" },
    { word: "映え", origin: "日本語", meaning: "出片" },
    { word: "それな", origin: "日本語", meaning: "确实" },
    { word: "ワンチャン", origin: "日本語", meaning: "有机会" },
    // 韩语
    { word: "대박", origin: "한국어", meaning: "太棒了" },
    { word: "헐", origin: "한국어", meaning: "天哪" },
    { word: "꿀잼", origin: "한국어", meaning: "超有趣" },
    { word: "갑분싸", origin: "한국어", meaning: "突然尬" },
    { word: "인싸", origin: "한국어", meaning: "社牛" },
    { word: "아싸", origin: "한국어", meaning: "社恐" },
    { word: "존맛", origin: "한국어", meaning: "超好吃" },
    { word: "심쿵", origin: "한국어", meaning: "心动了" },
    { word: "만렙", origin: "한국어", meaning: "满级" },
    { word: "혼코노", origin: "한국어", meaning: "独自K歌" },
    // 西班牙语
    { word: "guay", origin: "Español", meaning: "很酷" },
    { word: "mola", origin: "Español", meaning: "真棒" },
    { word: "flipar", origin: "Español", meaning: "惊呆了" },
    { word: "tío", origin: "Español", meaning: "老兄" },
    { word: "currar", origin: "Español", meaning: "工作" },
    // 法语
    { word: "ouf", origin: "Français", meaning: "疯狂" },
    { word: "kiffer", origin: "Français", meaning: "超喜欢" },
    { word: "grave", origin: "Français", meaning: "太对了" },
    { word: "chelou", origin: "Français", meaning: "奇怪" },
    { word: "relou", origin: "Français", meaning: "烦人" },
    // 德语
    { word: "krass", origin: "Deutsch", meaning: "太猛了" },
    { word: "geil", origin: "Deutsch", meaning: "超赞" },
    { word: "Digga", origin: "Deutsch", meaning: "兄弟" },
    { word: "Alter", origin: "Deutsch", meaning: "老兄" },
    { word: "chillen", origin: "Deutsch", meaning: "放松" },
];

class Globe3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.globeGroup = new THREE.Group();
        this.slangSprites = [];
        this.time = 0;
        this.isSearchMode = false;

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
        this.zoomTarget = 3;

        // Tooltip
        this.tooltip = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.init();
        this.createGlobe();
        this.createContinentOutlines();
        this.createSlangRings();
        this.createTooltip();
        this.setupInteraction();
        this.animate();
        this.setupResize();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = this.zoomTarget;
        this.scene.add(this.globeGroup);
    }

    createGlobe() {
        // 点云地球
        const particles = 18000;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const radius = 1;

        for (let i = 0; i < particles; i++) {
            const phi = Math.acos(-1 + (2 * i) / particles);
            const theta = Math.sqrt(particles * Math.PI) * phi;

            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);

            if (Math.random() > 0.35) {
                positions.push(x, y, z);
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x4d7ea8,
            size: 0.006,
            transparent: true,
            opacity: 0.8,
            depthWrite: false,
            sizeAttenuation: true
        });

        this.pointCloud = new THREE.Points(geometry, material);
        this.pointCloud.renderOrder = 1;
        this.globeGroup.add(this.pointCloud);

        // 半透明球体（用于点击检测）
        const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x1a3a5c,
            transparent: true,
            opacity: 0.05,
            depthWrite: false
        });
        this.globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.globe.renderOrder = 0;
        this.globeGroup.add(this.globe);
    }

    latLngToVector3(lat, lng, radius) {
        // 将经纬度转换为弧度
        const latRad = lat * (Math.PI / 180);
        const lngRad = lng * (Math.PI / 180);

        // 球面坐标转换为笛卡尔坐标
        const x = radius * Math.cos(latRad) * Math.sin(lngRad);
        const y = radius * Math.sin(latRad);
        const z = radius * Math.cos(latRad) * Math.cos(lngRad);

        return new THREE.Vector3(x, y, z);
    }

    createContinentOutlines() {
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x4a9eff,
            transparent: true,
            opacity: 0.5
        });

        Object.values(continentData).forEach(continent => {
            const points = [];
            continent.forEach(([lng, lat]) => {
                points.push(this.latLngToVector3(lat, lng, 1.002));
            });

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterial);
            this.globeGroup.add(line);
        });

        // 大洲轮廓上的发光点
        Object.values(continentData).forEach(continent => {
            const points = continent.map(([lng, lat]) => this.latLngToVector3(lat, lng, 1.003));
            const dotPositions = [];

            for (let i = 0; i < points.length - 1; i++) {
                const start = points[i];
                const end = points[i + 1];
                const steps = 3;

                for (let j = 0; j < steps; j++) {
                    const t = j / steps;
                    dotPositions.push(
                        start.x + (end.x - start.x) * t,
                        start.y + (end.y - start.y) * t,
                        start.z + (end.z - start.z) * t
                    );
                }
            }

            const dotGeometry = new THREE.BufferGeometry();
            dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));

            const dotMaterial = new THREE.PointsMaterial({
                color: 0x4a9eff,
                size: 0.015,
                transparent: true,
                opacity: 0.3,
                depthWrite: false
            });

            const dots = new THREE.Points(dotGeometry, dotMaterial);
            dots.renderOrder = 2;
            this.globeGroup.add(dots);
        });
    }

    createTextSprite(text, data) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;

        context.clearRect(0, 0, canvas.width, canvas.height);

        // 根据文字长度调整字体大小
        let fontSize = 28;
        if (text.length > 4) fontSize = 24;
        if (text.length > 6) fontSize = 20;

        context.font = `bold ${fontSize}px "Microsoft YaHei", "PingFang SC", sans-serif`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // 发光效果
        context.shadowColor = '#4af0ff';
        context.shadowBlur = 15;
        context.fillStyle = '#ffffff';
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        // 再画一次增强亮度
        context.shadowBlur = 8;
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.85,
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
        const orbitRadius = globeRadius + 0.15; // 环绕轨道的球面半径

        for (let ring = 0; ring < ringCount; ring++) {
            // 竖直方向均匀分布
            const ringY = -0.7 + (ring / (ringCount - 1)) * 1.4;
            // 根据Y位置计算水平半径（球体切面原理）
            const horizontalRadius = Math.sqrt(orbitRadius * orbitRadius - ringY * ringY);
            // 靠近极点的圈单词数量减少
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

        // 鼠标/触摸事件
        canvas.addEventListener('mousedown', (e) => this.onPointerDown(e));
        canvas.addEventListener('mousemove', (e) => this.onPointerMove(e));
        canvas.addEventListener('mouseup', () => this.onPointerUp());
        canvas.addEventListener('mouseleave', () => this.onPointerUp());
        canvas.addEventListener('click', (e) => this.onClick(e));
        canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
        canvas.addEventListener('dblclick', () => this.onDoubleClick());

        // 触摸事件
        canvas.addEventListener('touchstart', (e) => this.onPointerDown(e));
        canvas.addEventListener('touchmove', (e) => this.onPointerMove(e));
        canvas.addEventListener('touchend', () => this.onPointerUp());
    }

    onPointerDown(event) {
        if (this.isSearchMode) return;

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

        if (this.isDragging && !this.isSearchMode) {
            const deltaX = clientX - this.previousMousePosition.x;
            const deltaY = clientY - this.previousMousePosition.y;

            this.rotationVelocityY = deltaX * 0.005;
            this.rotationVelocityX = deltaY * 0.003;

            this.targetRotationY += deltaX * 0.005;
            this.targetRotationX += deltaY * 0.003;

            this.targetRotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, this.targetRotationX));

            this.previousMousePosition = { x: clientX, y: clientY };
        }

        // 更新鼠标位置用于射线检测
        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    }

    onPointerUp() {
        this.isDragging = false;
        setTimeout(() => {
            if (!this.isDragging && !this.isSearchMode) this.autoRotate = true;
        }, 2000);
    }

    onClick(event) {
        if (this.isSearchMode) return;

        const clientX = event.clientX || (event.changedTouches && event.changedTouches[0].clientX);
        const clientY = event.clientY || (event.changedTouches && event.changedTouches[0].clientY);

        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

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
        if (this.isSearchMode) return;

        event.preventDefault();
        this.zoomTarget += event.deltaY * 0.002;
        this.zoomTarget = Math.max(2, Math.min(5, this.zoomTarget));
    }

    onDoubleClick() {
        if (this.isSearchMode) return;

        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.zoomTarget = 3;
        this.autoRotate = true;
    }

    // 切换搜索模式
    setSearchMode(enabled) {
        this.isSearchMode = enabled;

        if (enabled) {
            // 搜索模式：归位并自动旋转
            this.targetRotationX = 0;
            this.targetRotationY = 0;
            this.zoomTarget = 2.8;
            this.autoRotate = true;
            this.isDragging = false;
        } else {
            // 展示模式：可以交互
            this.autoRotate = true;
            this.zoomTarget = 3;
        }
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
            if (!this.isSearchMode) {
                this.targetRotationY += this.rotationVelocityY;
                this.targetRotationX += this.rotationVelocityX;
            }
            this.targetRotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, this.targetRotationX));
        }

        // 平滑旋转
        this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.05;
        this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.05;

        this.globeGroup.rotation.x = this.currentRotationX;
        this.globeGroup.rotation.y = this.currentRotationY;

        // 平滑缩放
        this.camera.position.z += (this.zoomTarget - this.camera.position.z) * 0.05;

        // 环绕文字动画
        this.slangSprites.forEach((sprite, index) => {
            if (!sprite.userData.isAnimating) {
                const { ringIndex, baseAngle, ringY, horizontalRadius } = sprite.userData;

                // 每圈不同速度和方向
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
                const opacity = 0.45 + (z + horizontalRadius) / (horizontalRadius * 2) * 0.55;
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
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

class SearchHandler {
    constructor(globe) {
        this.globe = globe;
        this.searchForm = document.getElementById('search-form');
        this.searchInput = document.getElementById('search-input');
        this.errorPopup = document.getElementById('error-popup');
        this.searchPanel = document.getElementById('search-panel');
        this.toggleBtn = document.getElementById('toggle-search');

        this.buzzwords = ["brat", "yyds", "躺平", "内卷"];
        this.isExpanded = false;

        this.init();
    }

    init() {
        this.searchForm.addEventListener('submit', (event) => this.handleSearch(event));
        this.toggleBtn.addEventListener('click', () => this.toggleSearchPanel());

        // 点击面板外部收起
        document.addEventListener('click', (e) => {
            if (this.isExpanded &&
                !this.searchPanel.contains(e.target) &&
                !e.target.closest('.search-panel')) {
                this.collapsePanel();
            }
        });
    }

    toggleSearchPanel() {
        if (this.isExpanded) {
            this.collapsePanel();
        } else {
            this.expandPanel();
        }
    }

    expandPanel() {
        this.isExpanded = true;
        this.searchPanel.classList.remove('collapsed');
        this.searchPanel.classList.add('expanded');

        // 切换到搜索模式
        this.globe.setSearchMode(true);

        // 聚焦输入框
        setTimeout(() => this.searchInput.focus(), 300);
    }

    collapsePanel() {
        this.isExpanded = false;
        this.searchPanel.classList.remove('expanded');
        this.searchPanel.classList.add('collapsed');

        // 切换到展示模式
        this.globe.setSearchMode(false);
    }

    handleSearch(event) {
        event.preventDefault();
        const searchTerm = this.searchInput.value.trim().toLowerCase();

        if (!searchTerm) return;

        if (this.buzzwords.includes(searchTerm)) {
            window.location.href = `word.html?term=${encodeURIComponent(searchTerm)}`;
        } else {
            this.showErrorPopup();
        }
    }

    showErrorPopup() {
        this.errorPopup.classList.remove('hidden');
        setTimeout(() => {
            this.errorPopup.classList.remove('opacity-0');
        }, 10);

        setTimeout(() => {
            this.errorPopup.classList.add('opacity-0');
            setTimeout(() => {
                this.errorPopup.classList.add('hidden');
            }, 300);
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const globe = new Globe3D('globe-container');
    new SearchHandler(globe);
});
