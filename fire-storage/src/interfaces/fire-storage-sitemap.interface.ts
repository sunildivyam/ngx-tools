export interface SitemapItem {
    loc: {
        _text: string;
    },
    lastmod: {
        _text: string;
    },
    priority: {
        _text: string;
    },
    status?: boolean // true = 'append' | false = 'update' | missing property (undefined) = normal.
};

export interface SitemapInfo {
    updated: string;
};

export interface Sitemap {
    urlset: {
        _attributes: {
            xmlns: string;
            'xmlns:xsi': string;
            'xsi:schemaLocation': string;
        },
        url: Array<SitemapItem>
    }
};

export interface SitemapResponse {
    sitemapInfo: SitemapInfo,
    sitemap: Sitemap
};
