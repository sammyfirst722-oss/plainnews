import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

KEY_FILE = r"C:\Users\sammy\prompt-builder\play-service-account.json"
PACKAGE_NAME = "app.vercel.plainnews.twa"
FEATURE_PATH = r"C:\Users\sammy\plainnews\public\play-feature-1024x500.png"
SCOPES = ['https://www.googleapis.com/auth/androidpublisher']

TITLE = "SimplyBigNews"
SHORT_DESC = "Clear, calm news in simple everyday words. Honest, fluff-free & easy to read."
assert len(TITLE) <= 30, f"Title too long: {len(TITLE)}"
assert len(SHORT_DESC) <= 80, f"Short desc too long: {len(SHORT_DESC)}"

FULL_DESC = """SimplyBigNews brings you the day's biggest headlines without media fluff, sensory overload, or sensationalism. Every story is carefully rewritten in plain, everyday words so you can stay informed in just two minutes.

Designed for readers who value clarity, calm reporting, and comfortable reading.

WHAT MAKES SIMPLYBIGNEWS DIFFERENT:
• The Big Picture: A 2-sentence summary at the top of every story.
• What Happened: Exactly 3 key bullet points—clean, fast, and zero fluff.
• Why It Matters: How the news impacts your wallet, retirement, family, healthcare, and daily life.
• Word Helper: Tap difficult financial or political terms for instant, plain-English definitions.
• Listen Aloud: Tap the speaker icon to listen to any story hands-free with adjustable narration speeds.
• Easy on the Eyes: One-tap font sizing (Large, Extra Large) and Warm Sepia or Dark reading modes.
• Custom Article Simplifier: Paste any complicated article from the web and translate it into clear, simple language with one tap.

TOPICS YOU CARE ABOUT:
• Wallet & Money: Social Security, Medicare, savings, and straightforward inflation updates.
• Health & Longevity: Clear nutrition, wellness, and medical breakthroughs explained plainly.
• Technology Made Simple: Everyday tech guides without confusing acronyms.
• Good News: Uplifting community stories, nature recoveries, and inspiring achievements.
• US & World Events: Major headlines delivered with calm, balanced context.

No sensationalism. No clickbait. Just clear, honest news with zero fluff."""

assert len(FULL_DESC) <= 4000, f"Full desc too long: {len(FULL_DESC)}"

RELEASE_NOTES = """Initial launch of SimplyBigNews: Clear daily news rewritten in simple everyday words with zero fluff, listen-aloud audio narration, and large-print comfort controls."""
assert len(RELEASE_NOTES) <= 500, f"Release notes too long: {len(RELEASE_NOTES)}"

def main():
    print("=" * 60)
    print(" Updating Google Play Store Listing: Zero Fluff Edition")
    print("=" * 60)

    creds = service_account.Credentials.from_service_account_file(KEY_FILE, scopes=SCOPES)
    service = build('androidpublisher', 'v3', credentials=creds)

    edit = service.edits().insert(packageName=PACKAGE_NAME, body={}).execute()
    edit_id = edit['id']
    print(f"[OK] Created edit session: {edit_id}")

    try:
        # 1. Update listing
        service.edits().listings().update(
            packageName=PACKAGE_NAME,
            editId=edit_id,
            language='en-US',
            body={
                'language': 'en-US',
                'title': TITLE,
                'shortDescription': SHORT_DESC,
                'fullDescription': FULL_DESC
            }
        ).execute()
        print(f"[OK] Store listing updated to Title: '{TITLE}'")
        print(f"[OK] Short Description: '{SHORT_DESC}'")

        # 2. Update feature graphic banner with Zero Fluff badge
        if os.path.exists(FEATURE_PATH):
            service.edits().images().deleteall(
                packageName=PACKAGE_NAME,
                editId=edit_id,
                language='en-US',
                imageType='featureGraphic'
            ).execute()
            service.edits().images().upload(
                packageName=PACKAGE_NAME,
                editId=edit_id,
                language='en-US',
                imageType='featureGraphic',
                media_body=MediaFileUpload(FEATURE_PATH, mimetype='image/png')
            ).execute()
            print("[OK] Feature Graphic with 'Zero Fluff' badge uploaded!")

        # 3. Update production release notes
        prod_track = service.edits().tracks().get(packageName=PACKAGE_NAME, editId=edit_id, track='production').execute()
        if 'releases' in prod_track and len(prod_track['releases']) > 0:
            for r in prod_track['releases']:
                vc = r.get('versionCodes', ['1'])[0]
                r['name'] = f"1.0.0 ({vc}) - SimplyBigNews"
                r['releaseNotes'] = [{'language': 'en-US', 'text': RELEASE_NOTES}]
            service.edits().tracks().update(packageName=PACKAGE_NAME, editId=edit_id, track='production', body=prod_track).execute()
            print("[OK] Production release name and notes updated!")

        # 4. Commit
        commit_res = service.edits().commit(packageName=PACKAGE_NAME, editId=edit_id).execute()
        print("\n" + "=" * 60)
        print("🎉 SUCCESS! Google Play Console has been updated to Zero Fluff!")
        print("Commit details:", commit_res)
        print("=" * 60)

    except Exception as e:
        print("Error during update:", e)
        try:
            service.edits().delete(packageName=PACKAGE_NAME, editId=edit_id).execute()
        except:
            pass

if __name__ == '__main__':
    main()
