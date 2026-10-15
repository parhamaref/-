import urllib.request
import re
import html as html_module
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    ("https://zarajutti.com/product/%d8%ac%d8%a7%d9%85%d9%be-%d8%b3%d9%88%d8%aa-%d8%b2%d9%86%d8%a7%d9%86%d9%87-zara-%da%a9%d8%af-262190/", "262190"),
    ("https://zarajutti.com/product/%d8%ac%d8%a7%d9%85%d9%be-%d8%b3%d9%88%d8%aa-%d8%ac%db%8c%d8%a8%d8%af%d8%a7%d8%b1-%d8%b2%d9%86%d8%a7%d9%86%d9%87-zara-%da%a9%d8%af-262197/", "262197")
]

results = {}

for url, code in urls:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    )
    try:
        with urllib.request.urlopen(req, timeout=15, context=ctx) as response:
            html = response.read().decode("utf-8", errors="ignore")
            
            # Title
            title_m = re.search(r"<h1[^>]*class=[\"'][^\"']*product_title[^\"']*[\"'][^>]*>(.*?)</h1>", html, re.DOTALL)
            title = html_module.unescape(title_m.group(1).strip()) if title_m else ""
            if not title:
                t2 = re.search(r"<title>(.*?)</title>", html)
                title = html_module.unescape(t2.group(1).strip()) if t2 else ""
                
            # Price
            price_m = re.findall(r"<bdi>([\d,\u06F0-\u06F9]+)&nbsp;<span class=\"woocommerce-Price-currencySymbol\">", html)
            if not price_m:
                price_m = re.findall(r"([\d,]+)\s*(?:تومان|تومان|IRT)", html)
                
            # Variations JSON
            variations_m = re.search(r"data-product_variations=\"([^\"]+)\"", html)
            variations = []
            if variations_m:
                try:
                    variations = json.loads(html_module.unescape(variations_m.group(1)))
                except Exception as e:
                    pass
                    
            # Images
            imgs = re.findall(r"https://zarajutti\.com/wp-content/uploads/[^\"'\s>]+\.(?:jpg|jpeg|png|webp)", html)
            clean_imgs = []
            for img in imgs:
                img_clean = re.sub(r"-\d+x\d+(\.[a-zA-Z]+)$", r"\1", img)
                fn = img_clean.split("/")[-1].lower()
                if "logo" not in fn and "icon" not in fn and fn != "jutti.jpg" and fn != "jutti.png" and fn != "zarajutti.png":
                    if img_clean not in clean_imgs:
                        clean_imgs.append(img_clean)
                        
            # Description & spec table
            desc_m = re.search(r"<div[^>]*id=\"tab-description\"[^>]*>(.*?)</div>", html, re.DOTALL)
            desc = html_module.unescape(desc_m.group(1)) if desc_m else ""
            
            table_m = re.search(r"<table[^>]*class=\"woocommerce-product-attributes[^\"]*\"[^>]*>(.*?)</table>", html, re.DOTALL)
            table_html = html_module.unescape(table_m.group(1)) if table_m else ""
            
            results[code] = {
                "url": url,
                "title": title,
                "prices": price_m,
                "clean_images": clean_imgs,
                "variations_count": len(variations),
                "variations": [
                    {
                        "attributes": v.get("attributes"),
                        "price": v.get("display_price"),
                        "regular_price": v.get("display_regular_price"),
                        "in_stock": v.get("is_in_stock"),
                        "image": v.get("image", {}).get("url")
                    } for v in variations
                ],
                "desc_snippet": desc[:600],
                "table_html": table_html[:1000]
            }
            print(f"DONE {code}: {title} | Images: {len(clean_imgs)} | Variations: {len(variations)}")
    except Exception as e:
        print(f"ERR {code}: {e}")

with open("scraped_jumpsuits.json", "w") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
