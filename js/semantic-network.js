/**
 * 语义网络可视化 - Semantic Network Visualization
 * 使用 D3.js 力导向图实现可交互的语义网络
 */

class SemanticNetworkVisualization {
    constructor(containerId, data, lang = 'zh') {
        this.containerId = containerId;
        this.data = data;
        this.lang = lang;
        this.width = 0;
        this.height = 0;
        this.simulation = null;
        this.svg = null;
        this.nodes = [];
        this.links = [];

        // 词性颜色映射
        this.colorMap = {
            target: '#FBBF24',      // 黄色 - 目标词
            noun: '#A78BFA',        // 紫色 - 名词
            verb: '#60A5FA',        // 蓝色 - 动词
            adjective: '#F9A8D4',   // 粉色 - 形容词
            adverb: '#BEF264',      // 黄绿色 - 副词
            other: '#9333EA'        // 深紫色 - 其他
        };

        this.init();
    }

    init() {
        const container = document.getElementById(this.containerId);
        console.log('SemanticNetwork init', { container, containerId: this.containerId, data: this.data });

        if (!container) {
            console.error('Container not found:', this.containerId);
            return;
        }
        if (!this.data) {
            console.error('No data provided');
            return;
        }

        // 清空容器
        container.innerHTML = '';

        // 获取容器尺寸
        const rect = container.getBoundingClientRect();
        this.width = rect.width || 900;
        this.height = 600;

        // 深拷贝数据以避免修改原始数据
        this.nodes = this.data.nodes.map(d => ({...d}));
        this.links = this.data.links.map(d => ({...d}));

        this.createSVG(container);
        this.createSimulation();
        this.createVisualization();
        this.createLegend();

        // 监听窗口大小变化
        window.addEventListener('resize', () => this.handleResize());
    }

    createSVG(container) {
        this.svg = d3.select(container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', this.height)
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .attr('class', 'semantic-network-svg');

        // 添加缩放功能
        this.zoom = d3.zoom()
            .scaleExtent([0.5, 4])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });

        this.svg.call(this.zoom);

        // 主图层
        this.g = this.svg.append('g');

