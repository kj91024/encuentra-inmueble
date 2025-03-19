export interface PortalScraperRaw {
    id_portal_scraper: number;
    name: string;
    url_path: string;
    user_agent: string,
    cron_time: number;
    max_attempts: number;
    file: string;
    created_at: Date;
    updated_at: Date;
    last_scraped: Date;
}