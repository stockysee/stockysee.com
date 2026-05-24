import json
import os
import subprocess

transcript_path = r'C:\Users\HYPE\.gemini\antigravity\brain\0e18fba8-9dc5-45da-8351-924137dd880e\.system_generated\logs\transcript.jsonl'
target_file = r'C:\Users\HYPE\project\villa-engine\engine\BACKUP-ENGINE\BUILD\stockysee\app\dashboard\storefront\builder\BuilderSidebar.tsx'

# Get base content from git HEAD
result = subprocess.run(['git', 'show', 'HEAD:app/dashboard/storefront/builder/BuilderSidebar.tsx'], capture_output=True, text=True, encoding='utf-8')
content = result.stdout

replacements = []

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'PLANNER_RESPONSE' and data.get('tool_calls'):
                for call in data['tool_calls']:
                    name = call.get('name')
                    args = call.get('args', {})
                    if name in ['replace_file_content', 'multi_replace_file_content']:
                        tgt = args.get('TargetFile', '')
                        if 'BuilderSidebar.tsx' in tgt:
                            replacements.append({
                                'name': name,
                                'args': args,
                                'time': data.get('created_at')
                            })
        except Exception as e:
            pass

success_count = 0
fail_count = 0

for rep in replacements:
    name = rep['name']
    args = rep['args']
    
    if rep['time'] > '2026-05-21T21:40:35Z':
        continue
        
    if name == 'replace_file_content':
        tc = args.get('TargetContent', '')
        rc = args.get('ReplacementContent', '')
        if tc in content:
            content = content.replace(tc, rc)
            success_count += 1
        else:
            tc_norm = tc.replace('\r\n', '\n')
            content_norm = content.replace('\r\n', '\n')
            if tc_norm in content_norm:
                content = content_norm.replace(tc_norm, rc.replace('\r\n', '\n'))
                success_count += 1
            else:
                fail_count += 1
    elif name == 'multi_replace_file_content':
        chunks = args.get('ReplacementChunks', [])
        for chunk in chunks:
            if isinstance(chunk, dict):
                tc = chunk.get('TargetContent', '')
                rc = chunk.get('ReplacementContent', '')
                if tc in content:
                    content = content.replace(tc, rc)
                    success_count += 1
                else:
                    tc_norm = tc.replace('\r\n', '\n')
                    content_norm = content.replace('\r\n', '\n')
                    if tc_norm in content_norm:
                        content = content_norm.replace(tc_norm, rc.replace('\r\n', '\n'))
                        success_count += 1
                    else:
                        fail_count += 1

with open(target_file + '.recovered', 'w', encoding='utf-8', newline='') as f:
    f.write(content)

print(f'Applied {success_count} edits successfully. {fail_count} failed.')
