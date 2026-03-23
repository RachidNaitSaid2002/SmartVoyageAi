import shutil
import os

src = os.path.expanduser("~/.gemini/antigravity/brain/486f1271-a868-4331-8c51-57e494fc4075/smartvoyageai_logo_1773703858592.png")
dest = os.path.join(os.getcwd(), "public", "logo.png")

print(f"Copying from {src} to {dest}")
shutil.copy(src, dest)
print("Done.")
