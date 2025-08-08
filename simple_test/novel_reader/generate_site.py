import os
import re
import shutil
from collections import OrderedDict

# --- 設定 ---
NOVELS_ROOT_DIR = 'novels'
BASE_OUTPUT_DIR = 'novel_site'
TEMPLATE_PATH = 'template.html'
IMAGE_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.gif', '.webp')

def parse_content_to_html(text_content):
    """將純文字內容轉換為 HTML 段落，並優化排版"""
    paragraphs = text_content.strip().split('\n\n')
    html_output = []
    for para in paragraphs:
        stripped_para = para.strip()
        if stripped_para:
            content_with_breaks = stripped_para.replace(os.linesep, "<br>")
            html_output.append(f'<p class="mb-6 leading-loose tracking-wide">{content_with_breaks}</p>')
    return ''.join(html_output)

def main():
    """主執行函數"""
    print("🚀 開始生成專業版小說網站...")

    if not os.path.exists(BASE_OUTPUT_DIR):
        os.makedirs(BASE_OUTPUT_DIR)

    try:
        with open(TEMPLATE_PATH, 'r', encoding='utf-8') as f:
            template_html = f.read()
    except FileNotFoundError:
        print(f"❌ 錯誤：找不到範本檔案 '{TEMPLATE_PATH}'。")
        return

    try:
        novel_folders = [d for d in os.listdir(NOVELS_ROOT_DIR) if os.path.isdir(os.path.join(NOVELS_ROOT_DIR, d))]
    except FileNotFoundError:
        print(f"❌ 錯誤: 找不到 '{NOVELS_ROOT_DIR}' 資料夾。")
        return

    if not novel_folders:
        print(f"⚠️ 在 '{NOVELS_ROOT_DIR}' 中找不到任何小說資料夾。")
        return
    
    print(f"📚 找到 {len(novel_folders)} 本小說，開始處理...")
    all_novels_info = []

    for novel_id in novel_folders:
        print(f"\n--- 正在處理: {novel_id} ---")
        novel_src_path = os.path.join(NOVELS_ROOT_DIR, novel_id)
        novel_output_path = os.path.join(BASE_OUTPUT_DIR, novel_id)
        os.makedirs(novel_output_path, exist_ok=True)

        novel_title = novel_id.replace('-', ' ').title()
        info_file_path = os.path.join(novel_src_path, 'info.txt')
        if os.path.exists(info_file_path):
            with open(info_file_path, 'r', encoding='utf-8') as f:
                novel_title = f.readline().strip()
        
        print(f"✒️ 小說標題: {novel_title}")

        all_files_in_novel_folder = os.listdir(novel_src_path)
        cover_file_name = None
        for file_name in all_files_in_novel_folder:
            if not file_name.endswith('.txt'):
                shutil.copy(os.path.join(novel_src_path, file_name), novel_output_path)
                if file_name.lower().endswith(IMAGE_EXTENSIONS) and not cover_file_name:
                    cover_file_name = file_name
        
        all_novels_info.append({'id': novel_id, 'title': novel_title, 'cover': cover_file_name})

        cover_image_html = ''
        if cover_file_name:
            cover_image_html = f'<div class="aspect-w-3 aspect-h-4 mb-4"><img src="{cover_file_name}" alt="{novel_title} 封面" class="w-full h-full object-cover rounded-lg shadow-md"></div>'
            print(f"🖼️ 找到封面: {cover_file_name}")

        chapter_files = sorted([f for f in all_files_in_novel_folder if f.endswith('.txt') and f != 'info.txt'])
        if not chapter_files:
            print("⚠️ 警告: 此小說資料夾中沒有找到章節 .txt 檔案。")
            continue
        
        all_pages_linear = []
        chapter_hierarchy = OrderedDict()

        for filename in chapter_files:
            clean_name_base = re.sub(r'^\d+_', '', os.path.splitext(filename)[0])
            
            with open(os.path.join(novel_src_path, filename), 'r', encoding='utf-8') as f:
                main_chapter_title = f.readline().strip()
                main_chapter_subtitle = f.readline().strip()
                full_content = f.read()

            sub_chapters = re.split(r'^\s*#\s+(.*)', full_content, flags=re.MULTILINE)
            
            main_content = sub_chapters[0]
            main_page_info = {
                'title': main_chapter_title,
                'subtitle': main_chapter_subtitle,
                'html_filename': f"{clean_name_base}.html",
                'content': main_content,
                'is_sub': False
            }
            all_pages_linear.append(main_page_info)
            chapter_hierarchy[main_chapter_title] = [main_page_info]

            if len(sub_chapters) > 1:
                for i in range(1, len(sub_chapters), 2):
                    sub_title = sub_chapters[i].strip()
                    sub_content = sub_chapters[i+1]
                    sub_page_info = {
                        'title': sub_title,
                        'subtitle': main_chapter_subtitle, # 小節繼承主章節的註解
                        'html_filename': f"{clean_name_base}-{i//2 + 1}.html",
                        'content': sub_content,
                        'is_sub': True
                    }
                    all_pages_linear.append(sub_page_info)
                    chapter_hierarchy[main_chapter_title].append(sub_page_info)

        for i, current_page in enumerate(all_pages_linear):
            content_html = parse_content_to_html(current_page['content'])
            
            subtitle_html = ''
            if current_page['subtitle']:
                subtitle_html = f'<p class="text-lg italic text-[var(--text-main)] opacity-75 mt-2 mb-10 text-center font-serif">{current_page["subtitle"]}</p>'

            nav_html = ''
            for main_title, pages in chapter_hierarchy.items():
                main_page = pages[0]
                is_current_chapter_group = any(p['html_filename'] == current_page['html_filename'] for p in pages)
                main_active_class = 'bg-[var(--active-bg-main)] font-bold text-[var(--text-main)]' if main_page['html_filename'] == current_page['html_filename'] else 'text-[var(--link-main)]'
                parent_active_class = 'font-bold text-[var(--text-main)]' if not main_active_class and is_current_chapter_group else ''

                if len(pages) > 1:
                    sub_nav_id = f"sub-nav-{main_page['html_filename'].replace('.', '-')}"
                    chevron_rotation = 'rotate-90' if is_current_chapter_group else ''
                    sub_nav_visibility = '' if is_current_chapter_group else 'hidden'
                    nav_html += f'''
                        <div>
                            <button data-toggle-target="{sub_nav_id}" class="chapter-toggle-btn w-full block p-3 rounded-md hover:bg-[var(--active-bg-main)] transition-colors duration-200 flex justify-between items-center text-left {main_active_class} {parent_active_class}">
                                <span>{main_title}</span>
                                <svg class="chevron-icon w-4 h-4 transition-transform duration-200 flex-shrink-0 {chevron_rotation}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
                            </button>
                            <div id="{sub_nav_id}" class="sub-nav-container mt-1 space-y-1 border-l-2 border-[var(--border-main)] pl-3 ml-4 {sub_nav_visibility}">
                    '''
                    for sub_page in pages[1:]:
                        is_sub_active = (sub_page['html_filename'] == current_page['html_filename'])
                        sub_active_class = 'bg-[var(--active-bg-main)] font-bold text-[var(--text-main)]' if is_sub_active else 'text-[var(--link-main)]'
                        nav_html += f'<a href="{sub_page["html_filename"]}" class="chapter-link block p-2 rounded-md text-sm hover:bg-[var(--active-bg-main)] transition-colors duration-200 {sub_active_class}">{sub_page["title"]}</a>'
                    nav_html += '</div></div>'
                else:
                    nav_html += f'<a href="{main_page["html_filename"]}" class="chapter-link block p-3 rounded-md hover:bg-[var(--active-bg-main)] transition-colors duration-200 {main_active_class}">{main_title}</a>'

            chapter_nav_html = '<div class="flex justify-between mt-12 pt-6 border-t border-[var(--border-main)]">'
            prev_page_url = all_pages_linear[i-1]['html_filename'] if i > 0 else ''
            next_page_url = all_pages_linear[i+1]['html_filename'] if i < len(all_pages_linear) - 1 else ''
            
            if prev_page_url:
                chapter_nav_html += f'<a href="{prev_page_url}" id="prev-page-link" class="nav-btn">← 上一節</a>'
            else:
                chapter_nav_html += '<div></div>'
            
            if next_page_url:
                chapter_nav_html += f'<a href="{next_page_url}" id="next-page-link" class="nav-btn">下一節 →</a>'
            else:
                chapter_nav_html += '<div></div>'
            chapter_nav_html += '</div>'

            page_full_title = f"{current_page['title']} - {novel_title}"
            output_html = template_html.replace('{{NOVEL_ID}}', novel_id)
            output_html = output_html.replace('{{NOVEL_TITLE}}', novel_title)
            output_html = output_html.replace('{{PAGE_TITLE}}', page_full_title)
            output_html = output_html.replace('{{PREV_PAGE_URL}}', prev_page_url)
            output_html = output_html.replace('{{NEXT_PAGE_URL}}', next_page_url)
            output_html = output_html.replace('{{CHAPTER_TITLE}}', current_page['title'])
            output_html = output_html.replace('{{CHAPTER_SUBTITLE_HTML}}', subtitle_html)
            output_html = output_html.replace('{{CHAPTER_CONTENT_HTML}}', content_html)
            output_html = output_html.replace('{{CHAPTER_LIST_HTML}}', nav_html)
            output_html = output_html.replace('{{MOBILE_CHAPTER_LIST_HTML}}', nav_html)
            output_html = output_html.replace('{{COVER_IMAGE_HTML}}', cover_image_html)
            output_html = output_html.replace('{{CHAPTER_NAVIGATION}}', chapter_nav_html)
            
            output_file_path = os.path.join(novel_output_path, current_page['html_filename'])
            with open(output_file_path, 'w', encoding='utf-8') as f:
                f.write(output_html)
            print(f"  -> ✅ 已生成: {current_page['title']}")

        if all_pages_linear:
            first_page_filename = all_pages_linear[0]['html_filename']
            index_content = f'<meta http-equiv="refresh" content="0; url={first_page_filename}" />'
            with open(os.path.join(novel_output_path, 'index.html'), 'w', encoding='utf-8') as f:
                f.write(index_content)
            print(f"  -> ➡️ 已建立小說入口 index.html")

    main_index_content = f"""
    <!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><title>小說書庫</title>
    <script src="https://cdn.tailwindcss.com?plugins=typography,aspect-ratio"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Noto+Serif+TC:wght@700&display=swap" rel="stylesheet">
    <style>body {{ font-family: 'Inter', sans-serif; }} h2 {{ font-family: 'Noto Serif TC', serif; }}</style></head>
    <body class="bg-slate-100"><div class="container mx-auto p-8 max-w-6xl">
    <h1 class="text-4xl font-bold text-center text-slate-800 mb-12" style="font-family: 'Noto Serif TC', serif;">小說書庫</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    """
    for novel in all_novels_info:
        cover_path = f"{novel['id']}/{novel['cover']}" if novel['cover'] else "https://placehold.co/400x600/e2e8f0/adb5bd?text=No+Cover"
        main_index_content += f"""
        <a href="{novel['id']}/index.html" class="group block bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="aspect-[2/3] overflow-hidden rounded-t-lg">
                <img src="{cover_path}" alt="{novel['title']}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            </div>
            <div class="p-4"><h2 class="text-lg font-bold text-slate-800 truncate">{novel['title']}</h2></div>
        </a>
        """
    main_index_content += "</div></div></body></html>"
    with open(os.path.join(BASE_OUTPUT_DIR, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(main_index_content)
    print(f"\n🏠 已建立美化版網站主入口 index.html")

    print("\n🎉 所有小說網站生成完畢！")

if __name__ == '__main__':
    main()
