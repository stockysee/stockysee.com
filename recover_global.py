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
                            # Strip literal quotes
                            tgt = tgt.strip('"').strip("'")
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
            
        def apply_chunk(chunk, current_content):
            tc = chunk.get('TargetContent', '').strip('"').strip("'") if isinstance(chunk.get('TargetContent'), str) and chunk.get('TargetContent').startswith('"') else chunk.get('TargetContent', '')
            rc = chunk.get('ReplacementContent', '').strip('"').strip("'") if isinstance(chunk.get('ReplacementContent'), str) and chunk.get('ReplacementContent').startswith('"') else chunk.get('ReplacementContent', '')
            
            # actually wait, if the JSON was double encoded, `json.loads` already decoded the first layer. The literal quotes mean the model put them.
            # let's just use json.loads again if it starts with quote
            if tc.startswith('"') and tc.endswith('"'):
                try: tc = json.loads(tc)
                except: pass
            if rc.startswith('"') and rc.endswith('"'):
                try: rc = json.loads(rc)
                except: pass

            tc_norm = tc.replace('\r\n', '\n')
            rc_norm = rc.replace('\r\n', '\n')
            
            if tc_norm in current_content:
                return True, current_content.replace(tc_norm, rc_norm)
            
            # Try splitting by lines and doing a loose match if indentation or trailing space changed
            return False, current_content

        name = rep['name']
        args = rep['args']
        if name == 'replace_file_content':
            success, content = apply_chunk(args, content)
            if success:
                success_count += 1
            else:
                fail_count += 1
                print(f"Failed replace in {relative_path} at {rep['time']}")
        elif name == 'multi_replace_file_content':
            for chunk in args.get('ReplacementChunks', []):
                if isinstance(chunk, dict):
                    success, content = apply_chunk(chunk, content)
                    if success:
                        success_count += 1
                    else:
                        fail_count += 1
                        print(f"Failed multi chunk in {relative_path} at {rep['time']}")

    with open(target_file, 'w', encoding='utf-8', newline='') as f:
        f.write(content)
        
    print(f'{relative_path}: Applied {success_count} edits successfully. {fail_count} failed.')

for f in files_to_recover:
    recover_file(f)
