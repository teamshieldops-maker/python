import json, os, sys

here = os.path.dirname(os.path.abspath(__file__))
env = open(os.path.join(here, "_env.py")).read()
lessons = json.load(open(os.path.join(here, "_lessons.json")))

def indent(src):
    return "\n".join("    " + line for line in src.split("\n"))

def build(user_code, test_code):
    return (
        env + "\n"
        "import io, sys\n"
        "_buf = io.StringIO()\n_old = sys.stdout\nsys.stdout = _buf\n"
        "_passed = False\n_feedback = \"\"\n"
        "try:\n"
        f"{indent(user_code) or '    pass'}\n"
        f"{indent(test_code) if test_code else '    pass'}\n"
        "except Exception as _e:\n"
        "    _feedback = 'ERR: ' + str(_e)\n"
        "finally:\n"
        "    sys.stdout = _old\n"
    )

def run(user_code, test_code):
    ns = {}
    try:
        exec(build(user_code, test_code), ns)
    except SyntaxError as e:
        return None, "SYNTAX: " + str(e)
    return bool(ns.get("_passed")), ns.get("_feedback", "")

# 1) every solution must PASS its own checker
fails = 0
for l in lessons:
    passed, fb = run(l["solution"], l["check"])
    if not passed:
        fails += 1
        print(f"[FAIL] {l['id']:>4}  {l['title']}  ->  {fb}")
    else:
        print(f"[PASS] {l['id']:>4}  {l['title']}")

# 2) every starter must be REJECTED (no false positives)
false_pos = 0
for l in lessons:
    passed, _ = run(l["starter"], l["check"])
    if passed:
        false_pos += 1
        print(f"[FALSE-POSITIVE] starter passes: {l['id']}")

print()
print("Solutions:", "ALL PASS ✅" if fails == 0 else f"{fails} FAILED ❌")
print("Starters :", "ALL REJECTED ✅" if false_pos == 0 else f"{false_pos} FALSE POSITIVES ❌")
sys.exit(1 if (fails or false_pos) else 0)
