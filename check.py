import json

transcript_path = r'C:\Users\HYPE\.gemini\antigravity\brain\0e18fba8-9dc5-45da-8351-924137dd880e\.system_generated\logs\transcript.jsonl'

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'PLANNER_RESPONSE' and data.get('tool_calls'):
                for call in data['tool_calls']:
                    name = call.get('name')
                    args = call.get('args', {})
                    if name == 'replace_file_content':
                        tgt = args.get('TargetFile', '')
                        if 'BuilderSidebar.tsx' in tgt:
                            print(repr(args.get('TargetContent'))[:100])
                            exit(0)
                    elif name == 'multi_replace_file_content':
                        tgt = args.get('TargetFile', '')
                        if 'BuilderSidebar.tsx' in tgt:
                            print(repr(args.get('ReplacementChunks')[0].get('TargetContent'))[:100])
                            exit(0)
        except Exception as e:
            pass
