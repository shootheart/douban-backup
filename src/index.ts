import { consola } from "consola";
import { fetchRSSFeeds, handleRSSFeeds } from "./handle-rss";
import handleNotion from "./handle-notion";
import handleNeodb from "./handle-neodb";
import { ItemStatus } from "./types";

async function main(): Promise<void> {
    const feeds = await fetchRSSFeeds();
    if (feeds.length === 0) {
        consola.info("No new items.");
        return;
    }

    const normalizedFeeds = handleRSSFeeds(feeds);
    const completeFeeds = normalizedFeeds.filter(
        (f) => f.status === ItemStatus.Complete,
    );

    if (completeFeeds.length && process.env.NOTION_TOKEN) {
        await handleNotion(completeFeeds);
    }

    if (process.env.NEODB_API_TOKEN) {
        await handleNeodb(normalizedFeeds);
    }
}

main();
