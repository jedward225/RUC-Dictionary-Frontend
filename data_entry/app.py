"""
流行语数据录入工具
Flask 应用 - 左侧示例，右侧录入表单
"""

from flask import Flask, render_template, request, jsonify
import json
import os
import re

app = Flask(__name__)

# 项目根目录
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUZZWORDS_FILE = os.path.join(PROJECT_ROOT, 'buzzwords.json')
MAIN_JS_FILE = os.path.join(PROJECT_ROOT, 'js', 'main.js')


def load_buzzwords():
    """加载现有词条数据"""
    with open(BUZZWORDS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_buzzwords(data):
    """保存词条数据"""
    with open(BUZZWORDS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def update_main_js(word, origin, meaning):
    """更新 main.js 中的 slangData 数组"""
    with open(MAIN_JS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # 语言到 origin 的映射 (用于 main.js 的 slangData)
    origin_map = {
        'English': 'English',
        'Chinese': '中文',
        'Japanese': '日本語',
        'Korean': '한국어',
        'German': 'Deutsch',
        'French': 'Français',
        'Spanish': 'Español',
        'Russian': 'Русский',
        'Arabic': 'العربية',
        'Portuguese': 'Português',
        'Italian': 'Italiano',
        'Dutch': 'Nederlands',
        'Thai': 'ไทย',
        'Vietnamese': 'Tiếng Việt',
        'Hindi': 'हिन्दी',
    }

    origin_value = origin_map.get(origin, origin)
    new_entry = f'    {{ word: "{word}", origin: "{origin_value}", meaning: "{meaning}" }},'

    # 找到 slangData 数组的结束位置，在 ]; 前插入
    pattern = r'(const slangData = \[[\s\S]*?)(];)'

    def replacer(match):
        return match.group(1) + new_entry + '\n' + match.group(2)

    new_content = re.sub(pattern, replacer, content)

    with open(MAIN_JS_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)


def calculate_keyword_position(sentence, keyword):
    """计算关键词在句子中的位置"""
    start = sentence.find(keyword)
    if start == -1:
        return {"start": 0, "end": 0}
    return {"start": start, "end": start + len(keyword)}


@app.route('/')
def index():
    """主页 - 显示录入表单"""
    data = load_buzzwords()
    # 获取第一个词条作为示例
    example_id = list(data['buzzwords'].keys())[0]
    example = data['buzzwords'][example_id]
    example_json = json.dumps({example_id: example}, ensure_ascii=False, indent=2)

    # 获取已有词条列表
    existing_words = list(data['buzzwords'].keys())

    return render_template('index.html',
                         example_json=example_json,
                         existing_words=existing_words)


@app.route('/api/preview', methods=['POST'])
def preview():
    """预览生成的 JSON"""
    try:
        form_data = request.json
        entry = build_entry(form_data)
        return jsonify({
            'success': True,
            'json': json.dumps(entry, ensure_ascii=False, indent=2)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})


@app.route('/api/submit', methods=['POST'])
def submit():
    """提交新词条"""
    try:
        form_data = request.json
        entry_id = form_data['entryId'].lower().strip()

        # 检查是否已存在
        data = load_buzzwords()
        if entry_id in data['buzzwords']:
            return jsonify({'success': False, 'error': f'词条 "{entry_id}" 已存在！'})

        # 构建词条
        entry = build_entry(form_data)

        # 保存到 buzzwords.json
        data['buzzwords'][entry_id] = entry
        save_buzzwords(data)

        # 更新 main.js（仅当提供了主页简释时）
        if form_data.get('shortMeaning'):
            update_main_js(
                form_data['headword'],
                form_data['language'],
                form_data['shortMeaning']
            )

        return jsonify({
            'success': True,
            'message': f'词条 "{entry_id}" 已成功添加！'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})


def build_entry(form_data):
    """根据表单数据构建词条对象"""
    # 语言映射
    lang_map = {
        'English': {'en': 'English', 'zh': '英语'},
        'Chinese': {'en': 'Chinese', 'zh': '中文'},
        'Japanese': {'en': 'Japanese', 'zh': '日语'},
        'Korean': {'en': 'Korean', 'zh': '韩语'},
        'German': {'en': 'German', 'zh': '德语'},
        'French': {'en': 'French', 'zh': '法语'},
        'Spanish': {'en': 'Spanish', 'zh': '西班牙语'},
        'Russian': {'en': 'Russian', 'zh': '俄语'},
        'Arabic': {'en': 'Arabic', 'zh': '阿拉伯语'},
        'Portuguese': {'en': 'Portuguese', 'zh': '葡萄牙语'},
        'Italian': {'en': 'Italian', 'zh': '意大利语'},
        'Dutch': {'en': 'Dutch', 'zh': '荷兰语'},
        'Thai': {'en': 'Thai', 'zh': '泰语'},
        'Vietnamese': {'en': 'Vietnamese', 'zh': '越南语'},
        'Hindi': {'en': 'Hindi', 'zh': '印地语'},
    }

    # 词性映射
    pos_map = {
        'noun': {'en': 'noun', 'zh': '名词'},
        'verb': {'en': 'verb', 'zh': '动词'},
        'adjective': {'en': 'adjective', 'zh': '形容词'},
        'adverb': {'en': 'adverb', 'zh': '副词'},
        'abbreviation': {'en': 'abbreviation', 'zh': '缩写'},
        'phrase': {'en': 'phrase', 'zh': '短语'},
        'interjection': {'en': 'interjection', 'zh': '感叹词'},
        'pronoun': {'en': 'pronoun', 'zh': '代词'},
        'preposition': {'en': 'preposition', 'zh': '介词'},
        'conjunction': {'en': 'conjunction', 'zh': '连词'},
    }

    # 构建发音对象
    pronunciation = {}
    lang = form_data['language']

    if lang == 'English':
        if form_data.get('pronUK'):
            pronunciation['uk'] = form_data['pronUK']
        if form_data.get('pronUS'):
            pronunciation['us'] = form_data['pronUS']
    elif lang == 'Chinese':
        if form_data.get('pronPinyin'):
            pronunciation['pinyin'] = form_data['pronPinyin']
    elif lang == 'Japanese':
        if form_data.get('pronRomaji'):
            pronunciation['romaji'] = form_data['pronRomaji']
        if form_data.get('pronHiragana'):
            pronunciation['hiragana'] = form_data['pronHiragana']
    elif lang == 'Korean':
        if form_data.get('pronRomanization'):
            pronunciation['romanization'] = form_data['pronRomanization']
        if form_data.get('pronHangul'):
            pronunciation['hangul'] = form_data['pronHangul']
    else:
        if form_data.get('pronIPA'):
            pronunciation['ipa'] = form_data['pronIPA']
        if form_data.get('pronRomanization'):
            pronunciation['romanization'] = form_data['pronRomanization']

    # 构建例句
    examples = []
    if form_data.get('exampleEn') and form_data.get('exampleZh'):
        keyword = form_data.get('exampleKeyword', form_data['headword'])
        pos = calculate_keyword_position(form_data['exampleEn'], keyword)
        examples.append({
            'year': int(form_data.get('exampleYear', 2024)),
            'sentence': {
                'en': form_data['exampleEn'],
                'zh': form_data['exampleZh']
            },
            'source': {
                'author': form_data.get('exampleAuthor', ''),
                'title': form_data.get('exampleTitle', ''),
                'url': form_data.get('exampleUrl', '')
            },
            'keyword': keyword,
            'keywordPosition': pos
        })

    # 构建义项
    senses = [{
        'type': 'trending',
        'title': {'en': 'Trending Sense', 'zh': '流行义'},
        'label': {
            'en': form_data.get('senseLabelEn', ''),
            'zh': form_data.get('senseLabelZh', '')
        },
        'definition': {
            'en': form_data.get('definitionEn', ''),
            'zh': form_data.get('definitionZh', '')
        },
        'examples': examples,
        'etymology': {
            'en': form_data.get('etymologyEn', ''),
            'zh': form_data.get('etymologyZh', '')
        } if form_data.get('etymologyEn') or form_data.get('etymologyZh') else None
    }]

    # 构建词频数据
    frequency_data = []
    if form_data.get('frequencyData'):
        for item in form_data['frequencyData']:
            if item.get('year') and item.get('count'):
                frequency_data.append({
                    'year': int(item['year']),
                    'count': int(item['count'])
                })

    # 构建相关词汇
    related_terms = []
    if form_data.get('relatedTerms'):
        related_terms = [t.strip() for t in form_data['relatedTerms'].split(',') if t.strip()]

    # 构建完整词条
    entry = {
        'headword': form_data['headword'],
        'language': lang_map.get(lang, {'en': lang, 'zh': lang}),
        'partOfSpeech': pos_map.get(form_data['partOfSpeech'], {'en': form_data['partOfSpeech'], 'zh': form_data['partOfSpeech']}),
        'pronunciation': pronunciation,
        'trendingPeriod': form_data.get('trendingPeriod', '2024'),
        'numberOfSenses': 1,
        'senses': senses,
        'frequencyData': frequency_data,
        'history': {
            'en': form_data.get('historyEn', ''),
            'zh': form_data.get('historyZh', '')
        },
        'source': {
            'en': form_data.get('sourceEn', ''),
            'zh': form_data.get('sourceZh', '')
        },
        'relatedTerms': related_terms
    }

    # 添加可选字段
    if form_data.get('firstRecordedEn') or form_data.get('firstRecordedZh'):
        entry['firstRecorded'] = {
            'en': form_data.get('firstRecordedEn', ''),
            'zh': form_data.get('firstRecordedZh', '')
        }

    return entry


@app.route('/api/words')
def get_words():
    """获取已有词条列表"""
    data = load_buzzwords()
    return jsonify(list(data['buzzwords'].keys()))


@app.route('/api/word/<word_id>')
def get_word(word_id):
    """获取单个词条详情"""
    data = load_buzzwords()
    if word_id in data['buzzwords']:
        return jsonify({
            'success': True,
            'data': data['buzzwords'][word_id]
        })
    return jsonify({'success': False, 'error': '词条不存在'})


if __name__ == '__main__':
    print("=" * 50)
    print("流行语数据录入工具")
    print("访问 http://localhost:5000 开始录入")
    print("=" * 50)
    app.run(debug=True, port=5000)
