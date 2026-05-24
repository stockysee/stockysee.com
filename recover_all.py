import json
import os
import subprocess

transcript_path = r'C:\Users\HYPE\.gemini\antigravity\brain\0e18fba8-9dc5-45da-8351-924137dd880e\.system_generated\logs\transcript.jsonl'
files_to_recover = [
    'app/dashboard/storefront/builder/BuilderSidebar.tsx',
    'app/dashboard/storefront/builder/useBuilderState.tsx',
    'components/storefront/sections/BuilderSection.tsx'
]

def recover_file(relative_path):
    target_file = os.path.join(r'C:\Users\HYPE\project\villa-engine\engine\BACKUP-ENGINE\BUILD\stockysee', relative_path.replace('/', '\\'))
    
    result = subprocess.run(['git', 'show', 'HEAD:' + relative_path], capture_output=True, text=True, encoding='utf-8')
    content_lines = result.stdout.split('\n')
    
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
                            # using basename or suffix
                            if tgt.replace('\\', '/').endswith(relative_path):
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
        if rep['time'] > '2026-05-21T21:40:35Z':
            continue
            
        def apply_chunk(chunk, lines):
            sl = chunk.get('StartLine', 1) - 1
            el = chunk.get('EndLine', len(lines))
            tc = chunk.get('TargetContent', '')
            rc = chunk.get('ReplacementContent', '')
            
            tc_lines = tc.split('\n')
            rc_lines = rc.split('\n')
            
            # Simple matching: replace the exact block if found in sl:el
            block = '\n'.join(lines[sl:el])
            tc_norm = tc.replace('\r\n', '\n')
            if tc_norm in block:
                new_block = block.replace(tc_norm, rc.replace('\r\n', '\n'))
                new_lines = new_block.split('\n')
                lines[sl:el] = new_lines
                return True
            else:
                # Try finding it globally
                global_block = '\n'.join(lines)
                if tc_norm in global_block:
                    new_block = global_block.replace(tc_norm, rc.replace('\r\n', '\n'))
                    lines[:] = new_block.split('\n')
                    return True
                return False

        name = rep['name']
        args = rep['args']
        if name == 'replace_file_content':
            if apply_chunk(args, content_lines):
                success_count += 1
            else:
                fail_count += 1
        elif name == 'multi_replace_file_content':
            for chunk in args.get('ReplacementChunks', []):
                if isinstance(chunk, dict):
                    if apply_chunk(chunk, content_lines):
                        success_count += 1
                    else:
                        fail_count += 1

    with open(target_file, 'w', encoding='utf-8', newline='') as f:
        f.write('\n'.join(content_lines))
        
    print(f'{relative_path}: Applied {success_count} edits successfully. {fail_count} failed.')

for f in files_to_recover:
    recover_file(f)
