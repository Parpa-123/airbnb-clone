import sys
import os

# Add backend to sys path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

try:
    from cashfree_pg.api_client import Cashfree
    print("Methods in Cashfree:")
    methods = [m for m in dir(Cashfree) if not m.startswith('_')]
    print(methods)
except Exception as e:
    print("Error:", e)
