import os
import re
import shutil

# --- 設定 ---
NOVELS_ROOT_DIR = 'novels'
BASE_OUTPUT_DIR = 'novel_site'
TEMPLATE_PATH = 'template.html'
IMAGE_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.gif', '.webp')

def parse_chapter_content(text_content):
    """將純文字內容轉換為 HTML 段落，並優化排版"""
    # 先按連續換行符分割成大段落
    paragraphs = text_content.strip().split('\n\n')
    html_output = []
    for para in paragraphs:
        # 移除段落前後的空白，並將段落內部的換行符轉為 <br>
        # 這能保留您在 txt 中手動換行的效果
        stripped_para = para.strip()
        if stripped_para:
            content_with_breaks = stripped_para.replace(os.linesep, "<br>")
            html_output.append(f'<p class="mb-6 leading-loose tracking-wide">{content_with_breaks}</p>')
    return ''.join(html_output)

def main():
    """主執行函數"""
    print("🚀 開始生成精裝版小說網站...")

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

        # 讀取小說標題
        novel_title = novel_id.replace('-', ' ').title()
        info_file_path = os.path.join(novel_src_path, 'info.txt')
        if os.path.exists(info_file_path):
            with open(info_file_path, 'r', encoding='utf-8') as f:
                novel_title = f.readline().strip()
        
        print(f"✒️ 小說標題: {novel_title}")

        # 複製靜態檔案並尋找封面
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
        
        all_chapters_info = []
        for filename in chapter_files:
            with open(os.path.join(novel_src_path, filename), 'r', encoding='utf-8') as f:
                title = f.readline().strip()
            clean_name = re.sub(r'^\d+_', '', os.path.splitext(filename)[0])
            html_filename = f"{clean_name}.html"
            all_chapters_info.append({'title': title, 'html_filename': html_filename})

        for i, filename in enumerate(chapter_files):
            current_chapter_info = all_chapters_info[i]
            with open(os.path.join(novel_src_path, filename), 'r', encoding='utf-8') as f:
                f.readline()
                content_text = f.read()
            
            content_html = parse_chapter_content(content_text)
            
            # 生成目錄 HTML
            nav_html = ''
            for chapter_info in all_chapters_info:
                is_active = (chapter_info['html_filename'] == current_chapter_info['html_filename'])
                active_class = 'bg-[var(--active-bg-main)] font-bold text-[var(--text-main)]' if is_active else 'text-[var(--link-main)]'
                nav_html += f'<a href="{chapter_info["html_filename"]}" class="chapter-link block p-3 rounded-md hover:bg-[var(--active-bg-main)] transition-colors duration-200 {active_class}">{chapter_info["title"]}</a>'

            # 生成上/下一章導覽 HTML
            chapter_nav_html = '<div class="flex justify-between mt-12 pt-6 border-t border-[var(--border-main)]">'
            if i > 0: # 如果不是第一章，顯示上一章按鈕
                prev_chapter = all_chapters_info[i-1]
                chapter_nav_html += f'<a href="{prev_chapter["html_filename"]}" class="nav-btn">← 上一章</a>'
            else:
                chapter_nav_html += '<div></div>' # 佔位
            
            if i < len(all_chapters_info) - 1: # 如果不是最後一章，顯示下一章按鈕
                next_chapter = all_chapters_info[i+1]
                chapter_nav_html += f'<a href="{next_chapter["html_filename"]}" class="nav-btn">下一章 →</a>'
            else:
                chapter_nav_html += '<div></div>' # 佔位
            chapter_nav_html += '</div>'


            # 替換範本
            output_html = template_html.replace('{{NOVEL_TITLE}}', novel_title)
            output_html = output_html.replace('{{PAGE_TITLE}}', f"{current_chapter_info['title']} - {novel_title}")
            output_html = output_html.replace('{{CHAPTER_TITLE}}', current_chapter_info['title'])
            output_html = output_html.replace('{{CHAPTER_CONTENT_HTML}}', content_html)
            output_html = output_html.replace('{{CHAPTER_LIST_HTML}}', nav_html)
            output_html = output_html.replace('{{MOBILE_CHAPTER_LIST_HTML}}', nav_html)
            output_html = output_html.replace('{{COVER_IMAGE_HTML}}', cover_image_html)
            output_html = output_html.replace('{{CHAPTER_NAVIGATION}}', chapter_nav_html)
            
            output_file_path = os.path.join(novel_output_path, current_chapter_info['html_filename'])
            with open(output_file_path, 'w', encoding='utf-8') as f:
                f.write(output_html)
            print(f"  -> ✅ 已生成: {current_chapter_info['title']}")

        if all_chapters_info:
            first_chapter_filename = all_chapters_info[0]['html_filename']
            index_content = f'<meta http-equiv="refresh" content="0; url={first_chapter_filename}" />'
            with open(os.path.join(novel_output_path, 'index.html'), 'w', encoding='utf-8') as f:
                f.write(index_content)
            print(f"  -> ➡️ 已建立小說入口 index.html")

    # 建立更美觀的網站主入口頁面
    main_index_content = f"""
    <!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><title>小說書庫</title>
    <script src="https://cdn.tailwindcss.com"></script>
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
