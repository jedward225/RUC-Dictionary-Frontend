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
            document.getElementById('headword').textContent = '未找到词条';
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
        document.title = `${data.headword} - Meteor Shower 流行语词典`;

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

        // 更新相关词汇
        this.updateRelatedTerms(data.relatedTerms, data.senses);

        // 创建词频图表
        this.createFrequencyChart(data.frequencyData);
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
                        — ${example.source.author}${example.source.title ? `, <em>${example.source.title}</em>` : ''}
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

    updateRelatedTerms(relatedTerms, senses) {
        const container = document.getElementById('thesaurus-content');
        container.innerHTML = '';

        if (!relatedTerms || relatedTerms.length === 0) {
            container.innerHTML = '<p class="loading-text">暂无相关词汇</p>';
            return;
        }

        // 相关词汇标签
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'related-tags';

        relatedTerms.forEach(term => {
            const tag = document.createElement('span');
            tag.className = 'related-tag';
            tag.textContent = term;
            tagsDiv.appendChild(tag);
        });

        container.appendChild(tagsDiv);

        // 语境示例
        let allExamples = [];
        senses.forEach(sense => {
            if (sense.examples) {
                allExamples = allExamples.concat(sense.examples);
            }
            if (sense.subsenses) {
                sense.subsenses.forEach(subsense => {
                    if (subsense.examples) {
                        allExamples = allExamples.concat(subsense.examples);
                    }
                });
            }
        });

        if (allExamples.length > 0) {
            const contextTitle = document.createElement('div');
            contextTitle.className = 'context-title';
            contextTitle.textContent = '📝 Contextual Examples / 语境示例';
            container.appendChild(contextTitle);

            allExamples.slice(0, 5).forEach(example => {
                const contextDiv = document.createElement('div');
                contextDiv.className = 'example-item';

                const sentence = this.getText(example.sentence, 'en');
                const leftContext = sentence.substring(0, example.keywordPosition?.start || 0);
                const word = example.keyword;
                const rightContext = sentence.substring(example.keywordPosition?.end || sentence.length);

                contextDiv.innerHTML = `
                    <div class="example-sentence">
                        ${leftContext}<span class="keyword-highlight">${word}</span>${rightContext}
                    </div>
                    <div class="example-year">${example.year} · ${example.source?.title || 'Source'}</div>
                `;

                container.appendChild(contextDiv);
            });
        }
    }

    async updateHistory(data) {
        const container = document.getElementById('history-markdown');
        const langZhBtn = document.getElementById('lang-zh');
        const langEnBtn = document.getElementById('lang-en');

        if (data.historyFile) {
            this.historyFiles = data.historyFile;
            this.currentHistoryLang = 'zh';

            await this.loadHistoryMarkdown('zh');

            langZhBtn.addEventListener('click', async () => {
                langZhBtn.classList.add('active');
                langEnBtn.classList.remove('active');
                await this.loadHistoryMarkdown('zh');
            });

            langEnBtn.addEventListener('click', async () => {
                langEnBtn.classList.add('active');
                langZhBtn.classList.remove('active');
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
            container.innerHTML = '<p class="loading-text">暂无内容</p>';
            return;
        }

        try {
            container.innerHTML = '<p class="loading-text">加载中...</p>';
            const response = await fetch(filePath);
            if (!response.ok) throw new Error('Failed to load');
            const markdown = await response.text();

            if (typeof marked !== 'undefined') {
                marked.setOptions({
                    breaks: true,
                    gfm: true
                });
                container.innerHTML = marked.parse(markdown);

                container.querySelectorAll('img').forEach(img => {
                    const src = img.getAttribute('src');
                    if (src && src.startsWith('../')) {
                        img.setAttribute('src', 'assets/' + src.substring(3));
                    }
                });

                container.querySelectorAll('a').forEach(link => {
                    if (link.href && !link.href.startsWith(window.location.origin)) {
                        link.setAttribute('target', '_blank');
                        link.setAttribute('rel', 'noopener noreferrer');
                    }
                });
            } else {
                container.innerHTML = `<pre style="white-space: pre-wrap;">${markdown}</pre>`;
            }
        } catch (error) {
            console.error('加载历史内容失败:', error);
            container.innerHTML = '<p class="loading-text" style="color: #ff6b6b;">加载失败，请稍后重试</p>';
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
        document.getElementById('headword').textContent = '词条未找到';
        document.getElementById('pronunciation').textContent = '404 Not Found';

        document.querySelectorAll('.tab-panel').forEach(tab => {
            tab.style.display = 'none';
        });

        const main = document.querySelector('.word-main');
        main.innerHTML = `
            <div class="panel-card" style="text-align: center; padding: 60px 40px;">
                <div style="font-size: 4rem; margin-bottom: 20px;">🔍</div>
                <h3 style="font-size: 1.8rem; color: var(--glow-cyan); margin-bottom: 15px;">抱歉，未找到该流行语</h3>
                <p style="color: var(--meteor-blue-light); margin-bottom: 30px;">请检查输入的词汇是否正确，或返回主页重新搜索。</p>
                <a href="index.html" class="back-btn" style="display: inline-flex;">
                    返回主页
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
            });
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new BuzzwordDisplay();
});
