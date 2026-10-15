import urllib.request
import re
import html as html_module
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    ("https://zarajutti.com/product/%d8%aa%db%8c%d8%b4%d8%b1%d8%aa-%d8%b7%d8%b1%d8%ad-%d8%af%d8%a7%d9%84%d8%a8%d8%b1%db%8c-%d8%b2%d9%86%d8%a7%d9%86%d9%87-zara-%da%a9%d8%af-262145/", "262145"),
    ("https://zarajutti.com/product/%d8%aa%db%8c%d8%b4%d8%b1%d8%aa-%db%8c%d9%82%d9%87-%da%af%d8%b1%d8%af-%da%af%d9%84%d8%af%d9%88%d8%b2%db%8c-%d8%b4%d8%af%d9%87-%d8%b2%d9%86%d8%a7%d9%86%d9%87-zara-%da%a9%d8%af-261119/", "261119"),
    ("https://zarajutti.com/product/%d8%aa%db%8c%d8%b4%d8%b1%d8%aa-%d8%b2%d9%86%d8%a7%d9%86%d9%87-massimo-dutti-%da%a9%d8%af-261137/", "261137"),
    ("https://zarajutti.com/product/%d8%aa%db%8c%d8%b4%d8%b1%d8%aa-%d8%a8%db%8c%d8%b3%db%8c%da%a9-%d8%b2%d9%86%d8%a7%d9%86%d9%87-zara-%da%a9%d8%af-263134/", "263134"),
    ("https://zarajutti.com/product/%da%a9%d8%b1%d8%a7%d9%be-%d8%aa%db%8c%d8%b4%d8%b1%d8%aa-%db%8c%d9%82%d9%87-%d9%87%d9%81%d8%aa-%da%86%db%8c%d9%86%d8%af%d8%a7%d8%b1-%d8%b2%d9%86%d8%a7%d9%86%d9%87-zara-%da%a9%d8%af-261143/", "261143"),
    ("https://zarajutti.com/product/%da%a9%d8%b1%d8%a7%d9%be-%d8%aa%db%8c%d8%b4%d8%b1%d8%aa-%db%8c%d9%82%d9%87-%d8%af%d8%a7%d8%b1-%d8%b2%d9%86%d8%a7%d9%86%d9%87-zara-%da%a9%d8%af-262128/", "262128"),
    ("https://zarajutti.com/product/%da%a9%d8%b1%d8%a7%d9%be-%d8%ac%d9%84%d9%88-%da%af%d8%b1%d9%87-%d8%a7%db%8c-%d8%b2%d9%86%d8%a7%d9%86%d9%87-zara-%da%a9%d8%af-261114/", "261114"),
    ("https://zarajutti.com/product/%da%a9%d8%b1%d8%a7%d9%be-%d8%aa%db%8c%d8%b4%d8%b1%d8%aa-%d8%b2%d9%86%d8%a7%d9%86%d9%87-%db%8c%d9%82%d9%87-%d8%ae%d8%b4%d8%aa%db%8c-zara-%da%a9%d8%af-261132/", "261132"),
    ("https://zarajutti.com/product/%d8%aa%db%8c%d8%b4%d8%b1%d8%aa-shirt%da%a9%d8%af261149/", "261149")
]

results = {}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5'
}

for url, code in urls:
    print(f"Fetching code {code} from {url}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=20, context=ctx) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            
            # Title
            h1 = re.findall(r'<h1[^>]*product_title[^>]*>(.*?)</h1>', content, re.DOTALL)
            title = re.findall(r'<title>(.*?)</title>', content)
            
            # Prices
            prices = re.findall(r'<bdi>(.*?)</bdi>', content)
            
            # Variations JSON
            variations = []
            var_match = re.search(r'data-product_variations="([^"]+)"', content)
            if var_match:
                raw_json = html_module.unescape(var_match.group(1))
                try:
                    variations = json.loads(raw_json)
                except Exception as e:
                    pass
            
            # Images
            imgs = re.findall(r'https://zarajutti.com/wp-content/uploads/[^"\'\s>]+\.(?:jpg|jpeg|png|webp)', content)
            clean_imgs = []
            for img in imgs:
                # filter thumbnails like -100x100, -300x300 etc
                if re.search(r'-\d+x\d+\.(?:jpg|jpeg|png|webp)', img):
                    continue
                if img not in clean_imgs:
                    clean_imgs.append(img)
            
            # Description
            desc_match = re.search(r'<div[^>]*class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>(.*?)</div>', content, re.DOTALL)
            desc = desc_match.group(1) if desc_match else ""
            
            full_desc_match = re.search(r'<div[^>]*id="tab-description"[^>]*>(.*?)</div>', content, re.DOTALL)
            full_desc = full_desc_match.group(1) if full_desc_match else ""
            
            # Clean desc html tags
            def clean_html(raw_html):
                cleanr = re.compile('<.*?>')
                cleantext = re.sub(cleanr, ' ', raw_html)
                return ' '.join(cleantext.split())

            results[code] = {
                "url": url,
                "code": code,
                "title": clean_html(title[0]) if title else "",
                "h1": clean_html(h1[0]) if h1 else "",
                "prices": [clean_html(p) for p in prices],
                "desc": clean_html(desc),
                "full_desc": clean_html(full_desc),
                "images": clean_imgs,
                "variations_summary": [
                    {
                        "attributes": v.get("attributes"),
                        "price": v.get("display_price"),
                        "regular_price": v.get("display_regular_price"),
                        "image": v.get("image", {}).get("url") if isinstance(v.get("image"), dict) else None,
                        "is_in_stock": v.get("is_in_stock")
                    } for v in variations
                ]
            }
            print(f"  Done {code}: {len(clean_imgs)} images, {len(variations)} variations")
    except Exception as e:
        print(f"  Error fetching {code}: {e}")

with open("/tmp/scraped_products.json", "w", encoding="utf-8") as out:
    json.dump(results, out, ensure_ascii=False, indent=2)

print("Finished all scraping! Saved to /tmp/scraped_products.json")
