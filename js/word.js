class BuzzwordDisplay {
    constructor() {
        this.buzzwordData = null;
        this.frequencyChart = null;
        this.currentLang = 'zh';
        this.init();
    }

    async init() {
        const params = new URLSearchParams(window.location.search);
        const term = params.get('term');

        if (!term) {
            document.getElementById('headword').textContent = 'Entry Not Found / 未找到词条';
            return;
        }

        try {
            const response = await fetch('buzzwords.json');
            const data = await response.json();

            this.buzzwordData = data.buzzwords[term.toLowerCase()];

            if (this.buzzwordData) {
                this.displayBuzzwordData(this.buzzwordData);
            } else {
                this.show404();
            }
        } catch (error) {
            console.error('加载数据失败:', error);
            this.show404();
        }

        this.setupTabs();
    }

    getText(field, lang = this.currentLang) {
        if (typeof field === 'string') {
            return field;
        }
        if (typeof field === 'object' && field !== null) {
            return field[lang] || field['zh'] || field['en'] || '';
        }
        return '';
    }

    formatPronunciation(pronunciation) {
        const parts = [];

        if (pronunciation.uk) {
            parts.push(`UK ${pronunciation.uk}`);
        }
        if (pronunciation.us) {
            parts.push(`US ${pronunciation.us}`);
        }
        if (pronunciation.pinyin) {
            parts.push(pronunciation.pinyin);
        }
        if (pronunciation.ipa && !pronunciation.uk && !pronunciation.us) {
            parts.push(`IPA ${pronunciation.ipa}`);
        }
        if (pronunciation.romanization) {
            parts.push(pronunciation.romanization);
        }
        if (pronunciation.romaji) {
            parts.push(pronunciation.romaji);
        }
        if (pronunciation.hiragana) {
            parts.push(pronunciation.hiragana);
        }
        if (pronunciation.hangul) {
            parts.push(pronunciation.hangul);
        }

        return parts.join('  ·  ') || 'No pronunciation available';
    }

    displayBuzzwordData(data) {
        // 更新页面标题
        document.title = `${data.headword} - 全球流行语多语种词典`;

        // 更新头部
        document.getElementById('headword').textContent = data.headword;
        const pronunciationText = this.formatPronunciation(data.pronunciation);
        document.getElementById('pronunciation').textContent = pronunciationText;

        // 添加音频按钮
        this.addAudioPlayer(data.pronunciation.audio);

        // 更新档案信息
        this.updateInfoSheet(data);

        // 更新定义
        this.updateDefinition(data.senses);

        // 更新历史
        this.updateHistory(data);
        document.getElementById('history-source').textContent = this.getText(data.source);

        // 更新词频来源
        if (data.frequencySource) {
            document.getElementById('frequency-source').textContent = `Data: ${data.frequencySource}`;
        }

        // 更新索引行 (Concordance)
        this.updateConcordance(data.concordances);

        // 创建词频图表
        this.createFrequencyChart(data.frequencyData);

        // 初始化语义网络可视化
        this.setupSemanticNetworkVisualization(data);
    }

    setupSemanticNetworkVisualization(data) {
        // 存储数据以供语言切换使用
        this.semanticNetworkData = data;

        // 初始化语义网络图
        if (typeof window.initSemanticNetwork === 'function' && data.semanticNetwork) {
            // 延迟初始化，确保 DOM 已渲染
            setTimeout(() => {
                window.initSemanticNetwork(data, 'zh');
            }, 100);
        }

        // 更新语言切换按钮事件
        this.setupSemanticNetworkLangSwitch();
    }

    updateInfoSheet(data) {
        document.getElementById('info-headword').textContent = data.headword;
        document.getElementById('info-language').textContent =
            `${this.getText(data.language, 'en')} / ${this.getText(data.language, 'zh')}`;
        document.getElementById('info-pos').textContent =
            `${this.getText(data.partOfSpeech, 'en')} / ${this.getText(data.partOfSpeech, 'zh')}`;
        document.getElementById('info-pronunciation').textContent =
            this.formatPronunciation(data.pronunciation);
        document.getElementById('info-first-recorded').textContent =
            this.getText(data.firstRecorded);
        document.getElementById('info-trending').textContent = data.trendingPeriod;
        document.getElementById('info-senses').textContent = data.numberOfSenses;

        // Related Work (原 Thesaurus)
        if (data.relatedTerms && data.relatedTerms.length > 0) {
            document.getElementById('info-related-work').textContent = data.relatedTerms.join(', ');
        } else {
            document.getElementById('info-related-work').textContent = '-';
        }
    }

    updateDefinition(senses) {
        const container = document.getElementById('definition-content');
        container.innerHTML = '';

        senses.forEach((sense, index) => {
            const senseDiv = document.createElement('div');
            senseDiv.className = 'sense-block';

            // 义项标题
            const titleHtml = `
                <div class="sense-title">${this.getText(sense.title)}</div>
                ${sense.label ? `<div class="sense-label">${this.getText(sense.label)}</div>` : ''}
            `;
            senseDiv.innerHTML = titleHtml;

            // 定义
            if (sense.definition) {
                const defDiv = document.createElement('div');
                defDiv.className = 'sense-definition';
                defDiv.innerHTML = `
                    <span class="def-lang">
                        <span class="def-lang-tag">EN</span>
                        <span class="def-text">${this.getText(sense.definition, 'en')}</span>
                    </span>
                    <span class="def-lang">
                        <span class="def-lang-tag">ZH</span>
                        <span class="def-text">${this.getText(sense.definition, 'zh')}</span>
                    </span>
                `;
                senseDiv.appendChild(defDiv);
            }

            // 子义项
            if (sense.subsenses && sense.subsenses.length > 0) {
                sense.subsenses.forEach((subsense, subIndex) => {
                    const subsenseDiv = document.createElement('div');
                    subsenseDiv.className = 'subsense-block';
                    subsenseDiv.innerHTML = `
                        <div class="subsense-label">(${String.fromCharCode(97 + subIndex)}) ${this.getText(subsense.label)}</div>
                        <div class="sense-definition">
                            <span class="def-lang">
                                <span class="def-lang-tag">EN</span>
                                <span class="def-text">${this.getText(subsense.definition, 'en')}</span>
                            </span>
                            <span class="def-lang">
                                <span class="def-lang-tag">ZH</span>
                                <span class="def-text">${this.getText(subsense.definition, 'zh')}</span>
                            </span>
                        </div>
                    `;

                    if (subsense.examples && subsense.examples.length > 0) {
                        subsenseDiv.appendChild(this.createExamplesSection(subsense.examples));
                    }

                    senseDiv.appendChild(subsenseDiv);
                });
            }

            // 例句
            if (sense.examples && sense.examples.length > 0) {
                senseDiv.appendChild(this.createExamplesSection(sense.examples));
            }

            // 词源
            if (sense.etymology) {
                const etymDiv = document.createElement('div');
                etymDiv.className = 'etymology-box';
                etymDiv.innerHTML = `
                    <div class="etymology-title">📚 Etymology / 词源</div>
                    <span class="def-lang">
                        <span class="def-lang-tag">EN</span>
                        <span class="def-text">${this.getText(sense.etymology, 'en')}</span>
                    </span>
                    <span class="def-lang">
                        <span class="def-lang-tag">ZH</span>
                        <span class="def-text">${this.getText(sense.etymology, 'zh')}</span>
                    </span>
                `;
                senseDiv.appendChild(etymDiv);
            }

            container.appendChild(senseDiv);
        });
    }

    createExamplesSection(examples) {
        const examplesDiv = document.createElement('div');
        examplesDiv.className = 'examples-section';
        examplesDiv.innerHTML = '<div class="examples-title">💬 Examples / 例句</div>';

        examples.forEach((example) => {
            const exampleItem = document.createElement('div');
            exampleItem.className = 'example-item';

            const enSentence = this.getText(example.sentence, 'en');
            const zhSentence = this.getText(example.sentence, 'zh');

            const highlightedEn = this.highlightKeyword(
                enSentence,
                example.keyword,
                example.keywordPosition
            );

            exampleItem.innerHTML = `
                <div class="example-year">${example.year}</div>
                <div class="example-sentence">${highlightedEn}</div>
                <div class="example-translation">译：${zhSentence}</div>
                ${example.source && example.source.author ? `
                    <div class="example-source">
                        — ${example.source.author}${example.source.title ? `, ${example.source.title}` : ''}
                        ${example.source.url ? `<a href="${example.source.url}" target="_blank">🔗</a>` : ''}
                    </div>
                ` : ''}
            `;

            examplesDiv.appendChild(exampleItem);
        });

        return examplesDiv;
    }

    highlightKeyword(sentence, keyword, position) {
        if (!position || !keyword) {
            return sentence;
        }

        const before = sentence.substring(0, position.start);
        const word = sentence.substring(position.start, position.end);
        const after = sentence.substring(position.end);

        return `${before}<span class="keyword-highlight">${word}</span>${after}`;
    }

    updateConcordance(concordances) {
        const container = document.getElementById('concordance-content');
        container.innerHTML = '';

        if (!concordances || concordances.length === 0) {
            container.innerHTML = '<p class="loading-text">No concordance data / 暂无索引行数据</p>';
            return;
        }

        const concordanceTable = document.createElement('div');
        concordanceTable.className = 'concordance-table';

        concordances.forEach((line, index) => {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'concordance-line';
            lineDiv.innerHTML = `
                <span class="concordance-num">${index + 1}</span>
                <span class="concordance-left">${line.left}</span>
                <span class="concordance-keyword">${line.keyword}</span>
                <span class="concordance-right">${line.right}</span>
            `;
            concordanceTable.appendChild(lineDiv);
        });

        container.appendChild(concordanceTable);
    }

    async updateHistory(data) {
        const container = document.getElementById('history-markdown');
        const langZhBtn = document.getElementById('lang-zh');
        const langEnBtn = document.getElementById('lang-en');

        if (data.historyFile) {
            this.historyFiles = data.historyFile;
            this.historyCache = {}; // 缓存已加载的内容
            this.currentHistoryLang = 'zh';

            await this.loadHistoryMarkdown('zh');

            langZhBtn.addEventListener('click', async () => {
                if (this.currentHistoryLang === 'zh') return;
                langZhBtn.classList.add('active');
                langEnBtn.classList.remove('active');
                this.currentHistoryLang = 'zh';
                await this.loadHistoryMarkdown('zh');
            });

            langEnBtn.addEventListener('click', async () => {
                if (this.currentHistoryLang === 'en') return;
                langEnBtn.classList.add('active');
                langZhBtn.classList.remove('active');
                this.currentHistoryLang = 'en';
                await this.loadHistoryMarkdown('en');
            });
        } else {
            container.innerHTML = `<p style="line-height: 1.8;">${this.getText(data.history)}</p>`;
            langZhBtn.style.display = 'none';
            langEnBtn.style.display = 'none';
        }
    }

    async loadHistoryMarkdown(lang) {
        const container = document.getElementById('history-markdown');
        const filePath = this.historyFiles[lang];

        if (!filePath) {
            container.innerHTML = '<p class="loading-text">No content / 暂无内容</p>';
            return;
        }

        // 如果已缓存，直接使用缓存内容
        if (this.historyCache && this.historyCache[lang]) {
            container.style.opacity = '0';
            setTimeout(() => {
                container.innerHTML = this.historyCache[lang];
                container.style.opacity = '1';
            }, 150);
            return;
        }

        try {
            // 首次加载才显示加载中
            if (!this.historyCache || Object.keys(this.historyCache).length === 0) {
                container.innerHTML = '<p class="loading-text">Loading... / 加载中...</p>';
            }

            const cacheBuster = `?v=${Date.now()}`;
            const response = await fetch(filePath + cacheBuster);
            if (!response.ok) throw new Error('Failed to load');
            const markdown = await response.text();

            let htmlContent = '';
            if (typeof marked !== 'undefined') {
                marked.setOptions({
                    breaks: true,
                    gfm: true
                });
                htmlContent = marked.parse(markdown);
            } else {
                htmlContent = `<pre style="white-space: pre-wrap;">${markdown}</pre>`;
            }

            // 缓存内容
            this.historyCache[lang] = htmlContent;

            // 平滑过渡
            container.style.opacity = '0';
            setTimeout(() => {
                container.innerHTML = htmlContent;

                container.querySelectorAll('img').forEach(img => {
                    const src = img.getAttribute('src');
                    if (src && src.startsWith('../')) {
                        img.setAttribute('src', 'assets/' + src.substring(3));
                    }

                    // 处理图片说明：检查图片所在段落的下一个兄弟元素
                    const imgParent = img.parentElement;
                    if (imgParent && imgParent.tagName === 'P') {
                        const nextSibling = imgParent.nextElementSibling;
                        // 如果下一个元素是只包含 <em> 的段落，标记为图片说明
                        if (nextSibling && nextSibling.tagName === 'P') {
                            const children = nextSibling.children;
                            if (children.length === 1 && children[0].tagName === 'EM') {
                                nextSibling.classList.add('image-caption');
                            }
                        }
                    }
                });

                container.querySelectorAll('a').forEach(link => {
                    if (link.href && !link.href.startsWith(window.location.origin)) {
                        link.setAttribute('target', '_blank');
                        link.setAttribute('rel', 'noopener noreferrer');
                    }
                });

                container.style.opacity = '1';
            }, 150);
        } catch (error) {
            console.error('加载历史内容失败:', error);
            container.innerHTML = '<p class="loading-text" style="color: #ff6b6b;">Failed to load. Please try again. / 加载失败，请稍后重试</p>';
        }
    }

    addAudioPlayer(audio) {
        if (!audio) return;

        const pronunciationEl = document.getElementById('pronunciation');
        const audioDiv = document.createElement('div');
        audioDiv.className = 'audio-buttons';

        if (audio.uk) {
            audioDiv.innerHTML += `
                <button onclick="new Audio('${audio.uk}').play()" class="audio-btn">
                    🔊 UK
                </button>
            `;
        }

        if (audio.us) {
            audioDiv.innerHTML += `
                <button onclick="new Audio('${audio.us}').play()" class="audio-btn">
                    🔊 US
                </button>
            `;
        }

        if (audio.zh) {
            audioDiv.innerHTML += `
                <button onclick="new Audio('${audio.zh}').play()" class="audio-btn">
                    🔊 中文
                </button>
            `;
        }

        pronunciationEl.parentNode.appendChild(audioDiv);
    }

    show404() {
        document.getElementById('headword').textContent = 'Entry Not Found / 词条未找到';
        document.getElementById('pronunciation').textContent = '404 Not Found';

        document.querySelectorAll('.tab-panel').forEach(tab => {
            tab.style.display = 'none';
        });

        const main = document.querySelector('.word-main');
        main.innerHTML = `
            <div class="panel-card" style="text-align: center; padding: 60px 40px;">
                <div style="font-size: 4rem; margin-bottom: 20px;">🔍</div>
                <h3 style="font-size: 1.8rem; color: var(--glow-cyan); margin-bottom: 15px;">Sorry, buzzword not found / 抱歉，未找到该流行语</h3>
                <p style="color: var(--meteor-blue-light); margin-bottom: 30px;">Please check the term and try again. / 请检查输入的词汇是否正确，或返回主页重新搜索。</p>
                <a href="index.html" class="back-btn" style="display: inline-flex;">
                    Back to Home / 返回主页
                </a>
            </div>
        `;
    }

    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');

                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');

                document.querySelectorAll('.tab-panel').forEach(panel => {
                    panel.classList.remove('active');
                });
                document.getElementById(targetTab).classList.add('active');

                // 当切换到语义网络标签时，重新初始化图表（确保容器尺寸正确）
                if (targetTab === 'semantic-network' && this.semanticNetworkData) {
                    setTimeout(() => {
                        if (typeof window.initSemanticNetwork === 'function') {
                            window.initSemanticNetwork(this.semanticNetworkData, 'zh');
                        }
                    }, 50);
                }
            });
        });

        // 设置语义网络说明的语言切换
        this.setupSemanticLangSwitch();
    }

    setupSemanticLangSwitch() {
        const zhBtn = document.getElementById('semantic-lang-zh');
        const enBtn = document.getElementById('semantic-lang-en');
        const zhContent = document.getElementById('semantic-content-zh');
        const enContent = document.getElementById('semantic-content-en');
        const zhHint = document.getElementById('network-hint-zh');
        const enHint = document.getElementById('network-hint-en');

        if (!zhBtn || !enBtn) return;

        zhBtn.addEventListener('click', () => {
            zhBtn.classList.add('active');
            enBtn.classList.remove('active');
            if (zhContent) zhContent.classList.add('active');
            if (enContent) enContent.classList.remove('active');
            if (zhHint) zhHint.style.display = 'block';
            if (enHint) enHint.style.display = 'none';
            // 切换语义网络图例语言
            if (typeof window.switchSemanticNetworkLang === 'function') {
                window.switchSemanticNetworkLang('zh');
            }
        });

        enBtn.addEventListener('click', () => {
            enBtn.classList.add('active');
            zhBtn.classList.remove('active');
            if (enContent) enContent.classList.add('active');
            if (zhContent) zhContent.classList.remove('active');
            if (enHint) enHint.style.display = 'block';
            if (zhHint) zhHint.style.display = 'none';
            // 切换语义网络图例语言
            if (typeof window.switchSemanticNetworkLang === 'function') {
                window.switchSemanticNetworkLang('en');
            }
        });
    }

    setupSemanticNetworkLangSwitch() {
        // 此方法已整合到 setupSemanticLangSwitch 中
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new BuzzwordDisplay();
});