        // 初始缩放（相当于滚轮滚3下的效果）
        const initialTransform = d3.zoomIdentity
            .translate(this.width / 2, this.height / 2)
            .scale(1.35);
        this.svg.call(this.zoom.transform, initialTransform);
    }

    createSimulation() {
        // 缩放因子
        const scale = Math.min(this.width, this.height) * 0.7;

        // 初始化节点位置
        this.nodes.forEach(node => {
            node.x = node.x * scale;
            node.y = -node.y * scale;
        });

        // 力导向模拟 - 适度聚集，自然分布
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links)
                .id(d => d.id)
                .distance(70)
                .strength(0.15))
            .force('charge', d3.forceManyBody()
                .strength(-80))
            .force('collision', d3.forceCollide()
                .radius(d => this.getNodeRadius(d) + 4))
            .force('center', d3.forceCenter(0, 0).strength(0.1))
            .alphaDecay(0.025);
    }

    getNodeRadius(d) {
        return d.size * 1.0;
    }

    createVisualization() {
        // 创建连线
        this.linkElements = this.g.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(this.links)
            .enter()
            .append('line')
            .attr('class', 'network-link')
            .attr('stroke', '#4B5563')
            .attr('stroke-width', 1.5)
            .attr('stroke-opacity', 0.6);

        // 创建节点组
        this.nodeGroups = this.g.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(this.nodes)
            .enter()
            .append('g')
            .attr('class', 'node-group')
            .call(this.drag());

        // 节点圆形
        this.nodeGroups.append('circle')
            .attr('class', 'network-node')
            .attr('r', d => this.getNodeRadius(d))
            .attr('fill', d => this.colorMap[d.wordClass] || this.colorMap.other)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .attr('cursor', 'grab')
            .on('mouseover', (event, d) => this.handleMouseOver(event, d))
            .on('mouseout', (event, d) => this.handleMouseOut(event, d));

        // 节点文字
        this.nodeGroups.append('text')
            .attr('class', 'network-label')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', d => d.wordClass === 'target' ? '#1F2937' : '#1F2937')
            .attr('font-size', d => d.wordClass === 'target' ? '14px' : '11px')
            .attr('font-weight', d => d.wordClass === 'target' ? '700' : '500')
            .attr('pointer-events', 'none')
            .text(d => d.word);

        // 更新位置
        this.simulation.on('tick', () => this.ticked());
    }

    ticked() {
        this.linkElements
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        this.nodeGroups
            .attr('transform', d => `translate(${d.x}, ${d.y})`);
    }

    drag() {
        return d3.drag()
            .on('start', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
                d3.select(event.sourceEvent.target).attr('cursor', 'grabbing');
            })
            .on('drag', (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
                d3.select(event.sourceEvent.target).attr('cursor', 'grab');
            });
    }

    handleMouseOver(event, d) {
        // 高亮当前节点
        d3.select(event.target)
            .transition()
            .duration(200)
            .attr('stroke-width', 4)
            .attr('filter', 'drop-shadow(0 0 8px rgba(255,255,255,0.5))');

        // 高亮相关连线
        this.linkElements
            .transition()
            .duration(200)
            .attr('stroke-opacity', link =>
                (link.source.id === d.id || link.target.id === d.id) ? 1 : 0.2)
            .attr('stroke-width', link =>
                (link.source.id === d.id || link.target.id === d.id) ? 2.5 : 1);
    }

    handleMouseOut(event, d) {
        d3.select(event.target)
            .transition()
            .duration(200)
            .attr('stroke-width', 2)
            .attr('filter', null);

        this.linkElements
            .transition()
            .duration(200)
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', 1.5);
    }

    createLegend() {
        const legend = this.data.legend[this.lang];
        const legendItems = [
            { key: 'target', label: legend.target },
            { key: 'noun', label: legend.noun },
            { key: 'verb', label: legend.verb },
            { key: 'adjective', label: legend.adjective },
            { key: 'adverb', label: legend.adverb }
        ];

        const legendGroup = this.svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${this.width - 170}, 20)`);

        // 图例背景
        legendGroup.append('rect')
            .attr('x', -10)
            .attr('y', -10)
            .attr('width', 160)
            .attr('height', legendItems.length * 24 + 30)
            .attr('fill', 'rgba(0, 20, 40, 0.8)')
            .attr('rx', 8)
            .attr('stroke', 'rgba(0, 212, 255, 0.3)')
            .attr('stroke-width', 1);

        // 图例标题
        legendGroup.append('text')
            .attr('x', 70)
            .attr('y', 8)
            .attr('text-anchor', 'middle')
            .attr('fill', '#00D4FF')
            .attr('font-size', '11px')
            .attr('font-weight', '600')
            .text(legend.title);

        // 图例项
        legendItems.forEach((item, i) => {
            const itemGroup = legendGroup.append('g')
                .attr('transform', `translate(0, ${i * 24 + 28})`);

            itemGroup.append('circle')
                .attr('cx', 10)
                .attr('cy', 0)
                .attr('r', 8)
                .attr('fill', this.colorMap[item.key]);

            itemGroup.append('text')
                .attr('x', 26)
                .attr('y', 4)
                .attr('fill', '#E5E7EB')
                .attr('font-size', '11px')
                .text(item.label);
        });
    }

    handleResize() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const rect = container.getBoundingClientRect();
        this.width = rect.width || 800;

        this.svg
            .attr('viewBox', `0 0 ${this.width} ${this.height}`);

        this.g.attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);

        // 更新图例位置
        this.svg.select('.legend')
            .attr('transform', `translate(${this.width - 130}, 20)`);
    }

    setLanguage(lang) {
        this.lang = lang;
        // 重新创建图例
        this.svg.select('.legend').remove();
        this.createLegend();
    }

    destroy() {
        if (this.simulation) {
            this.simulation.stop();
        }
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = '';
        }
    }
}

// 全局实例
let semanticNetworkInstance = null;

// 初始化函数
function initSemanticNetwork(data, lang = 'zh') {
    console.log('initSemanticNetwork called', { data, lang });

    if (semanticNetworkInstance) {
        semanticNetworkInstance.destroy();
    }

    if (data && data.semanticNetwork) {
        console.log('Creating SemanticNetworkVisualization', data.semanticNetwork);
        semanticNetworkInstance = new SemanticNetworkVisualization(
            'semantic-network-container',
            data.semanticNetwork,
            lang
        );
    } else {
        console.warn('No semantic network data found', data);
    }
}

// 切换语言
function switchSemanticNetworkLang(lang) {
    if (semanticNetworkInstance) {
        semanticNetworkInstance.setLanguage(lang);
    }
}
