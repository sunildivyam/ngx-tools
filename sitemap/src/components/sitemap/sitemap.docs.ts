
const sitemapUrls = [
    {
        "loc": {
            "_text": "https://www.annuadvent.com/"
        },
        "lastmod": {
            "_text": "2023-02-20T20:51:25+00:00"
        },
        "priority": {
            "_text": "1.00"
        }
    },
    {
        "loc": {
            "_text": "https://www.annuadvent.com/login"
        },
        "lastmod": {
            "_text": "2023-02-20T20:51:25+00:00"
        },
        "priority": {
            "_text": "1.00"
        }
    }
];

const newUrls = [
    {
        "loc": {
            "_text": "https://www.annuadvent.com/technology"
        },
        "lastmod": {
            "_text": "2023-02-20T20:51:25+00:00"
        },
        "priority": {
            "_text": "0.80"
        }
    },
    {
        "loc": {
            "_text": "https://www.annuadvent.com/around-the-world"
        },
        "lastmod": {
            "_text": "2023-02-20T20:51:25+00:00"
        },
        "priority": {
            "_text": "0.80"
        }
    },
    {
        "loc": {
            "_text": "https://www.annuadvent.com/login"
        },
        "lastmod": {
            "_text": "2023-02-24T20:51:25+00:00"
        },
        "priority": {
            "_text": "1.00"
        }
    }
];

const newSitemapUrls = [
    {
        "loc": {
            "_text": "https://www.annuadvent.com/"
        },
        "lastmod": {
            "_text": "2023-02-20T20:51:25+00:00"
        },
        "priority": {
            "_text": "1.00"
        }
    },
    ...(newUrls.map(url => {
        if (url.loc._text === 'https://www.annuadvent.com/login') {
            return { ...url, status: false }
        } else {
            return { ...url, status: true }
        }
    }))
];

export const SitemapComponent: any = {
    projectionContent: '',
    inputPropsValues: {
        sitemapInfo: {
            "updated": "Tue, 21 Feb 2023 18:44:00 GMT"
        },
        sitemap: {
            "urlset": {
                "_attributes": {
                    "xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "xsi:schemaLocation": "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
                },
                "url": sitemapUrls
            }
        },
        newUrls,
        newSitemap: {
            "urlset": {
                "_attributes": {
                    "xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "xsi:schemaLocation": "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
                },
                "url": newSitemapUrls
            }
        }
    }
}
