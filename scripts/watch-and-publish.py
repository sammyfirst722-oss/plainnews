import os
import sys
import time
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

KEY_FILE = r"C:\Users\sammy\prompt-builder\play-service-account.json"
PACKAGE_NAME = "app.vercel.plainnews.twa"
AAB_PATH = r"C:\Users\sammy\Downloads\plainnews-v1.0.0.aab"
ICON_PATH = r"C:\Users\sammy\plainnews\public\play-icon-512.png"
FEATURE_PATH = r"C:\Users\sammy\plainnews\public\play-feature-1024x500.png"
SCOPES = ['https://www.googleapis.com/auth/androidpublisher']

SHORT_DESC = "Clear, honest, Zero Fluff news written in everyday words. Distraction-free."
FULL_DESC = """SimplyBigNews brings you the day's top headlines with Zero Fluff—no media spin, sensory overload, or sensationalism. Every story is carefully rewritten in calm, straightforward everyday words so you can stay informed in just two minutes.

WHAT MAKES SIMPLYBIGNEWS DIFFERENT:
• The Big Picture: A 2-sentence summary at the top of every story.
• What Happened: Exactly 3 key bullet points—Zero Fluff.
• Why It Matters: How the news impacts your wallet, family, healthcare, and daily life.
• Plain Words: Tap complex financial or political terms for instant, razor-sharp clarity in everyday words.
• Listen Aloud: Tap the speaker icon to listen to any story hands-free with adjustable narration speeds.
• Easy on the Eyes: One-tap font sizing (Large, Extra Large) and Warm Sepia or Dark reading modes.
• Noise Filter: Paste any bloated article from the web to extract the smart cut and pure signal in one tap.

TOPICS YOU CARE ABOUT:
• Wallet & Money: Savings, housing, markets, and straightforward inflation updates.
• Health & Wellness: Clear nutrition, wellness, and medical breakthroughs explained plainly.
• Technology Made Simple: Everyday tech and AI guides without confusing acronyms.
• Good News: Uplifting community stories, nature recoveries, and inspiring achievements.
• US & World Events: Major headlines across all 50 states delivered with calm, balanced context.

No sensationalism. No clickbait. Just clear, honest news."""

RELEASE_NOTES = """Initial launch of SimplyBigNews: Clear daily news written in everyday words with Zero Fluff, listen-aloud audio narration, and reading comfort controls."""

def try_publish():
    creds = service_account.Credentials.from_service_account_file(KEY_FILE, scopes=SCOPES)
    service = build('androidpublisher', 'v3', credentials=creds)

    try:
        edit = service.edits().insert(packageName=PACKAGE_NAME, body={}).execute()
        edit_id = edit['id']
        print(f"✓ Found package '{PACKAGE_NAME}'! Created edit: {edit_id}")
    except Exception as e:
        return False

    try:
        print("Uploading listings and graphics...")
        service.edits().listings().update(
            packageName=PACKAGE_NAME,
            editId=edit_id,
            language="en-US",
            body={
                "language": "en-US",
                "title": "SimplyBigNews",
                "shortDescription": SHORT_DESC,
                "fullDescription": FULL_DESC
            }
        ).execute()
        print("✓ Store Listing updated!")

        if os.path.exists(ICON_PATH):
            service.edits().images().upload(
                packageName=PACKAGE_NAME,
                editId=edit_id,
                language="en-US",
                imageType="icon",
                media_body=MediaFileUpload(ICON_PATH, mimetype='image/png')
            ).execute()
            print("✓ Icon uploaded!")

        if os.path.exists(FEATURE_PATH):
            service.edits().images().upload(
                packageName=PACKAGE_NAME,
                editId=edit_id,
                language="en-US",
                imageType="featureGraphic",
                media_body=MediaFileUpload(FEATURE_PATH, mimetype='image/png')
            ).execute()
            print("✓ Feature Graphic uploaded!")

        commit_res = service.edits().commit(packageName=PACKAGE_NAME, editId=edit_id).execute()
        print("✓ SUCCESS! Automated metadata and graphics published to Google Play:", commit_res)
        return True
    except Exception as err:
        print("Publish error:", err)
        try:
            service.edits().delete(packageName=PACKAGE_NAME, editId=edit_id).execute()
        except:
            pass
        return False

if __name__ == "__main__":
    print("Watching for app.vercel.plainnews.twa on Play Console...")
    for i in range(120): # 10 minutes
        if try_publish():
            print("All automated assets deployed!")
            sys.exit(0)
        time.sleep(5)
    print("Timeout waiting for package.")
