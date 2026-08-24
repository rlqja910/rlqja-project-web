import base64
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

def decode_base64url(s):
    padding = '=' * (4 - (len(s) % 4))
    return base64.urlsafe_b64decode(s + padding)

def check_keys(pub_b64, priv_b64):
    try:
        priv_bytes = decode_base64url(priv_b64)
        priv_int = int.from_bytes(priv_bytes, 'big')
        priv_key = ec.derive_private_key(priv_int, ec.SECP256R1(), default_backend())
        
        pub_key = priv_key.public_key()
        
        # Uncompressed point representation starts with 0x04
        pub_bytes = pub_key.public_bytes(
            encoding=serialization.Encoding.X962,
            format=serialization.PublicFormat.UncompressedPoint
        )
        
        derived_pub_b64 = base64.urlsafe_b64encode(pub_bytes).decode('ascii').rstrip('=')
        
        print("Original Public Key:", pub_b64)
        print("Derived Public Key: ", derived_pub_b64)
        
        if derived_pub_b64 == pub_b64:
            print("MATCH! The keys are a valid pair.")
        else:
            print("MISMATCH! The private key does not correspond to the public key.")
    except Exception as e:
        print("Error validating keys:", e)

print("Checking old keys:")
check_keys(
    "BNIeDxN-bE10w1cr3CbchMx6FfGPrpqckyE7C-84-QENctUN-9u_RQNwLe8A1UnLnZVitXI9a7H4NtE1T98jkgc",
    "B9nSP-owaNAB0mWtmCSfa82evjZoqUNcVWOf_tGeXHU"
)
