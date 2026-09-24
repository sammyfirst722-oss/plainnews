import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import os
import time
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

KEY_FILE = r"C:\Users\sammy\prompt-builder\play-service-account.json"
PACKAGE_NAME = "app.vercel.plainnews.twa"
AAB_PATH = r"C:\Users\sammy\Downloads\plainnews-v1.0.0.aab"
ICON_PATH = r"C:\Users\sammy\plainnews\public\play-icon-512.png"
FEATURE_PATH = r"C:\Users\sammy\plainnews\public\play-feature-1024x500.png"
SCOPES = ['https://www.googleapis.com/auth/androidpublisher']

SHORT_DESC = "Clear, calm news rewritten in plain English at an 8th-grade reading level."
assert len(SHORT_DESC) <= 80, f"Short description too long: {len(SHORT_DESC)}"

FULL_DESC = """PlainNews brings you the day's top headlines without media jargon, sensory overload, or sensationalism. Every story is carefully rewritten in plain, straightforward English at an 8th-grade reading level so you can stay informed in just two minutes.

Designed especially for readers 40 and older who value clarity, honest reporting, and comfort.

WHAT MAKES PLAINNEWS DIFFERENT:
• The Big Picture: A 2-sentence summary at the top of every story.
• What Happened: Exactly 3 key bullet points—no fluff.
• Why It Matters: How the news impacts your wallet, retirement, family, healthcare, and daily life.
• Word Helper: Tap difficult financial or political jargon for instant, plain-English definitions.
• Listen Aloud: Tap the speaker icon to listen to any story hands-free with adjustable narration speeds.
• Easy on the Eyes: One-tap font sizing (Large, Extra Large) and Warm Sepia or Dark reading modes.
• Custom Article Simplifier: Paste any complicated article from the web and simplify it into plain English with one tap.

TOPICS YOU CARE ABOUT:
• Wallet & Money: Social Security, Medicare, savings, and straightforward inflation updates.
• Health & Longevity: Clear nutrition, wellness, and medical breakthroughs explained plainly.
• Technology Made Simple: Everyday tech guides without confusing acronyms.
• Good News: Uplifting community stories, nature recoveries, and inspiring achievements.
• US & World Events: Major headlines delivered with calm, balanced context.

No sensationalism. No clickbait. Just clear, honest news."""
assert len(FULL_DESC) <= 4000, f"Full description too long: {len(FULL_DESC)}"

RELEASE_NOTES = """Initial launch of PlainNews: Clear daily news rewritten at an 8th-grade reading level with listen-aloud audio narration and large-print comfort controls."""
assert len(RELEASE_NOTES) <= 500, f"Release notes too long: {len(RELEASE_NOTES)}"

def main():
    print("=" * 60)
    print(" PlainNews Google Play Automated Publisher")
    print("=" * 60)

    if not os.path.exists(KEY_FILE):
        print(f"ERROR: Key file not found: {KEY_FILE}")
        sys.exit(1)

    creds = service_account.Credentials.from_service_account_file(KEY_FILE, scopes=SCOPES)
    service = build('androidpublisher', 'v3', credentials=creds)

    print(f"Checking package '{PACKAGE_NAME}' on Google Play Console...")

    # Check package existence
    try:
        edit = service.edits().insert(packageName=PACKAGE_NAME, body={}).execute()
        edit_id = edit['id']
        print(f"[OK] Found package '{PACKAGE_NAME}'! Created edit session: {edit_id}")
    except Exception as e:
        err_str = str(e)
        if "Package not found" in err_str:
            print("\n" + "!" * 60)
            print(f" Package '{PACKAGE_NAME}' is not yet created in Play Console.")
            print(" Google Play requires clicking 'Create app' once in the console UI.")
            print(" As soon as you click 'Create app', this script will automatically")
            print(" upload the AAB bundle, store graphics, descriptions, and release notes!")
            print("!" * 60 + "\n")
            return False
        else:
            print("Error connecting to Play API:", e)
            return False

    try:
        # 1. Upload AAB Bundle
        print(f"\n1. Uploading Android App Bundle: {AAB_PATH}...")
        media = MediaFileUpload(AAB_PATH, mimetype='application/octet-stream', resumable=True)
        bundle_resp = service.edits().bundles().upload(
            packageName=PACKAGE_NAME,
            editId=edit_id,
            media_body=media
        ).execute()
        version_code = bundle_resp.get('versionCode')
        print(f"✓ Uploaded bundle with versionCode: {version_code}")

        # 2. Update Store Listing (Title, Short Desc, Full Desc)
        print("\n2. Updating Store Listing (en-US)...")
        service.edits().listings().update(
            packageName=PACKAGE_NAME,
            editId=edit_id,
            language="en-US",
            body={
                "language": "en-US",
                "title": "PlainNews - Simple Daily News",
                "shortDescription": SHORT_DESC,
                "fullDescription": FULL_DESC
            }
        ).execute()
        print("✓ Store Listing updated successfully!")

        # 3. Upload App Icon
        if os.path.exists(ICON_PATH):
            print(f"\n3. Uploading App Icon (512x512): {ICON_PATH}...")
            service.edits().images().upload(
                packageName=PACKAGE_NAME,
                editId=edit_id,
                language="en-US",
                imageType="icon",
                media_body=MediaFileUpload(ICON_PATH, mimetype='image/png')
            ).execute()
            print("✓ App Icon uploaded successfully!")

        # 4. Upload Feature Graphic
        if os.path.exists(FEATURE_PATH):
            print(f"\n4. Uploading Feature Graphic (1024x500): {FEATURE_PATH}...")
            service.edits().images().upload(
                packageName=PACKAGE_NAME,
                editId=edit_id,
                language="en-US",
                imageType="featureGraphic",
                media_body=MediaFileUpload(FEATURE_PATH, mimetype='image/png')
            ).execute()
            print("✓ Feature Graphic uploaded successfully!")

        # 5. Set Production Track
        print(f"\n5. Assigning bundle {version_code} to Production Track...")
        track_body = {
            "track": "production",
            "releases": [
                {
                    "name": f"1.0.0 ({version_code})",
                    "versionCodes": [str(version_code)],
                    "status": "draft",
                    "releaseNotes": [
                        {
                            "language": "en-US",
                            "text": RELEASE_NOTES
                        }
                    ]
                }
            ]
        }
        service.edits().tracks().update(
            packageName=PACKAGE_NAME,
            editId=edit_id,
            track="production",
            body=track_body
        ).execute()
        print("✓ Production Track configured successfully!")

        # 6. Commit Edit Session
        print("\n6. Committing all changes to Google Play Console...")
        commit_res = service.edits().commit(
            packageName=PACKAGE_NAME,
            editId=edit_id
        ).execute()
        print("\n" + "=" * 60)
        print("🎉 SUCCESS! PlainNews has been submitted to Google Play Console!")
        print("Commit details:", commit_res)
        print("=" * 60)
        return True

    except Exception as err:
        print("\nError during publication:", err)
        print("Aborting edit session...")
        try:
            service.edits().delete(packageName=PACKAGE_NAME, editId=edit_id).execute()
            print("Edit session deleted.")
        except Exception as del_err:
            pass
        return False

if __name__ == "__main__":
    main()
