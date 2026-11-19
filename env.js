/* ============================================================
   SIMULATED ENVIRONMENT (runs inside Pyodide before your code)
   Gives every lesson three live objects to automate against:
     intune  -> mock Microsoft Intune device management
     graph   -> mock Microsoft Graph REST client (auth, paging)
     falcon  -> mock CrowdStrike Falcon detections
   The app reads __state__() after each run to draw the live portal.
   ============================================================ */

const ENV_PYTHON = `
import json as _json
from datetime import datetime, date, timedelta

# Fixed "today" so date math is deterministic in the simulator
NOW = date(2026, 11, 13)

def _seed_devices():
    return [
        {"id":"DEV-001","name":"LAPTOP-01","os":"Windows","osVersion":"11.0.22631","compliant":True,"managed":True,"owner":"alice@contoso.com","lastSeen":"2026-11-12","category":None,"tags":[]},
        {"id":"DEV-002","name":"MACBOOK-07","os":"macOS","osVersion":"14.5","compliant":True,"managed":True,"owner":"bob@contoso.com","lastSeen":"2026-11-10","category":None,"tags":[]},
        {"id":"DEV-003","name":"IPHONE-22","os":"iOS","osVersion":"17.5","compliant":False,"managed":True,"owner":"carol@contoso.com","lastSeen":"2026-11-13","category":None,"tags":[]},
        {"id":"DEV-004","name":"PIXEL-09","os":"Android","osVersion":"14","compliant":True,"managed":False,"owner":"dave@contoso.com","lastSeen":"2026-10-01","category":None,"tags":[]},
        {"id":"DEV-005","name":"SERVER-01","os":"Windows","osVersion":"2022","compliant":False,"managed":True,"owner":"svc-admin@contoso.com","lastSeen":"2026-09-15","category":None,"tags":[]},
        {"id":"DEV-006","name":"KIOSK-03","os":"Linux","osVersion":"Ubuntu 22.04","compliant":False,"managed":True,"owner":"ops@contoso.com","lastSeen":"2026-11-11","category":None,"tags":[]},
    ]

class _Response:
    def __init__(self, status_code, data, headers=None):
        self.status_code = status_code
        self._data = data
        self.headers = headers or {}
    def json(self):
        return self._data
    @property
    def ok(self):
        return 200 <= self.status_code < 300
    def raise_for_status(self):
        if not self.ok:
            raise Exception("HTTP " + str(self.status_code))
    def __repr__(self):
        return "<Response [" + str(self.status_code) + "]>"

class IntuneSim:
    def __init__(self):
        self.devices = _seed_devices()
        self.audit = []
    def _find(self, device_id):
        for d in self.devices:
            if d["id"] == device_id:
                return d
        return None
    def list_devices(self):
        return self.devices
    def get_device(self, device_id):
        return self._find(device_id)
    def add_tag(self, device_id, tag):
        d = self._find(device_id)
        if d is None:
            raise KeyError("No device " + str(device_id))
        if tag not in d["tags"]:
            d["tags"].append(tag)
            self.audit.append("add_tag " + device_id + " " + tag)
        return d
    def remove_tag(self, device_id, tag):
        d = self._find(device_id)
        if d is None:
            raise KeyError("No device " + str(device_id))
        if tag in d["tags"]:
            d["tags"].remove(tag)
            self.audit.append("remove_tag " + device_id + " " + tag)
        return d
    def set_category(self, device_id, category):
        d = self._find(device_id)
        if d is None:
            raise KeyError("No device " + str(device_id))
        d["category"] = category
        self.audit.append("set_category " + device_id + " " + str(category))
        return d
    def set_compliance(self, device_id, compliant):
        d = self._find(device_id)
        if d is None:
            raise KeyError("No device " + str(device_id))
        d["compliant"] = bool(compliant)
        self.audit.append("set_compliance " + device_id + " " + str(compliant))
        return d
    def offboard(self, device_id):
        d = self._find(device_id)
        if d is None:
            raise KeyError("No device " + str(device_id))
        self.devices = [x for x in self.devices if x["id"] != device_id]
        self.audit.append("offboard " + device_id)
        return True

def _to_graph(d):
    return {
        "id": d["id"],
        "deviceName": d["name"],
        "operatingSystem": d["os"],
        "osVersion": d["osVersion"],
        "complianceState": "compliant" if d["compliant"] else "noncompliant",
        "managementAgent": "mdm" if d["managed"] else "unknown",
        "userPrincipalName": d["owner"],
        "lastSyncDateTime": d["lastSeen"] + "T00:00:00Z",
    }

class GraphClient:
    PAGE = 3
    BASE = "https://graph.microsoft.com/v1.0"
    def __init__(self, intune):
        self._intune = intune
        self.token = None
        self.calls = []
        self._flaky = 0
    def authenticate(self, client_id, client_secret, tenant_id):
        if client_id and client_secret and tenant_id:
            self.token = "eyJ0.simulated-access-token.AbC"
            return self.token
        raise Exception("invalid_client: missing client_id / secret / tenant")
    def _auth_fail(self):
        return _Response(401, {"error": {"code": "InvalidAuthenticationToken", "message": "Access token is empty."}})
    def get(self, url, headers=None):
        self.calls.append(("GET", url))
        if not self.token:
            return self._auth_fail()
        if "managedDevices" in url:
            skip = 0
            if "skiptoken=" in url:
                try:
                    skip = int(url.split("skiptoken=")[1].split("&")[0])
                except Exception:
                    skip = 0
            alld = [_to_graph(d) for d in self._intune.devices]
            page = alld[skip:skip + self.PAGE]
            body = {"value": page}
            nxt = skip + self.PAGE
            if nxt < len(alld):
                body["@odata.nextLink"] = self.BASE + "/deviceManagement/managedDevices?skiptoken=" + str(nxt)
            return _Response(200, body)
        return _Response(404, {"error": {"code": "ResourceNotFound"}})
    def patch(self, url, json=None, headers=None):
        self.calls.append(("PATCH", url))
        if not self.token:
            return self._auth_fail()
        did = url.rstrip("/").split("/")[-1]
        d = self._intune.get_device(did)
        if d is None:
            return _Response(404, {"error": {"code": "ResourceNotFound"}})
        body = json or {}
        if "complianceState" in body:
            d["compliant"] = (body["complianceState"] == "compliant")
            self._intune.audit.append("patch " + did + " complianceState=" + str(body["complianceState"]))
        return _Response(204, {})
    def flaky_get(self, url):
        # A rate-limited endpoint: returns 429 twice, then 200.
        self._flaky += 1
        self.calls.append(("GET", url))
        if self._flaky < 3:
            return _Response(429, {"error": {"code": "TooManyRequests"}}, headers={"Retry-After": "1"})
        return _Response(200, {"value": [_to_graph(d) for d in self._intune.devices]})

class FalconSim:
    def __init__(self):
        self.detections = [
            {"id": "det-1", "severity": "high", "hostname": "LAPTOP-01", "tactic": "Credential Access", "status": "new"},
            {"id": "det-2", "severity": "low", "hostname": "MACBOOK-07", "tactic": "Discovery", "status": "new"},
            {"id": "det-3", "severity": "critical", "hostname": "SERVER-01", "tactic": "Persistence", "status": "new"},
            {"id": "det-4", "severity": "medium", "hostname": "IPHONE-22", "tactic": "Initial Access", "status": "new"},
        ]
    def list_detections(self):
        return self.detections
    def get_detection(self, det_id):
        for d in self.detections:
            if d["id"] == det_id:
                return d
        return None
    def resolve(self, det_id):
        d = self.get_detection(det_id)
        if d is None:
            raise KeyError(det_id)
        d["status"] = "resolved"
        return d

# Known-bad file hashes (MD5) for IOC enrichment lessons
KNOWN_BAD_HASHES = {
    "e99a18c428cb38d5f260853678922e03",  # md5("abc123")
    "5f4dcc3b5aa765d61d8327deb882cf99",  # md5("password")
}

class AwsSim:
    # A tiny boto3-style cloud account for security automation lessons.
    def __init__(self):
        self.buckets = [
            {"name": "app-logs", "public": False, "encrypted": True},
            {"name": "public-assets", "public": True, "encrypted": True},
            {"name": "customer-backups", "public": True, "encrypted": False},
            {"name": "terraform-state", "public": False, "encrypted": False},
        ]
        self.policies = [
            {"name": "ReadOnlyAnalyst", "actions": ["s3:GetObject"], "resource": "arn:aws:s3:::app-logs/*"},
            {"name": "AdminLegacy", "actions": ["*"], "resource": "*"},
            {"name": "DeployBot", "actions": ["s3:PutObject", "s3:GetObject"], "resource": "arn:aws:s3:::public-assets/*"},
            {"name": "BackupSvc", "actions": ["s3:*"], "resource": "arn:aws:s3:::customer-backups/*"},
        ]
        self.audit = []
    def _bucket(self, name):
        for b in self.buckets:
            if b["name"] == name:
                return b
        return None
    def list_buckets(self):
        return self.buckets
    def get_bucket(self, name):
        return self._bucket(name)
    def block_public_access(self, name):
        b = self._bucket(name)
        if b is None:
            raise KeyError("No bucket " + str(name))
        b["public"] = False
        self.audit.append("block_public_access " + name)
        return b
    def enable_encryption(self, name):
        b = self._bucket(name)
        if b is None:
            raise KeyError("No bucket " + str(name))
        b["encrypted"] = True
        self.audit.append("enable_encryption " + name)
        return b
    def list_policies(self):
        return self.policies

# Singletons the lessons automate against
intune = IntuneSim()
graph = GraphClient(intune)
falcon = FalconSim()
aws = AwsSim()

def __state__():
    return _json.dumps({
        "devices": intune.devices,
        "detections": falcon.detections,
        "audit": intune.audit,
        "graphCalls": len(graph.calls),
        "authed": graph.token is not None,
        "buckets": aws.buckets,
        "policies": aws.policies,
    })
`;
