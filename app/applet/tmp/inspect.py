import urllib.request
import re
import html as html_module
import json

urls = [
    ("https://zarajutti.com/product/%d8%aa%d8%a7%d9%be-%d8%b2%d9%86%d8%a7%d9%86%d9%87-womans-dress%da%a9%d8%af261123/", "261123"),
    ("https://zarajutti.com/product/%d8%aa%d8%a7%d9%be-%da%af%d8%b1%d9%87%d8%a7%db%8c-%d8%b1%d8%a7%d9%87%d8%b1%d8%a7%d9%87-%d8%b2%d9%86%d8%a7%d9%86%d9%87-zara-%da%a9%d8%af-263151/", "263151"),
    ("https://zarajutti.com/product/%da%a9%d8%b1%d8%a7%d9%be-%d8%aa%d8%a7%d9%be-%d8%a8%d9%86%d8%af%db%8c-%d8%b2%d9%86%d8%a7%d9%86%d9%87-%d8%b1%db%8c%d8%a8%d8%af%d8%a7%d8%b1-zara-%da%a9%d8%af-261106/", "261106")
]

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

res = {}

for url, code in urls:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode("utf-8", errors="ignore")
        
        # All image links inside woocommerce gallery
        gallery_links = re.findall(r'<div[^>]*class="[^"]*woocommerce-product-gallery__image[^"]*"[^>]*data-thumb="([^"]+)"[^>]*>.*?<a[^>]*href="([^"]+)"', html, re.DOTALL)
        if not gallery_links:
            gallery_links = re.findall(r'<a[^>]*href="(https://zarajutti\.com/wp-content/uploads/[^"]+\.(?:jpeg|jpg|png|webp))"', html)
        
        # variations
        vars_data = []
        var_match = re.search(r'data-product_variations="([^"]+)"', html)
        if var_match:
            vars_json = json.loads(html_module.unescape(var_match.group(1)))
            for v in vars_json:
                vars_data.append({
                    "attributes": v.get("attributes"),
                    "display_price": v.get("display_price"),
                    "display_regular_price": v.get("display_regular_price"),
                    "image": v.get("image", {}).get("full_src") or v.get("image", {}).get("src") or v.get("image", {}).get("url")
                })
        
        # h1 and title
        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.DOTALL)
        h1_text = re.sub(r"<[^>]+>", "", h1.group(1)).strip() if h1 else ""

        # prices
        prices = [re.sub(r"<[^>]+>", "", p).strip() for p in re.findall(r"<bdi>(.*?)</bdi>", html)]
        
        # short desc and tab desc
        desc = ""
        td = re.search(r'id="tab-description"[^>]*>(.*?)</div>', html, re.DOTALL)
        if td:
            desc = re.sub(r"<[^>]+>", " ", td.group(1)).strip()
        else:
            sd = re.search(r'class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>(.*?)</div>', html, re.DOTALL)
            if sd:
                desc = re.sub(r"<[^>]+>", " ", sd.group(1)).strip()

        # all gallery imgs
        all_imgs = re.findall(r'(https://zarajutti\.com/wp-content/uploads/\d{4}/\d{2}/[^"\'\s>]+\.(?:jpg|jpeg|png|webp))', html)
        clean_imgs = []
        for img in all_imgs:
            if not any(x in img for x in ["-100x100", "-150x150", "-300x300", "-240x300", "-510x", "-768x", "logo", "icon", "jutti", "admin"]):
                if img not in clean_imgs:
                    clean_imgs.append(img)
                    
        res[code] = {
            "h1": h1_text,
            "prices": prices,
            "gallery_links": gallery_links,
            "clean_imgs": clean_imgs,
            "variations": vars_data,
            "desc": desc
        }

print(json.dumps(res, indent=2, ensure_ascii=False))
